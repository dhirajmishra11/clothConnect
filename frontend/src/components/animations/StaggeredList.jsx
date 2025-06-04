import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24
    }
  }
};

export const StaggeredList = ({ 
  children,
  className = '',
  delay = 0,
  as = 'div' // Can be 'ul', 'ol', etc.
}) => {
  const Component = motion[as];
  
  return (
    <Component
      variants={containerVariants}
      initial="hidden"
      animate="show"
      transition={{ delay }}
      className={className}
    >
      {Array.isArray(children)
        ? children.map((child, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="w-full"
            >
              {child}
            </motion.div>
          ))
        : children}
    </Component>
  );
};