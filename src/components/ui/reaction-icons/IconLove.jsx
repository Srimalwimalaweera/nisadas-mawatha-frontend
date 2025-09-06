import React from 'react';
import Lottie from "lottie-react";
import loveAnimationData from "../../../assets/icons/love.json"; // අදාළ JSON ගොනුව import කිරීම

const IconLove = ({ className, isAnimating }) => {
  return (
    <div className={className}>
      <Lottie animationData={loveAnimationData} loop={isAnimating} />
    </div>
  );
};

export default IconLove;