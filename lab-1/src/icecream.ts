import PromptSync from 'prompt-sync';

const prompt = PromptSync();

const PRICES = {
  size: {
    small: 10,
    big: 25,
  },
  toppings: {
    chocolate: 5,
    caramel: 6,
    berries: 10,
  },
  marshmallow: 5,
} as const;

type Size = keyof typeof PRICES.size;
type Topping = keyof typeof PRICES.toppings;

interface IceCreamOrder {
  size: Size;
  toppings: Array<Topping>;
  withMarshmallow: boolean;
}

const isSize = (value: string): value is Size => value in PRICES.size;
const isTopping = (value: string): value is Topping => value in PRICES.toppings;

const promptSize = (): Size => {
  const allowedSizes: string = Object.keys(PRICES.size).join(' / ');
  while (true) {
    const input = prompt(`Which size you want? (${allowedSizes}):`)
      ?.trim()
      .toLowerCase();
    if (input && isSize(input)) return input;
    console.log(`Invalid size! Please, enter on of ${allowedSizes}\n`);
  }
};

const promptToppings = (): Array<Topping> => {
  const allowedToppings: string = Object.keys(PRICES.toppings).join(' / ');
  while (true) {
    const rawInput = prompt(
      `Choose toppings separated by comma (${allowedToppings}) or press enter for skip: `
    );

    if (!rawInput) {
      return [];
    }

    const rawList: Array<string> = rawInput
      .split(',')
      .map((topping) => topping.trim().toLowerCase());
    const allValid = rawList.every(isTopping);

    if (allValid && rawList.length > 0) {
      return rawList as Array<Topping>;
    }

    console.log(
      `Incorrect toppings! Use only: (${allowedToppings}) separated by commas.\n`
    );
  }
};

const promptMarshmallow = (): boolean => {
  const YES_PATTERN = /^(y|yes|true|1)$/i;
  const NO_PATTERN = /^(n|no|false|0)$/i;

  while (true) {
    const input = prompt('Do you want marshmallow? (y/n): ')
      ?.trim()
      .toLowerCase();

    if (input) {
      if (YES_PATTERN.test(input)) return true;
      if (NO_PATTERN.test(input)) return false;
    }
    console.log("Invalid answer! Please enter 'y' (yes) or 'n' (no).\n");
  }
};

const calcIceCreamCost = (order: IceCreamOrder): number => {
  const baseCost = PRICES.size[order.size];
  const toppingsCost = order.toppings.reduce(
    (total, topping) => (total += PRICES.toppings[topping]),
    0
  );
  const marshmallowCost = order.withMarshmallow ? PRICES.marshmallow : 0;

  return baseCost + toppingsCost + marshmallowCost;
};

const orderIceCream = (): void => {
  console.log('Hello, you can order ice cream here. (follow the instructions)');

  const size: Size = promptSize();
  const toppings: Array<Topping> = promptToppings();
  const marshmello: boolean = promptMarshmallow();

  const order: IceCreamOrder = {
    size: size,
    toppings: [...new Set(toppings)],
    withMarshmallow: marshmello,
  };
  const totalCost = calcIceCreamCost(order);
  console.log('\n Your order:');
  console.log(`Size: ${order.size} (${PRICES.size[order.size]} UAH)`);
  console.log(
    `Toppings: ${order.toppings.length > 0 ? order.toppings.join(', ') : 'None'} (${order.toppings.reduce((total, topping) => (total += PRICES.toppings[topping]), 0)} UAH)`
  );
  console.log(
    `Marshmallow: ${order.withMarshmallow ? 'Yes' : 'No'} (${order.withMarshmallow ? PRICES.marshmallow : 0} UAH)`
  );
  console.log(`------------------`);
  console.log(`Total: ${totalCost} UAH\n`);
};

orderIceCream();
