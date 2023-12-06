
import './Input.css';

import * as React from 'react';

type Props = Readonly<{
  'data-test-id'?: string;
  label: string;
  onChange: (val: string) => void;
  placeholder?: string;
  value: string;
  type?: React.HTMLInputTypeAttribute;
  wrapperClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  disabled?: boolean;
}>;

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
}: Props): JSX.Element {
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