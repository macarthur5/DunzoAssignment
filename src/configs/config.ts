import { TCoffeeMachineConfig } from "../types/common";
import { TCoffeeMachineParams } from "../utils/CoffeeMachine";

const machineConfigs: TCoffeeMachineConfig[] = [
  {
    machine: {
      outlets: {
        count_n: 3,
      },
      total_items_quantity: {
        "Hot water": 500,
        "Hot milk": 500,
        "Ginger syrup": 100,
        "Sugar syrup": 100,
        "Tea leaves syrup": 100,
      },
      beverages: {
        "Hot tea": {
          "Hot water": 200,
          "Hot milk": 100,
          "Ginger syrup": 10,
          "Sugar syrup": 10,
          "Tea leaves syrup": 30,
        },
        "Hot coffee": {
          "Hot water": 100,
          "Ginger syrup": 30,
          "Hot milk": 400,
          "Sugar syrup": 50,
          "Tea leaves syrup": 30,
        },
        "Black tea": {
          "Hot water": 300,
          "Ginger syrup": 30,
          "Sugar syrup": 50,
          "Tea leaves syrup": 30,
        },
        "Green tea": {
          "Hot water": 100,
          "Ginger syrup": 30,
          "Sugar syrup": 50,
          "Green mixture": 30,
        },
      },
    },
  },
];

export const convertConfigToMachineParams = (
  config: TCoffeeMachineConfig
): TCoffeeMachineParams => {
  return {
    outlets: config.machine.outlets.count_n,
    ingredients: config.machine.total_items_quantity,
    recipies: config.machine.beverages,
  };
};

export default machineConfigs;
