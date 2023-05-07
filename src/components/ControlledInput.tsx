import React, { ChangeEvent, FC } from 'react';

interface ControlledInputProps {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  children: string;
  name: string;
  type: 'text' | 'number';
  value: string | number;
  placeholder: string;
}

const ControlledInput: FC<ControlledInputProps> = ({
  onChange,
  children,
  name,
  type,
  value,
  placeholder,
}) => {
  return (
    <div className="col-12 col-sm-6 col-lg-3 my-2">
      <label htmlFor={name} className="mr-2">
        {children}
      </label>
      <input
        className="form-control"
        id={name}
        name={name}
        type={type}
        onChange={onChange}
        value={value}
        placeholder={placeholder}
      />
    </div>
  );
};

export default ControlledInput;
