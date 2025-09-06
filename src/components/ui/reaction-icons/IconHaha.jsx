import React from 'react';
import Lottie from "lottie-react";
import hahaAnimationData from "../../../assets/icons/haha.json";

const IconHaha = ({ className, isAnimating }) => {
  return (
    <div className={className}>
      <Lottie animationData={hahaAnimationData} loop={isAnimating} />
    </div>
  );
};

export default IconHaha;