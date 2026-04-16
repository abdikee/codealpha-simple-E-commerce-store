import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { pageVariants, smooth } from '../utils/animations.js';

export function PageTransition({ children, location }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={pageVariants.initial}
        animate={pageVariants.animate}
        exit={pageVariants.exit}
        transition={smooth}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
