import React from 'react';
import Lottie from "lottie-react";
import angryAnimationData from "../../../assets/icons/angry.json";

const IconAngry = ({ className, isAnimating }) => {
  return (
    <div className={className}>
      <Lottie animationData={angryAnimationData} loop={isAnimating} />
    </div>
  );
};

export default IconAngry;