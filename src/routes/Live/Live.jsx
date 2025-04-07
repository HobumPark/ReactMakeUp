import React, { useCallback, useEffect, useRef, useState } from "react";
import "./Live.css";
import { useTranslation } from "react-i18next";
const Live = () => {
  const {t} = useTranslation();

  return (
    <div className="w-10/10 h-[500px] bg-gray-500">
        Live
    </div>
  );
};

export default Live;
