import { width } from '@fortawesome/free-solid-svg-icons/fa0';
import React from 'react';


const ContainerCard = ({
  children,
  fontSize,
  fontWeight = '700',
  borderRadius = 'var(--border-radius)', 
  boxShadow = 'var(--box-shadow)',       
  backgroundColor = '#ffffff',
  padding = '20px',
  color = 'var(--black)',
  gap = '10px',
  className
}) => {
  return (
    <div
      className={`container-card my-[20px] ${className}`}
      style={{
        fontSize,
        fontWeight,
        borderRadius,
        boxShadow,
        backgroundColor,
        padding,
        color,
        gap,
      }}
    >
      {children}
    </div>
  );
};

export default ContainerCard;
