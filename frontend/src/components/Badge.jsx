import React from "react";

/**
 * Renders a small badge with customizable text and color.
 * @param {object} props - The component properties.
 * @param {string} props.text - The text to display inside the badge.
 * @param {string} props.color - The desired color for the badge (e.g., "blue", "green", "red").
 */
const Badge = ({ text, color }) => {
    // Defines a mapping of color names to Tailwind CSS classes for consistent styling.
    const colorClasses = {
        blue: "bg-blue-100 text-blue-800",
        red: "bg-red-100 text-red-800",
        green: "bg-green-100 text-green-800",
        yellow: "bg-yellow-100 text-yellow-800",
        purple: "bg-purple-100 text-purple-800",
        gray: "bg-gray-100 text-gray-800",
    };

    // Selects the appropriate color class; defaults to 'gray' if the provided color is not found.
    const selectedColorClass = colorClasses[color] || colorClasses.gray;

    return (
        <span
            className={`
                ${selectedColorClass}
                text-xs font-semibold
                px-2.5 py-0.5 rounded-full
                inline-flex items-center justify-center
                tracking-wide
                transition-colors duration-200 ease-in-out
            `}
        >
            {text}
        </span>
    );
};

export default Badge;