import React from 'react';
import { Input } from './Input';

export const PasswordInput = ({
  label = "Password",
  name = "password",
  onChange,
  value,
  placeholder = "••••••••",
  error,
  required = true,
  className = '',
  ...props
}) => {
  return (
    <Input
      type="password"
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      error={error}
      required={required}
      className={className}
      autoComplete={name === 'password' ? 'current-password' : 'new-password'}
      {...props}
    />
  );
};