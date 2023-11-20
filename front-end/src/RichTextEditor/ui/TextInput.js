
import './Input.css';

import * as React from 'react';

export default function TextInput({
  label,
  value,
  onChange,
  placeholder = '',
  'data-test-id': dataTestId,
  type = 'text',
  wrapperClassName,
  labelClassName,
  inputClassName,
  disabled,
}) {
  return (
    <div className={`Input__wrapper ${wrapperClassName || ''}`}>
      <label className={`Input__label ${labelClassName || ''}`}>{label}</label>
      <input
        type={type}
        className={`Input__input ${inputClassName || ''} ${disabled ? "disabled" : ""}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        data-test-id={dataTestId}
        disabled={disabled}
      />
    </div>
  );
}