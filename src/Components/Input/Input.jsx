import React from "react";
import PropTypes from "prop-types";
import classes from "./Input.module.css";

const Input = (props) => {
  const { label, value, onChange, placeholder, leftIcon, style, className } =
    props;

  return (
    <div className={`${classes.container} ${className}`} style={style}>
      {label && <span>{label}</span>}
      <div className={classes.inputWrapper}>
        {leftIcon && <div className={classes.leftIcon}>{leftIcon}</div>}
        <input
          type="number"
          value={value}
          min={0}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={classes.input}
        />
      </div>
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  leftIcon: PropTypes.node,
  style: PropTypes.object,
  className: PropTypes.string,
};

export default Input;
