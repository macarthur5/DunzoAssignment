import { TCoffeeMachineConfig } from "../types/common";
import { TCoffeeMachineParams } from "../utils/CoffeeMachine";

const commonVals = {
  total_items_quantity: {
    "Hot water": 720,
    "Hot milk": 191,
    "Ginger syrup": 311,
    "Sugar syrup": 900,
    "Tea leaves syrup": 459,
    "Green mixture": 218,
  },
  beverages: {
    "Hot tea": {
      "Hot water": 67,
      "Hot milk": 90,
      "Ginger syrup": 33,
      "Sugar syrup": 85,
      "Tea leaves syrup": 21,
    },
    "Hot coffee": {
      "Hot water": 97,
      "Ginger syrup": 21,
      "Hot milk": 87,
      "Sugar syrup": 49,
      "Tea leaves syrup": 50,
    },
    "Black tea": {
      "Hot water": 12,
      "Ginger syrup": 21,
      "Sugar syrup": 40,
      "Tea leaves syrup": 30,
    },
    "Green tea": {
      "Hot water": 10,
      "Ginger syrup": 30,
      "Sugar syrup": 54,
      "Green mixture": 31,
    },
  },
  ingredientsWarningLimit: 150,
};

/** The configs on which machine can be run */
const machineConfigs = (index: number): TCoffeeMachineConfig => {
  return {
    machine: {
      outlets: {
        count_n: index + 1,
      },
      ...commonVals,
    },
  };
};

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
