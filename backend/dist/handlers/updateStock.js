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
const updateStock = (ingredients) => __awaiter(void 0, void 0, void 0, function* () {
    const updatePromises = ingredients.map((ingredient) => __awaiter(void 0, void 0, void 0, function* () {
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
            return yield db.update(params);
        }
        catch (error) {
            console.error(`Error updating stock for ingredient ${ingredient.id}`, error);
            throw new Error(`Insufficient sotck for ingredient ${ingredient.id}`);
        }
    }));
    yield Promise.all(updatePromises);
});
export { updateStock };