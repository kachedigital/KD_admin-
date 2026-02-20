"use client";

import React from 'react';
import { motion } from 'framer-motion';

// Junior: Use these exact cubic-bezier values for the "heavy" mechanical feel
export const STEP_TRANSITION = {
    initial: { x: "10%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-10%", opacity: 0 },
    transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
        mass: 1,
        restDelta: 0.001
    }
};

interface StepWrapperProps {
    children: React.ReactNode;
    stepKey: string | number;
}

export const StepWrapper = ({ children, stepKey }: StepWrapperProps) => {
    return (
        <motion.div
            key={stepKey}
            initial={STEP_TRANSITION.initial}
            animate={STEP_TRANSITION.animate}
            exit={STEP_TRANSITION.exit}
            transition={STEP_TRANSITION.transition}
            className="w-full h-full"
        >
            {children}
        </motion.div>
    );
};
