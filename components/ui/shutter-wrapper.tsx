'use client';
import { motion, AnimatePresence } from 'framer-motion';

export const ShutterWrapper = ({ isActive, isFocus, children }: { isActive: boolean, isFocus: boolean, children: React.ReactNode }) => {
    return (
        <motion.div
            animate={{
                opacity: isActive ? 0 : 1,
                backgroundColor: isFocus ? "#050505" : "transparent"
            }}
            transition={{
                duration: 0.1, // Adjusted sequence time for peak darkness
                ease: "easeInOut"
            }}
            style={{ willChange: 'opacity, background-color', width: '100%', height: '100%' }}
        >
            {children}
        </motion.div>
    );
};
