import React from "react";

export const Button = ({ children, className = "", ...props }) => (
  <button className={`btn btn-primary-custom ${className}`} {...props}>
    {children}
  </button>
);
