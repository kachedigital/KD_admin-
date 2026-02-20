export const VaultShield = ({ active, hasError = false }: { active: boolean, hasError?: boolean }) => (
    <svg
        width="16" height="16" viewBox="0 0 24 24" fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={hasError ? "drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]" : active ? "drop-shadow-[0_0_3px_rgba(34,197,94,0.4)]" : ""}
    >
        <path
            d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z"
            stroke={hasError ? "#DC2626" : active ? "#22C55E" : "#475569"}
            strokeWidth="0.5"
            vectorEffect="non-scaling-stroke"
        />
    </svg>
);
