import { motion } from 'framer-motion';

export const FadeIn = ({
  children,
  delay = 0,
  duration = 0.5,
  direction = null,
  distance = 24,
  className = '',
  once = true,
  ...props
}) => {
  const getDirectionVariants = () => {
    switch (direction) {
      case 'up':
        return {
          hidden: { opacity: 0, y: distance },
          visible: { opacity: 1, y: 0 }
        };
      case 'down':
        return {
          hidden: { opacity: 0, y: -distance },
          visible: { opacity: 1, y: 0 }
        };
      case 'left':
        return {
          hidden: { opacity: 0, x: distance },
          visible: { opacity: 1, x: 0 }
        };
      case 'right':
        return {
          hidden: { opacity: 0, x: -distance },
          visible: { opacity: 1, x: 0 }
        };
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 }
        };
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      variants={getDirectionVariants()}
      transition={{
        duration,
        delay,
        ease: 'easeOut'
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};