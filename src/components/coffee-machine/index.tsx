import React, { FC, ReactNode, useEffect, useRef, useState } from "react";
import CoffeeMachine from "../../utils/CoffeeMachine";
import machineConfigs, {
  convertConfigToMachineParams,
} from "../../configs/config";
import {
  TBeverageEventData,
  TIngredientsStatusEventData,
} from "../../types/common";
import { getIngredientsIndicator } from "../../utils/helper";

import "./coffee-machine.scss";

type TProps = {};

/**
 * A react component that uses @CoffeeMachine instance to work. It creates the UI which helps us see the coffee machine in action.
 * The only way this react component communicates with the asynchronous functions of the @CoffeeMachine instance is via custom events.
 */

const CoffeeMachineInterface: FC<TProps> = () => {
  const coffeeMachine = useRef<CoffeeMachine>(
    new CoffeeMachine(convertConfigToMachineParams(machineConfigs[0]))
  );

  const beverages = useRef<string[]>(coffeeMachine.current.getBeveragesList());
  const numOutlets = useRef<number>(coffeeMachine.current.getNumOutlets());
  const outletsRef = useRef<HTMLDivElement | null>(null);

  const [selectedConfigIndex, setSelectedConfigIndex] = useState<number>(0);
  const [selectedBeverageIndex, setSelectedBeverageIndex] = useState<number>(0);
  const [ingredientsStatus, setIngredientsStatus] =
    useState<TIngredientsStatusEventData>(
      coffeeMachine.current.getIngredients()
    );

  /**
   *
   * @returns the jsx for the outlets section
   */
  const getOutletsJsx = (): ReactNode[] => {
    const jsx: ReactNode[] = [];

    for (let i = 0; i < numOutlets.current; ++i) {
      jsx.push(
        <div className="outlet-wrap" key={`outlet-${i}`}>
          <h3>{`Outlet ${i + 1}`}</h3>
          <span className="outlet" />
          <div className="button-wrap">
            <button
              className="press-btn dz-button"
              onClick={() => {
                showProcessingMessage(i);

                coffeeMachine.current.makeBeverage(
                  beverages.current[selectedBeverageIndex],
                  i
                );
              }}
            >
              Press
            </button>

            <button
              className="clear-btn dz-button"
              onClick={() => {
                clearOutlet(i);
              }}
            >
              Clear
            </button>
          </div>
        </div>
      );
    }

    return jsx;
  };

  /**
   *
   * @returns the jsx for the ingredients panel
   */
  const getIngredientsPanel = (): ReactNode => {
    const jsx: ReactNode[] = [];

    const indicators = getIngredientsIndicator(
      ingredientsStatus,
      coffeeMachine.current.getIngredientsWarningLimit()
    );

    Object.keys(indicators).forEach((key, index) => {
      jsx.push(
        <div className="ingredient-indicator" key={`${key}-${index}`}>
          <span className={`dot ${indicators[key]}`} /> <span>{key}</span>
          <span style={{ marginLeft: "5px" }}>
            ({ingredientsStatus[key]}/{CoffeeMachine.getMaxIngredientLimit()})
          </span>
          <span
            style={{
              marginLeft: "10px",
            }}
            className="dz-button refill-link"
            onClick={() => {
              coffeeMachine.current.refill(key);
            }}
          >
            Refill
          </span>
        </div>
      );
    });

    return (
      <div className="ingredients">
        <h3>Ingredients</h3>
        {jsx}
      </div>
    );
  };

  /**
   *
   * @param detail message to be displayed on an Outlet
   *
   * appends a message on a particular outlet based on data passed
   */
  const populateOutletScreen = (detail: TBeverageEventData) => {
    const { name, outlet, success } = detail;

    const outletRef =
      outletsRef.current?.children[outlet]?.querySelector(".outlet");

    if (outletRef) {
      outletRef.innerHTML += success
        ? "<span class='outlet-msg success'>" + name + " was served.</span>"
        : "<span class='outlet-msg error'>" +
          name +
          " could not be served.</span>";
      outletRef.innerHTML += "<br/>";
    }
  };

  /**
   *
   * @param outlet which outlet to show procesing message on
   * shows "processing..." message on outlet
   */
  const showProcessingMessage = (outlet: number) => {
    const outletRef =
      outletsRef.current?.children[outlet]?.querySelector(".outlet");

    if (outletRef) {
      outletRef.innerHTML += "Processing...";
      outletRef.innerHTML += "<br/>";
    }
  };

  /**
   *
   * @param outlet the outlet to be cleared
   * clears all the messages on that outlet
   */
  const clearOutlet = (outlet: number) => {
    const outletRef =
      outletsRef.current?.children[outlet]?.querySelector(".outlet");

    if (outletRef) {
      outletRef.innerHTML = "";
    }
  };

  /**
   *
   * @param index the selected config index
   * resets the conffee machine to initial point with new config
   */
  const resetConfig = (index: number) => {
    for (let i = 0; i < numOutlets.current; ++i) {
      clearOutlet(i);
    }

    coffeeMachine.current = new CoffeeMachine(
      convertConfigToMachineParams(machineConfigs[index])
    );
    beverages.current = coffeeMachine.current.getBeveragesList();
    numOutlets.current = coffeeMachine.current.getNumOutlets();

    setSelectedConfigIndex(index);
    setSelectedBeverageIndex(0);
    setIngredientsStatus(coffeeMachine.current.getIngredients());
  };

  useEffect(() => {
    const ingredientsCallback = (event: Event) => {
      setIngredientsStatus({
        ...(event as CustomEvent<TIngredientsStatusEventData>).detail,
      });
    };

    window.addEventListener("INGREDIENTS_STATUS", ingredientsCallback);

    const beverageCallback = (event: Event) => {
      populateOutletScreen((event as CustomEvent<TBeverageEventData>).detail);
    };

    window.addEventListener("BEVERGAE_STATUS", beverageCallback);

    return () => {
      window.removeEventListener("INGREDIENTS_STATUS", ingredientsCallback);
      window.removeEventListener("BEVERGAE_STATUS", beverageCallback);
    };
  }, []);

  return (
    <div className="coffee-machine-wrap">
      <h4>
        Different configs have different amount of ingredients and different
        number of outlets
      </h4>

      <div className="configs">
        {machineConfigs.map((config, index) => {
          return (
            <button
              className={`dz-button ${
                index === selectedConfigIndex ? "selected" : ""
              }`}
              key={`config-${index}`}
              onClick={() => {
                resetConfig(index);
              }}
            >
              {`Config ${index + 1}`}
            </button>
          );
        })}
      </div>

      <div className="coffee-machine">
        <div className="beverages">
          {beverages.current.map((beverage, index) => (
            <button
              className={`dz-button ${
                index === selectedBeverageIndex ? "selected" : ""
              }`}
              key={`beverage-${beverage}`}
              onClick={() => setSelectedBeverageIndex(index)}
            >
              {beverage}
            </button>
          ))}
        </div>

        <div className="ingredients">{getIngredientsPanel()}</div>
        <div className="outlets" ref={outletsRef}>
          {getOutletsJsx()}
        </div>
      </div>
    </div>
  );
};

export default CoffeeMachineInterface;
