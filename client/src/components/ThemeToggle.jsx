import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      whileTap={{ scale: 0.95 }}
      animate={{ rotate: isDarkMode ? 180 : 0 }}
      transition={{ duration: 0.3 }}
      style={{
        background: isDarkMode 
          ? "linear-gradient(135deg, #f39c12, #e67e22)" 
          : "linear-gradient(135deg, #2c3e50, #34495e)",
        border: "none",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        transition: "all 0.3s ease",
      }}
    >
      {isDarkMode ? "☀️" : "🌙"}
    </motion.button>
  );
};

export default ThemeToggle;