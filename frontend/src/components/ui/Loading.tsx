import { motion } from 'framer-motion';

export const Loading = () => {
  const MotionDiv = motion.div as any;

  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex space-x-2">
        {[0, 1, 2].map((index) => (
          <MotionDiv key={index} className="w-3 h-3 bg-indigo-600 rounded-full" animate={{ y: [0, -12, 0], }} transition={{ duration: 0.6, repeat: Infinity, delay: index * 0.15, }}/>
        ))}
      </div>
    </div>
  );
};