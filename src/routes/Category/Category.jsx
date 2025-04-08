import React, { useCallback, useEffect, useRef, useState } from "react";
import "./Category.css";
import { useTranslation } from "react-i18next";

const Category = () => {
  const {t} = useTranslation();

  return (
    <div className="w-10/10 h-[500px] bg-gray-500">
        Category
    </div>
  );
};

export default Category;
