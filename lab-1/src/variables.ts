const numberVariable: number = 19;
const stringVariable: string = 'Text';
const booleanVariable: boolean = true;
let anyVariable: any = false;

console.log(numberVariable, stringVariable, booleanVariable, anyVariable);
anyVariable = 20;
console.log(anyVariable);

const fruits: Array<string> = ['banana', 'apple', 'pie', 'orange'];
const numbers: Array<number> = [0, 1, 2, 3, 4, 5];
const breakfast: [string, number] = ['banana', 2];

console.log(`Fruits: ${fruits.join(' ')}`);
console.log(`Numbers: ${numbers.join(', ')}`);
console.log(`Breakfast: ${breakfast.join(' - ')}`);
