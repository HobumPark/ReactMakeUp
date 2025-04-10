// CosmeticList.js
import React from "react";
import CosmeticItem from "./CosmeticItem";

const CosmeticList = ({ cosmetics }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {cosmetics.map((cosmetic) => (
        <CosmeticItem key={cosmetic.id} cosmetic={cosmetic} />
      ))}
    </div>
  );
};

export default CosmeticList;
