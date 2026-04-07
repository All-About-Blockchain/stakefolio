import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <div className='fixed bottom-0 left-0 px-2 py-1'>
      <span className='text-sm'>© Stakefolio {year}</span>
    </div>
  );
};

export default Footer;
