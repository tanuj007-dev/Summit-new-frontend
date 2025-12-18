import React from 'react';
import { motion } from 'framer-motion';

const Loading = ({ fullScreen = false, size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const containerClass = fullScreen 
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-white'
    : 'flex items-center justify-center';

  return (
    <div className={containerClass}>
      {fullScreen && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-[#DD2B1C]/5 to-transparent"
          animate={{
            background: [
              'linear-gradient(135deg, rgba(221,43,28,0.05) 0%, transparent 100%)',
              'linear-gradient(225deg, rgba(221,43,28,0.08) 0%, transparent 100%)',
              'linear-gradient(315deg, rgba(221,43,28,0.05) 0%, transparent 100%)',
              'linear-gradient(45deg, rgba(221,43,28,0.08) 0%, transparent 100%)',
              'linear-gradient(135deg, rgba(221,43,28,0.05) 0%, transparent 100%)'
            ]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
      
      <motion.div
        className={`${sizeClasses[size]} relative`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.5,
          ease: "easeOut"
        }}
      >
        <motion.div
          className="absolute inset-0 border-4 border-gray-200 rounded-full"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute inset-0 border-4 border-[#DD2B1C] rounded-full border-t-transparent border-r-transparent"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <motion.div
          className="absolute inset-0 border-2 border-[#DD2B1C]/30 rounded-full border-b-transparent border-l-transparent"
          animate={{ rotate: -360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </motion.div>
      
      {fullScreen && (
        <motion.div
          className="absolute bottom-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.p 
            className="text-lg font-medium text-gray-700"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Loading...
          </motion.p>
          <motion.div
            className="flex justify-center mt-2 space-x-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-[#DD2B1C] rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Loading;
