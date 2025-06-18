// src/components/ui/card.js
import React from "react";

export const Card = ({ children }) => {
  return (
    <div className="mt-2 rounded-2xl shadow-lg bg-white dark:bg-zinc-900 p-4 transition-transform hover:scale-[1.01] duration-200">
      {children}
    </div>
  );
};

export const CardContent = ({ children }) => {
  return <div className="p-2">{children}</div>;
};
