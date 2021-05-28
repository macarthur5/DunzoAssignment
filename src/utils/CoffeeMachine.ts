import Queue from "./Queue";
import { TBeverageEventData } from "../types/common";
import { dispatchCustomData } from "./helper";

export type TCoffeeMachineParams = {
  outlets: number;
  ingredients: { [key: string]: number };
  recipies: { [key: string]: { [key: string]: number } };
  ingredientsWarningLimit?: number;
};

/******
 * 1. CoffeMachine class primarily works by making a queue for each outlet and receives can a request a request to make a certain beverage at certain outlet.
 * 2. The machine after fulfilling the request at the mentioned outlet traverses each of the other queues as well for pending orders, thereby avoiding starvation.
 * 3. The function that makes the beverage takes a constant harcoded time mentioned in the class (5 seconds). This subroutine/method/function is fired asynchronously, thus allowing multiple outlets to be usable at once.
 * 4. On resolution of the beverage, a custom event is dispatched, notifying the UI of completion/failure of the task. Also the modified ingredients are also shared through another event dispatch.
 * 5. The machine exposes methods to access the ingredients and the limit under which their amount in considered low. The machine takes a config of type @TCoffeeMachineParams as constructor parameter.
 * 6. The machine also exposes methods to refill particular ingredient. The maximum amount of an ingredient is assumed to be 2000 units and hardcoded.
 */

class CoffeeMachine {
  private _state: TCoffeeMachineParams;
  private _queues: Queue<string>[];

  private static DEFAULT_INGREDIENTS_WARNING_LIMIT = 150;
  private static BEVERAGE_MAKE_DELAY_MS = 5000;
  private static MAX_INGREDIENT_LIMIT = 5000;

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

  /**
   *
   * @param beverage beverage to be made
   * @returns a promise that resolves to true if the beverage could be made, false otherwise. It also takes a 'fake' delay of @DEFAULT_INGREDIENTS_WARNING_LIMIT
   */
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

  /**
   *
   * @param index the outlet on which beverage is requested
   * runs a loop starting with the index and wraps to index-1, and tries to make the first beverage in each queue
   */
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

  /**
   *
   * @param beverage beverage to be made
   * @param outlet outlet number on which beverage will be served
   */
  public makeBeverage(beverage: string, outlet: number): void {
    this._queues[outlet].push(beverage);
    this.run(outlet);
  }

  /**
   *
   * @param ingredient ingredient name to be refilled
   */
  public refill(ingredient: string): void {
    this._state.ingredients[ingredient] = CoffeeMachine.MAX_INGREDIENT_LIMIT;
    dispatchCustomData("INGREDIENTS_STATUS", this._state.ingredients);
  }

  /**
   *
   * @returns list of beverages according to the config passed
   */
  public getBeveragesList(): string[] {
    return Object.keys(this._state.recipies);
  }

  /**
   *
   * @returns the number of outlets according to the config passed
   */
  public getNumOutlets(): number {
    return this._state.outlets;
  }

  /**
   *
   * @returns the limit under which ingredients are considered to have low quantity
   */
  public getIngredientsWarningLimit(): number {
    return (
      this._state.ingredientsWarningLimit ??
      CoffeeMachine.DEFAULT_INGREDIENTS_WARNING_LIMIT
    );
  }

  /**
   *
   * @returns the an object with each ingredient as key and their initial amount as value
   */
  public getIngredients(): { [key: string]: number } {
    return this._state.ingredients;
  }

  /**
   *
   * @returns max amount an ingredient can have
   */
  public static getMaxIngredientLimit(): number {
    return CoffeeMachine.MAX_INGREDIENT_LIMIT;
  }
}

export default CoffeeMachine;
