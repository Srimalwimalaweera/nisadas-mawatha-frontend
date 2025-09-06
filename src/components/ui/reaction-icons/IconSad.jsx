import React from 'react';
import Lottie from "lottie-react";
import sadAnimationData from "../../../assets/icons/sad.json";

const IconSad = ({ className, isAnimating }) => {
  return (
    <div className={className}>
      <Lottie animationData={sadAnimationData} loop={isAnimating} />
    </div>
  );
};

export default IconSad;