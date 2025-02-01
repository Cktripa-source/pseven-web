import React from 'react';
import { motion } from 'framer-motion';
import  Loader from "./images/logo.png"
 const Loading = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <motion.img
        src={Loader}
        alt="Loading..."
        initial={{ rotate: 0 }}
        animate={{ rotate: 660 }}
        transition={{ duration: 3, repeat: Infinity, repeatType: 'loop' }}
        style={{ width: '60px', height: '60px', borderRadius:'100%' }}
      />  
    </div>
  );
};

export default Loading;
