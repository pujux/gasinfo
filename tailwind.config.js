module.exports = {
  purge: ["./pages/**/*.{ts,tsx}", "./components/**/*.tsx"],
  darkMode: 'class',
  important: true,
  theme: {
    extend: {
      colors: {
        primaryTextLight: "rgba(0, 0, 0, .85)",
        secondaryTextLight: "rgba(0, 0, 0, .45)",
        primaryBackgroundLight: "rgba(251, 251, 251, 1)",
        secondaryBackgroundLight: "rgba(255, 255, 255, 1)",
        tertiaryBackgroundLight: "rgba(0, 0, 0, 0.2)",
        primaryTextDark: "rgba(255, 255, 255, .85)",
        secondaryTextDark: "rgba(255, 255, 255, .45)",
        primaryBackgroundDark: "rgba(20, 20, 20, 1)",
        secondaryBackgroundDark: "rgba(31, 32, 33, 1)",
        tertiaryBackgroundDark: "rgba(255, 255, 255, 0.2)",
        accentText: "rgba(255, 166, 0, 1)"
      }
    },
    borderRadius: {
      xl: "12px"
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
