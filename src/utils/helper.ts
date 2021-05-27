import { TEventTypes, TIngredientsIndicator } from "../types/common";

export function dispatchCustomData<T>(eventName: TEventTypes, data: T): void {
  window.dispatchEvent(new CustomEvent<T>(eventName, { detail: data }));
}

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
