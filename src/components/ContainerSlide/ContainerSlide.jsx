import React from 'react';
import arrowLeft from '../../assets/icon/Arrow1.png';
import arrowRight from '../../assets/icon/Arrow2.png';

const ContainerSlide = (
   {buttonState, onClickLeft, onClickRight}
) => {
  return (
    <div className="flex flex-col items-center space-y-4">
    <button className="_slideLeft" id="exclusion" disabled={buttonState} onClick={() => onClickLeft()}  >
      <img src={arrowLeft} alt="Arrow Left" />
    </button>
    <button className="_slideRight" id="allocation" disabled={buttonState} onClick={() => onClickRight()}>
      <img src={arrowRight} alt="Arrow Right" />
    </button>
  </div>
  );
};

export default ContainerSlide;
