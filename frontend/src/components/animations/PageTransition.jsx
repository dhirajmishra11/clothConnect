import { motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    x: -20
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: 'easeInOut'
    }
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.3,
      ease: 'easeInOut'
    }
  }
};

const variants = {
  default: pageVariants,
  fade: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: 0.4 }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 }
    }
  },
  slide: {
    initial: { x: '100%' },
    animate: {
      x: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 250
      }
    },
    exit: {
      x: '-100%',
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 250
      }
    }
  },
  scale: {
    initial: {
      opacity: 0,
      scale: 0.95
    },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 250
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 250
      }
    }
  }
};

export const PageTransition = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const selectedVariant = variants[variant] || variants.default;

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={selectedVariant}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};