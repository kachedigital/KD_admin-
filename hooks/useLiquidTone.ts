export const updateLiquidTone = (value: number) => {
    requestAnimationFrame(() => {
        const r = Math.round(59 + (value / 100) * (139 - 59));
        const g = Math.round(130 + (value / 100) * (92 - 130));
        const b = 246; // Keep the blue base consistent for the "Empire" feel

        document.documentElement.style.setProperty('--glow-color-rgb', `${r}, ${g}, ${b}`);
        document.documentElement.style.setProperty('--glow-color', `rgb(${r}, ${g}, ${b})`);
    });
};
