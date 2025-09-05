/** @type {import('tailwindcss').Config} */

// BUG SA NE MARCHE PAS 
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'primary': "#0A66C2",   
          'secondary': "#2563EB", 
          'accent': "#22C55E",
          'BG': "#F3F4F6",
          'Txt': "#111827",           
        },
        fontFamily: {
          title: ["Poppins", "sans-serif"],
          text: ["Inter", "sans-serif"],
        },
        spacing: {
          128: "32rem", 
        },
      },
    },
    plugins: [],
  };
  