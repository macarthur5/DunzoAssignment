import React, { FC, ReactNode, useEffect, useRef, useState } from "react";
import machineConfigs, {
  convertConfigToMachineParams,
} from "../../configs/config";
import {
  TBeverageEventData,
  TIngredientsStatusEventData,
} from "../../types/common";
import CoffeeMachine from "../../utils/CoffeeMachine";
import { getIngredientsIndicator } from "../../utils/helper";

import "./coffee-machine.scss";

type TProps = {};

const CoffeeMachineInterface: FC<TProps> = () => {
  const coffeeMachine = useRef<CoffeeMachine>(
    new CoffeeMachine(convertConfigToMachineParams(machineConfigs[0]))
  );

  const beverages = useRef<string[]>(coffeeMachine.current.getBeveragesList());
  const numOutlets = useRef<number>(coffeeMachine.current.getNumOutlets());
  const outletsRef = useRef<HTMLDivElement | null>(null);

  const [selectedBeverageIndex, setSelectedBeverageIndex] = useState<number>(0);
  const [ingredientsStatus, setIngredientsStatus] =
    useState<TIngredientsStatusEventData>(
      coffeeMachine.current.getIngredients()
    );

  const getOutletsJsx = (): ReactNode[] => {
    const jsx: ReactNode[] = [];

    for (let i = 0; i < numOutlets.current; ++i) {
      jsx.push(
        <div className="outlet-wrap" key={`outlet-${i}`}>
          <h3>{`Outlet ${i + 1}`}</h3>
          <span className="outlet" />
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
        </div>
      );
    }

    return jsx;
  };

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
          <span style={{ marginLeft: "5px" }}>({ingredientsStatus[key]})</span>
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

  const showProcessingMessage = (outlet: number) => {
    const outletRef =
      outletsRef.current?.children[outlet]?.querySelector(".outlet");

    if (outletRef) {
      outletRef.innerHTML += "Processing...";
      outletRef.innerHTML += "<br/>";
    }
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
  );
};

export default CoffeeMachineInterface;
