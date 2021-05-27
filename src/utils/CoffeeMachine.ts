import Queue from "./Queue";
import { TBeverageEventData } from "../types/common";
import { dispatchCustomData } from "./helper";

export type TCoffeeMachineParams = {
  outlets: number;
  ingredients: { [key: string]: number };
  recipies: { [key: string]: { [key: string]: number } };
  ingredientsWarningLimit?: number;
};

class CoffeeMachine {
  private _state: TCoffeeMachineParams;
  private _queues: Queue<string>[];

  private static DEFAULT_INGREDIENTS_WARNING_LIMIT = 150;
  private static BEVERAGE_MAKE_DELAY_MS = 5000;

  constructor(params: TCoffeeMachineParams) {
    this._state = {
      ...params,
      ingredientsWarningLimit: params.ingredientsWarningLimit,
    };

    this._queues = new Array(params.outlets);
    for (let i = 0; i < params.outlets; ++i) {
      this._queues[i] = new Queue<string>();
    }
  }

  private async _make(beverage: string): Promise<boolean> {
    const recipie = this._state.recipies[beverage];
    const ingredients = Object.keys(recipie);

    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        let i;
        for (i = 0; i < ingredients.length; ++i) {
          const ingredient = ingredients[i];

          if (
            (this._state.ingredients[ingredient] ?? 0) < recipie[ingredient]
          ) {
            break;
          }
        }

        if (i < ingredients.length) {
          resolve(false);
          return;
        }

        ingredients.forEach((ingredient) => {
          this._state.ingredients[ingredient] -= recipie[ingredient];
        });

        dispatchCustomData("INGREDIENTS_STATUS", this._state.ingredients);

        resolve(true);
      }, CoffeeMachine.BEVERAGE_MAKE_DELAY_MS);
    });
  }

  private async run(index: number): Promise<void> {
    for (let i = 0; i < this._state.outlets; ++i) {
      const outletIndex = (index + i) % this._state.outlets;
      const queue = this._queues[outletIndex];

      if (queue.front()) {
        const beverage = queue.pop();

        if (beverage) {
          dispatchCustomData<TBeverageEventData>("BEVERGAE_STATUS", {
            name: beverage,
            outlet: outletIndex,
            success: await this._make(beverage),
          });
        }
      }
    }
  }

  public makeBeverage(beverage: string, outlet: number): void {
    this._queues[outlet].push(beverage);
    this.run(outlet);
  }

  public getBeveragesList(): string[] {
    return Object.keys(this._state.recipies);
  }

  public getNumOutlets(): number {
    return this._state.outlets;
  }

  public getIngredientsWarningLimit(): number {
    return (
      this._state.ingredientsWarningLimit ??
      CoffeeMachine.DEFAULT_INGREDIENTS_WARNING_LIMIT
    );
  }

  public getIngredients(): { [key: string]: number } {
    return this._state.ingredients;
  }
}

export default CoffeeMachine;
