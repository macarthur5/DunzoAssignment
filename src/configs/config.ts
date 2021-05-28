import { TCoffeeMachineConfig } from "../types/common";
import { TCoffeeMachineParams } from "../utils/CoffeeMachine";

/** The configs on which machine can be run */
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
        "Green mixture": 400,
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
      ingredientsWarningLimit: 150,
    },
  },
  {
    machine: {
      outlets: {
        count_n: 4,
      },
      total_items_quantity: {
        "Hot water": 1500,
        "Hot milk": 5000,
        "Ginger syrup": 1000,
        "Sugar syrup": 1900,
        "Tea leaves syrup": 2000,
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
        "Hot water": {
          "Hot water": 100,
        },
        "Hot milk": {
          "Hot milk": 100,
        },
      },
      ingredientsWarningLimit: 1000,
    },
  },
  {
    machine: {
      outlets: {
        count_n: 2,
      },
      total_items_quantity: {
        "Hot water": 210,
        "Hot milk": 100,
        "Ginger syrup": 210,
        "Sugar syrup": 480,
        "Tea leaves syrup": 100,
      },
      beverages: {
        "Hot tea": {
          "Hot water": 20,
          "Hot milk": 10,
          "Ginger syrup": 10,
          "Sugar syrup": 10,
          "Tea leaves syrup": 30,
        },
        "Hot coffee": {
          "Hot water": 10,
          "Ginger syrup": 30,
          "Hot milk": 40,
          "Sugar syrup": 50,
          "Tea leaves syrup": 30,
        },
        "Black tea": {
          "Hot water": 30,
          "Ginger syrup": 30,
          "Sugar syrup": 50,
          "Tea leaves syrup": 30,
        },
        "Green tea": {
          "Hot water": 10,
          "Ginger syrup": 30,
          "Sugar syrup": 21,
          "Green mixture": 18,
        },
      },
      ingredientsWarningLimit: 100,
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
