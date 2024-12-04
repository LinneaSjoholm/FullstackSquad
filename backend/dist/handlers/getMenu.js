var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { db } from '../services/db';
export const getMenu = (event) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('API_KEY in environment:', process.env.API_KEY);
    const apiKey = event.headers['x-api-key'];
    console.log('Received API key:', apiKey);
    if (apiKey !== process.env.API_KEY) {
        return {
            statusCode: 403,
            body: JSON.stringify({ message: 'Forbidden: Invalid API key' }),
        };
    }
    const queryStringParameters = event.queryStringParameters || {};
    const sortBy = (queryStringParameters === null || queryStringParameters === void 0 ? void 0 : queryStringParameters.sortBy) || 'id'; // Default sorting criterion
    const categoryFilter = (queryStringParameters === null || queryStringParameters === void 0 ? void 0 : queryStringParameters.category) || ''; // Filter by category
    const priceFilter = queryStringParameters === null || queryStringParameters === void 0 ? void 0 : queryStringParameters.price; // Filter by price if defined
    const params = {
        TableName: 'MenuTable',
    };
    try {
        const data = yield db.scan(params);
        if (!data.Items || !Array.isArray(data.Items)) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'No items found in the menu.' }),
            };
        }
        // Filter by category if categoryFilter is defined
        let filteredItems = data.Items;
        if (categoryFilter) {
            filteredItems = filteredItems.filter((item) => item.category && item.category === categoryFilter);
        }
        // Filter by price if priceFilter is defined
        if (priceFilter) {
            const [minPrice, maxPrice] = priceFilter.split('-').map((price) => parseFloat(price));
            if (isNaN(minPrice) || isNaN(maxPrice)) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: 'Invalid price filter format. Use format minPrice-maxPrice (e.g. 10-20)' }),
                };
            }
            filteredItems = filteredItems.filter((item) => {
                const itemPrice = parseFloat(item.price);
                return itemPrice >= minPrice && itemPrice <= maxPrice;
            });
        }
        // Sort based on sortBy parameter
        let sortedItems = filteredItems;
        if (sortBy === 'price') {
            sortedItems = sortedItems.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        }
        else if (sortBy === 'category') {
            sortedItems = sortedItems.sort((a, b) => a.category.localeCompare(b.category));
        }
        else if (sortBy === 'popularity') {
            // Sort by popularity in descending order (ensure popularity is treated as a number)
            sortedItems = sortedItems.sort((a, b) => {
                // Ensure popularity is a valid number
                const popA = Number(a.popularity) || 0; // If not a valid number, default to 0
                const popB = Number(b.popularity) || 0; // If not a valid number, default to 0
                return popB - popA; // Sort in descending order (more popular comes first)
            });
        }
        else if (sortBy === 'all') {
            // Sort alphabetically by name
            sortedItems = sortedItems.sort((a, b) => a.name.localeCompare(b.name));
        }
        else {
            sortedItems = sortedItems.sort((a, b) => a.id.localeCompare(b.id));
        }
        // Format prices with $ symbol
        sortedItems = sortedItems.map((item) => (Object.assign(Object.assign({}, item), { price: `$${parseFloat(item.price).toFixed(2)}` })));
        return {
            statusCode: 200,
            body: JSON.stringify(sortedItems),
        };
    }
    catch (error) {
        console.error('Error fetching menu:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to fetch menu', error: error.message }),
        };
    }
});
