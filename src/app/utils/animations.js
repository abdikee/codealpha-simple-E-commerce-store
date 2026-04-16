// Animation utility library for minimal & fast animations
// Duration: 150-300ms | Easing: ease-out / ease-in-out

export const durations = {
  fast: 0.15,      // 150ms - micro-interactions
  normal: 0.2,     // 200ms - standard transitions
  medium: 0.25,   // 250ms - page transitions
  slow: 0.3,      // 300ms - emphasis animations
};

export const easings = {
  easeOut: [0, 0, 0.2, 1],
  easeInOut: [0.4, 0, 0.2, 1],
  spring: { type: "spring", stiffness: 400, damping: 30 },
};

// Fade animations
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: durations.normal, ease: easings.easeOut },
};

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: durations.normal, ease: easings.easeOut },
};

export const fadeInDown = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
  transition: { duration: durations.normal, ease: easings.easeOut },
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -8 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 8 },
  transition: { duration: durations.normal, ease: easings.easeOut },
};

export const fadeInRight = {
  initial: { opacity: 0, x: 8 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -8 },
  transition: { duration: durations.normal, ease: easings.easeOut },
};

// Scale animations (subtle)
export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: durations.normal, ease: easings.easeOut },
};

export const scaleUp = {
  initial: { scale: 1 },
  animate: { scale: 1.02 },
  transition: { duration: durations.fast, ease: easings.easeOut },
};

// Stagger container for lists
export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 8 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: durations.fast, ease: easings.easeOut }
  },
  exit: { 
    opacity: 0, 
    y: -8,
    transition: { duration: durations.fast, ease: easings.easeOut }
  },
};

// Page transitions
export const pageTransition = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: durations.normal, ease: easings.easeOut }
  },
  exit: { 
    opacity: 0,
    transition: { duration: durations.fast, ease: easings.easeInOut }
  },
};

// Slide animations
export const slideInRight = {
  initial: { x: '100%' },
  animate: { x: 0 },
  exit: { x: '100%' },
  transition: { duration: durations.medium, ease: easings.easeOut },
};

export const slideInLeft = {
  initial: { x: '-100%' },
  animate: { x: 0 },
  exit: { x: '-100%' },
  transition: { duration: durations.medium, ease: easings.easeOut },
};

export const slideInUp = {
  initial: { y: '100%' },
  animate: { y: 0 },
  exit: { y: '100%' },
  transition: { duration: durations.medium, ease: easings.easeOut },
};

// Error shake animation
export const shake = {
  animate: {
    x: [0, -4, 4, -4, 4, 0],
    transition: { duration: 0.3, ease: easings.easeInOut }
  },
};

// Pulse animation for badges/notifications
export const pulse = {
  animate: {
    scale: [1, 1.1, 1],
    transition: { duration: 0.2, ease: easings.easeOut }
  },
};

// Hover micro-interactions
export const hoverLift = {
  whileHover: { 
    y: -4, 
    transition: { duration: durations.fast, ease: easings.easeOut }
  },
  whileTap: { 
    y: 0,
    transition: { duration: durations.fast }
  },
};

export const hoverScale = {
  whileHover: { 
    scale: 1.02,
    transition: { duration: durations.fast, ease: easings.easeOut }
  },
  whileTap: { 
    scale: 0.98,
    transition: { duration: durations.fast }
  },
};

// Loading spinner
export const spin = {
  animate: {
    rotate: 360,
    transition: { 
      duration: 1, 
      repeat: Infinity, 
      ease: "linear" 
    }
  },
};

// Progress bar animation
export const progressBar = {
  initial: { width: 0 },
  animate: (value) => ({
    width: `${value}%`,
    transition: { duration: durations.medium, ease: easings.easeOut }
  }),
};

// Checkmark animation
export const checkmark = {
  initial: { pathLength: 0, opacity: 0 },
  animate: { 
    pathLength: 1, 
    opacity: 1,
    transition: { duration: durations.normal, ease: easings.easeOut }
  },
};

// Utility function to combine animations
export const combineAnimations = (...animations) => {
  return animations.reduce((acc, curr) => ({
    initial: { ...acc.initial, ...curr.initial },
    animate: { ...acc.animate, ...curr.animate },
    exit: { ...acc.exit, ...curr.exit },
    transition: { ...acc.transition, ...curr.transition },
  }), {});
};

// Page variants for route transitions
export const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

// Transition presets
export const spring = { type: "spring", stiffness: 400, damping: 30 };

export const smooth = { type: "tween", ease: "easeOut", duration: 0.35 };

// Animation variants for AnimatePresence modes
export const AnimatePresenceMode = {
  wait: "wait",
  popLayout: "popLayout",
};
