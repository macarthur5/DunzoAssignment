import { TTestCase } from "../types/common";

const getTestCase = (
  numOutlets: number,
  ingredients: string[],
  beverages: string[]
): TTestCase[] => {
  console.log(numOutlets, ingredients, beverages);

  const testCases: TTestCase[] = [];

  for (let j = 0; j < 500; ++j) {
    let actionType = Math.floor(Math.random() * 3);

    const testCase: TTestCase = {
      type:
        actionType === 0
          ? "make"
          : actionType === 1
          ? "refill"
          : Math.ceil(Math.random() * 1000) < 50
          ? "refillAll"
          : "make",
    };

    if (testCase.type === "refill") {
      testCase.ingredient =
        ingredients[Math.floor(Math.random() * ingredients.length)];
    } else if (testCase.type === "make") {
      testCase.beverage =
        beverages[Math.floor(Math.random() * beverages.length)];
      testCase.outlet = Math.floor(Math.random() * numOutlets);
    }

    testCases.push(testCase);
  }

  return testCases;
};

export { getTestCase };
