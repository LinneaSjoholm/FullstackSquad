export interface Ingredient {
    id: string;
    name: string;
    stock: number;
    unit: string;
    dishNames: string[]; 
    usagePerDish: { [dishName: string]: number };
}
