import React from 'react';

function Logo() {
  const logoUrl = "https://firebasestorage.googleapis.com/v0/b/nisadas-mawatha.firebasestorage.app/o/webapp%2FNisadas%20Mawatha%20Logo.png?alt=media&token=bba44519-77de-48fb-a048-941625ac3e93";
  
  // We are returning the image tag directly. 
  // Any styling will be applied via the parent's CSS.
  return (
    <img src={logoUrl} alt="Nisadas Mawatha Logo" />
  );
}

export default Logo;