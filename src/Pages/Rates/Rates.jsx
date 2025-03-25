import { useState } from "react";
import DropDown from "../../Components/DropDown";
import ProgressBar from "../../Components/ProgressBar";
import Loader from "../../Components/Loader";
import Input from "../../Components/Input";

import { useAnimationFrame } from "../../Hooks/useAnimationFrame";
import { ReactComponent as Transfer } from "../../Icons/Transfer.svg";

import classes from "./Rates.module.css";

import CountryData from "../../Libs/Countries.json";
import countryToCurrency from "../../Libs/CountryCurrency.json";

let countries = CountryData.CountryCodes;

const Rates = () => {
  const [fromCurrency, setFromCurrency] = useState("AU");
  const [toCurrency, setToCurrency] = useState("US");
  const [amount, setAmount] = useState("1000");

  const [exchangeRate, setExchangeRate] = useState(0.7456);
  const [progression, setProgression] = useState(0);
  const [loading, setLoading] = useState(false);

  const [inputError, setInputError] = useState(null);

  const Flag = ({ code }) => (
    <img
      alt={code || ""}
      src={`/img/flags/${code || ""}.svg`}
      width="20px"
      className={classes.flag}
    />
  );

  const fetchData = async () => {
    if (!loading) {
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      setLoading(false);
    }
  };

  // Demo progress bar moving :)
  useAnimationFrame(!loading, (deltaTime) => {
    setProgression((prevState) => {
      if (prevState > 0.998) {
        fetchData();
        return 0;
      }
      return (prevState + deltaTime * 0.0001) % 1;
    });
  });

  const handleAmountChange = (value) => {
    const numericValue = parseFloat(value);
    if (numericValue < 0 || isNaN(numericValue)) {
      setInputError(
        "You have provided an incorrect input. Please correct it and try again."
      );
      setAmount(value); // Update the amount state to reflect the input
    } else {
      setInputError(null); //Clear the input error
      setAmount(value); // Update the amount state
    }
  };

  const { trueAmount, markedUpAmount } = calculationConversion(
    parseFloat(amount) || 0, // Convert input amount to a number (default to 0 if empty)
    exchangeRate
  );

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <div className={classes.heading}>Currency Conversion</div>
        <Input
          label="Amount"
          value={amount}
          onChange={handleAmountChange}
          placeholder="Enter amount"
          style={{ marginBottom: "20px" }}
        />
        {inputError && (
          <div className={classes.error}>
            <span>{inputError}</span>
          </div>
        )}
        <div className={classes.rowWrapper}>
          <div>
            <DropDown
              leftIcon={<Flag code={fromCurrency} />}
              label={"From"}
              selected={countryToCurrency[fromCurrency]}
              options={countries.map(({ code }) => ({
                option: countryToCurrency[code],
                key: code,
                icon: <Flag code={code} />,
              }))}
              setSelected={(key) => {
                setFromCurrency(key);
              }}
              style={{ marginRight: "20px" }}
            />
          </div>

          <div className={classes.exchangeWrapper}>
            <div className={classes.transferIcon}>
              <Transfer height={"25px"} />
            </div>

            <div className={classes.rate}>{exchangeRate}</div>
          </div>

          <div>
            <DropDown
              leftIcon={<Flag code={toCurrency} />}
              label={"To"}
              selected={countryToCurrency[toCurrency]}
              options={countries.map(({ code }) => ({
                option: countryToCurrency[code],
                key: code,
                icon: <Flag code={code} />,
              }))}
              setSelected={(key) => {
                setToCurrency(key);
              }}
              style={{ marginLeft: "20px" }}
            />
          </div>
        </div>
        <div
          className={classes.conversionResults}
          style={{ marginBottom: "20px" }}
        >
          <div className={classes.result}>
            <span>True Amount (No Markup):</span>
            <span>{inputError ? "N/A" : trueAmount.toFixed(2)}</span>
          </div>
          <div className={classes.result}>
            <span>Marked-Up Amount (With Markup):</span>
            <span>{inputError ? "N/A" : markedUpAmount.toFixed(2)}</span>
          </div>
        </div>

        <ProgressBar
          progress={progression}
          animationClass={loading ? classes.slow : ""}
          style={{ marginTop: "20px" }}
        />

        {loading && (
          <div className={classes.loaderWrapper}>
            <Loader width={"25px"} height={"25px"} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Rates;

//Function to calculate true amount and marked-up amount
const calculationConversion = (amount, rate, markup = 0.005) => {
  const trueAmount = amount * rate; // True amount without markup
  const markedUpRate = rate * (1 - markup); // Apply markup to the rate
  const markedUpAmount = amount * markedUpRate; // Amount with markup
  return { trueAmount, markedUpAmount };
};
