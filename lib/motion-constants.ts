export const VAULT_SPRING = {
    type: "spring" as const,
    stiffness: 260, // High tension for that "quick pull-back"
    damping: 30,    // High friction to prevent oscillation and ensure a "smooth settle"
    mass: 0.8,      // Slightly lower mass for snappy initial movement
    restDelta: 0.001 // Precision finish
};

export const SHUTTER_FADE = {
    duration: 0.1,  // 100ms dip
    ease: [0.4, 0, 0.2, 1] // Standard "shutter" cubic-bezier
};
