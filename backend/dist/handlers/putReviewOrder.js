var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
const dynamoDb = new DocumentClient();
// Utility function to normalize ingredients
const normalizeIngredients = (ingredients) => {
    return ingredients ? ingredients.map((ingredient) => ingredient.S) : [];
};
export const putReviewOrder = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    let items = [];
    let customerName;
    let customerPhone;
    try {
        const parsedBody = JSON.parse(event.body);
        items = parsedBody.items;
        customerName = parsedBody.customerName;
        customerPhone = parsedBody.customerPhone;
    }
    catch (error) {
        console.error("Error parsing body:", error);
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid JSON format' }),
        };
    }
    const orderId = (_a = event.pathParameters) === null || _a === void 0 ? void 0 : _a.id;
    if (!orderId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Order ID is required' }),
        };
    }
    const orderParams = {
        TableName: 'OrdersTable',
        Key: { orderId },
    };
    try {
        const orderResult = yield dynamoDb.get(orderParams).promise();
        if (!orderResult.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Order not found' }),
            };
        }
        const originalItems = orderResult.Item.items || [];
        const menuParams = { TableName: 'MenuTable' };
        const menuResult = yield dynamoDb.scan(menuParams).promise();
        if (!menuResult.Items || menuResult.Items.length === 0) {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Menu data not found in DynamoDB' }),
            };
        }
        const updatedItemsDetails = [];
        let totalPrice = 0;
        for (const itemToUpdate of items) {
            itemToUpdate.ingredientsToAdd = itemToUpdate.ingredientsToAdd || [];
            itemToUpdate.ingredientsToRemove = itemToUpdate.ingredientsToRemove || [];
            const originalItemIndex = originalItems.findIndex((original) => original.id === itemToUpdate.id);
            // If item exists in the original order, update it
            if (originalItemIndex !== -1) {
                const originalItem = originalItems[originalItemIndex];
                const menuItem = (_b = menuResult.Items) === null || _b === void 0 ? void 0 : _b.find((item) => item.id === itemToUpdate.id);
                const menuIngredients = (menuItem === null || menuItem === void 0 ? void 0 : menuItem.ingredients) || [];
                originalItem.ingredients = originalItem.ingredients || [...menuIngredients];
                // Add new ingredients and remove the specified ones
                originalItem.ingredients = [
                    ...new Set([...originalItem.ingredients, ...itemToUpdate.ingredientsToAdd]),
                ];
                // Remove ingredients
                if (itemToUpdate.ingredientsToRemove.length > 0) {
                    originalItem.ingredients = originalItem.ingredients.filter((ingredient) => !itemToUpdate.ingredientsToRemove.includes(ingredient));
                    updatedItemsDetails.push(`Removed ingredients: ${itemToUpdate.ingredientsToRemove.join(", ")}`);
                }
                // Handle quantity change: log removal if quantity decreases
                if (itemToUpdate.quantity === 0) {
                    originalItems.splice(originalItemIndex, 1); // Remove item from the originalItems list
                    updatedItemsDetails.push(`Removed item: ${originalItem.name}`);
                    // Remove associated drink if exists
                    if (originalItem.drinkId) {
                        originalItems.forEach(item => {
                            if (item.drinkId === originalItem.drinkId) {
                                item.drinkId = undefined; // Remove associated drink
                                item.drinkName = undefined; // Remove associated drink name
                                updatedItemsDetails.push(`Removed associated drink: ${item.drinkName}`);
                            }
                        });
                    }
                    continue; // Skip the rest of the processing for removed items
                }
                // Log removal if quantity decreased
                if (itemToUpdate.quantity < originalItem.quantity) {
                    const quantityRemoved = originalItem.quantity - itemToUpdate.quantity;
                    updatedItemsDetails.push(`Removed ${quantityRemoved} of ${originalItem.name}`);
                }
                // Otherwise, process the item (update ingredients, quantity, etc.)
                if (itemToUpdate.ingredientsToAdd.length > 0)
                    updatedItemsDetails.push(`Added ingredients: ${itemToUpdate.ingredientsToAdd.join(", ")}`);
                if (itemToUpdate.ingredientsToRemove.length > 0)
                    updatedItemsDetails.push(`Removed ingredients: ${itemToUpdate.ingredientsToRemove.join(", ")}`);
                originalItem.quantity = itemToUpdate.quantity || originalItem.quantity;
                const price = (_c = originalItem.price) !== null && _c !== void 0 ? _c : 0;
                totalPrice += price * originalItem.quantity;
                originalItem.lactoseFree = (_d = itemToUpdate.lactoseFree) !== null && _d !== void 0 ? _d : originalItem.lactoseFree;
                originalItem.glutenFree = (_e = itemToUpdate.glutenFree) !== null && _e !== void 0 ? _e : originalItem.glutenFree;
                // Add drinkId if provided and look up the drink name
                if (itemToUpdate.drinkId) {
                    const drink = (_f = menuResult.Items) === null || _f === void 0 ? void 0 : _f.find((item) => item.id === itemToUpdate.drinkId);
                    originalItem.drinkName = (_g = drink === null || drink === void 0 ? void 0 : drink.name) !== null && _g !== void 0 ? _g : undefined; // Use undefined instead of null
                }
                originalItem.ingredientsToAdd = itemToUpdate.ingredientsToAdd;
                originalItem.ingredientsToRemove = itemToUpdate.ingredientsToRemove;
            }
            else {
                // If the item doesn't exist in the original order, add it as a new item
                const menuItem = (_h = menuResult.Items) === null || _h === void 0 ? void 0 : _h.find((item) => item.id === itemToUpdate.id);
                const newItem = {
                    id: itemToUpdate.id,
                    name: (menuItem === null || menuItem === void 0 ? void 0 : menuItem.name) || "Unknown Item",
                    quantity: itemToUpdate.quantity || 1,
                    ingredients: itemToUpdate.ingredientsToAdd || [...((menuItem === null || menuItem === void 0 ? void 0 : menuItem.ingredients) || [])],
                    ingredientsToAdd: itemToUpdate.ingredientsToAdd || [],
                    ingredientsToRemove: [],
                    description: menuItem === null || menuItem === void 0 ? void 0 : menuItem.description,
                    price: (_j = menuItem === null || menuItem === void 0 ? void 0 : menuItem.price) !== null && _j !== void 0 ? _j : 0,
                    lactoseFree: itemToUpdate.lactoseFree,
                    glutenFree: itemToUpdate.glutenFree,
                    popularity: (_k = menuItem === null || menuItem === void 0 ? void 0 : menuItem.popularity) !== null && _k !== void 0 ? _k : 0,
                };
                // Add drinkId if provided and look up the drink name
                if (itemToUpdate.drinkId) {
                    const drink = (_l = menuResult.Items) === null || _l === void 0 ? void 0 : _l.find((item) => item.id === itemToUpdate.drinkId);
                    newItem.drinkName = (drink === null || drink === void 0 ? void 0 : drink.name) || "Unknown Drink"; // Set the drink name, not ID
                }
                // If quantity is 0, don't add the item to the original items
                if (itemToUpdate.quantity === 0) {
                    updatedItemsDetails.push(`Removed item: ${newItem.name}`);
                    continue; // Skip adding it to the order
                }
                originalItems.push(newItem);
                const price = (_m = newItem.price) !== null && _m !== void 0 ? _m : 0;
                totalPrice += price * newItem.quantity;
            }
        }
        const lactoseFreeMessage = items.some(item => item.lactoseFree) ? "Lactose-free selected." : "No lactose-free items selected.";
        const containsGlutenFree = items.some(item => item.glutenFree === true);
        const glutenFreeMessage = containsGlutenFree ? "Gluten-free selected." : "No gluten-free items selected.";
        const updatedOrder = Object.assign(Object.assign({}, orderResult.Item), { items: originalItems.map(item => {
                var _a, _b;
                return ({
                    id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    lactoseFree: item.lactoseFree,
                    glutenFree: item.glutenFree,
                    description: item.description,
                    ingredients: item.ingredients,
                    ingredientsToAdd: item.ingredientsToAdd || [],
                    ingredientsToRemove: item.ingredientsToRemove || [],
                    itemMessage: ((_a = item.ingredientsToAdd) === null || _a === void 0 ? void 0 : _a.length) || ((_b = item.ingredientsToRemove) === null || _b === void 0 ? void 0 : _b.length) ? `Updated with changes` : `No changes`,
                    drinkName: item.drinkName || undefined, // Use undefined instead of null
                });
            }), status: 'pending', customerName,
            customerPhone,
            lactoseFreeMessage,
            glutenFreeMessage, updatedAt: new Date().toISOString() });
        const updateParams = {
            TableName: 'OrdersTable',
            Item: updatedOrder,
        };
        yield dynamoDb.put(updateParams).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Order updated successfully',
                updatedOrder: Object.assign(Object.assign({}, updatedOrder), { totalPrice, updatedAt: updatedOrder.updatedAt }),
                details: updatedItemsDetails,
            }),
        };
    }
    catch (error) {
        console.error("Error updating order:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error updating order', error }),
        };
    }
});
