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

export type TEventTypes = "BEVERGAE_STATUS" | "INGREDIENTS_STATUS";

export type TBeverageEventData = {
  name: string;
  outlet: number;
  success: boolean;
};

export type TIngredientsStatusEventData = { [key: string]: number };
export type TIngredientsIndicator = { [key: string]: "ok" | "low" };
