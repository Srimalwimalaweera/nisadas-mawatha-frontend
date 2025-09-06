import React from 'react';
import Lottie from "lottie-react";
import fireAnimationData from "../../../assets/icons/fire.json";

const IconFire = ({ className,isAnimating }) => {
  return (
    <div className={className}>
      <Lottie animationData={fireAnimationData} loop={isAnimating} />
    </div>
  );
};

export default IconFire;