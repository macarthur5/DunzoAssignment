import { TEventTypes, TIngredientsIndicator } from "../types/common";

/**
 *
 * @param eventName the name of the event
 * @param data custom data to be passed with the event
 *
 * dispatches the custom event on window object with the provided data - @data
 */
export function dispatchCustomData<T>(eventName: TEventTypes, data: T): void {
  window.dispatchEvent(new CustomEvent<T>(eventName, { detail: data }));
}

/**
 *
 * @param data map of ingredients and their amount
 * @param limit limit under which ingredients are considered to have low quantity
 * @returns a map of each ingredient to "low"/"ok"
 */
export function getIngredientsIndicator(
  data: {
    [key: string]: number;
  },
  limit: number
): TIngredientsIndicator {
  const obj: TIngredientsIndicator = {};

  Object.keys(data).forEach((key) => {
    obj[key] = data[key] <= limit ? "low" : "ok";
  });

  return obj;
}
