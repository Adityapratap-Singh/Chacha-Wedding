import React from 'react';
import { motion } from 'framer-motion';

const ScrollReveal = ({ 
  children, 
  staggerChildren = false, 
  staggerDelay = 0.1, 
  duration = 1.0, 
  className = "",
  style = {},
  ...props 
}) => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerChildren ? staggerDelay : 0,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      scale: 1.05, 
      filter: 'blur(8px)' 
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      filter: 'blur(0px)' 
    },
  };

  return (
    <motion.div
      variants={staggerChildren ? containerVariants : itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration, 
        ease: [0.34, 1.56, 0.64, 1] 
      }}
      className={className}
      style={style}
      {...props}
    >
      {staggerChildren ? (
        React.Children.map(children, (child, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
          >
            {child}
          </motion.div>
        ))
      ) : (
        children
      )}
    </motion.div>
  );
};

export default ScrollReveal;
