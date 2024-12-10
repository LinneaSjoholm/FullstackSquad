var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { db } from '../services/db'; // Använd db-modulen
export const getMenu = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const apiKey = event.headers['x-api-key'];
    const sortBy = ((_a = event.queryStringParameters) === null || _a === void 0 ? void 0 : _a.sortBy) || 'popularity'; // Sorteringsparameter från användaren
    if (apiKey !== process.env.API_KEY) {
        return {
            statusCode: 403,
            body: JSON.stringify({ message: 'Forbidden: Invalid API key' }),
        };
    }
    const params = {
        TableName: 'MenuTable',
    };
    try {
        // Använd db.scan istället för dynamoDb.scan
        const result = yield db.scan(params);
        if (!result.Items || result.Items.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'No menu items found' }),
            };
        }
        // Sorteringsfunktion
        const sortMenuItems = (items, sortBy) => {
            return items.sort((a, b) => {
                if (sortBy === 'popularity') {
                    return (b.popularity || 0) - (a.popularity || 0);
                }
                else if (sortBy === 'price') {
                    return a.price - b.price;
                }
                else {
                    return a.name.localeCompare(b.name);
                }
            });
        };
        // Gruppera menyn per kategori
        const menuGroupedByCategory = result.Items.reduce((acc, item) => {
            const dbItem = item;
            const { category, id, description } = dbItem, filteredItem = __rest(dbItem, ["category", "id", "description"]);
            const itemCategory = category || "Others";
            const reorderedItem = {
                id: dbItem.id, // Lägg till id
                quantity: dbItem.quantity || 1, // Lägg till quantity (om den inte finns, sätt ett defaultvärde)
                name: filteredItem.name,
                price: filteredItem.price,
                ingredients: filteredItem.ingredients,
                lactoseFree: filteredItem.lactoseFree,
                glutenFree: filteredItem.glutenFree,
                popularity: filteredItem.popularity,
                description: dbItem.description || '', // Lägg till description
            };
            if (!acc[itemCategory]) {
                acc[itemCategory] = [];
            }
            acc[itemCategory].push(reorderedItem);
            return acc;
        }, {});
        // Sortera per användarens val av sorteringsparameter
        for (const category in menuGroupedByCategory) {
            menuGroupedByCategory[category] = sortMenuItems(menuGroupedByCategory[category], sortBy);
        }
        return {
            statusCode: 200,
            body: JSON.stringify({ menu: menuGroupedByCategory }),
        };
    }
    catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error fetching menu', error }),
        };
    }
});
