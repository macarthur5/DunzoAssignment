/**
 * The type of which the @CoffeMachine takes object of during construction
 */
export type TCoffeeMachineConfig = {
  machine: {
    outlets: {
      count_n: number;
    };
    total_items_quantity: { [key: string]: number };
    beverages: { [key: string]: { [key: string]: number } };
    ingredientsWarningLimit?: number;
  };
};

/**
 * The names of the events for custom data dispatch
 */
export type TEventTypes = "BEVERGAE_STATUS" | "INGREDIENTS_STATUS";

/**
 * The type of the data sent after beverage is either made or the process failed
 */
export type TBeverageEventData = {
  name: string;
  outlet: number;
  success: boolean;
};

/**
 * The data for the event telling ingredients and their quantity
 */
export type TIngredientsStatusEventData = { [key: string]: number };

/**
 * The type for the data telling ingredients and their indicators - low/ok
 */
export type TIngredientsIndicator = { [key: string]: "ok" | "low" };
