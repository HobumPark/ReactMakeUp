import React, { useCallback, useState } from "react";
import GeneralInput from "../GeneralInput/GeneralInput";
import Button from "../Button/Button";
import Magnifier from "../../assets/icon/icon-search.svg"
import Select from "../Select/Select";
import { useTranslation } from "react-i18next";

const BoxLeft = ({
  labelSelect,
  children,
  confirmButtonState,
  restoreButtonState,
  onClickRestore,
  onClickConfirm,
  disableConfirmButton
}) => {
  const {t} = useTranslation();
  return (
    <div className="flex gap-4 justify-between">
      <div className="w-32 flex items-center gap-2">
        <span className="text-body-2 text-au-neutral-4 py-[9px] flex-grow whitespace-nowrap">
          {labelSelect}
        </span>
        {children}
      </div>

      <div className="flex gap-4 ml-auto">
      {!disableConfirmButton && (
       <Button label={t('cmn > confirm')}customButton="btn-search" disabled={confirmButtonState} onClick={() => onClickConfirm()} />
      )}
       <Button label={t('cmn > reset table')} customButton={disableConfirmButton ? "btn-search" : "btn-reset"}  disabled={restoreButtonState} onClick={() => onClickRestore()} />
      </div>
    </div>

  );
};

export default BoxLeft;
