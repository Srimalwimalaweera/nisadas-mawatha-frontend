import React from 'react';
import Lottie from "lottie-react";
import likeAnimationData from "../../../assets/icons/like.json";

const IconLike = ({ className, isAnimating }) => {
  return (
    <div className={className}>
      <Lottie animationData={likeAnimationData} loop={isAnimating} />
    </div>
  );
};

export default IconLike;