/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}","./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        pthin: ["BeVietnamPro-Thin", "sans-serif"],
        pextralight: ["BeVietnamPro-ExtraLight", "sans-serif"],
        plight: ["BeVietnamPro-Light", "sans-serif"],
        pregular: ["BeVietnamPro-Regular", "sans-serif"],
        pmedium: ["BeVietnamPro-Medium", "sans-serif"],
        psemibold: ["BeVietnamPro-SemiBold", "sans-serif"],
        pbold: ["BeVietnamPro-Bold", "sans-serif"],
        pextrabold: ["BeVietnamPro-ExtraBold", "sans-serif"],
        pblack: ["BeVietnamPro-Black", "sans-serif"],
      },
    },
  },
  plugins: [],
}