import { db } from '../services/db';

const updateStock = async (ingredients: { id: string; quantity: number } []) => {
    const updatePromises = ingredients.map(async (ingredient) => {
        const params = {
            TableName: 'IngredientsTable',
            Key: { id: ingredient.id },
            UpdateExpression: 'SET stock = stock - :quantity',
            ExpressionAttributeValues: {
                ':quantity': ingredient.quantity,
            },

            ConditionExpression: 'stock >= :quantity',
        };

        try {
            return await db.update(params);
        } catch (error) {
            console.error(`Error updating stock for ingredient ${ingredient.id}`, error);
            throw new Error(`Insufficient sotck for ingredient ${ingredient.id}`);
        }
    });

    await Promise.all(updatePromises);
};

export { updateStock };