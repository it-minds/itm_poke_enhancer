module.exports = {
  plugins: ["@typescript-eslint", "simple-import-sort", "unused-imports", "prettier"],
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "off",

    "simple-import-sort/imports": "error",

    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-imports-ts": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      { vars: "all", varsIgnorePattern: "^_", args: "after-used", argsIgnorePattern: "^_" }
    ],

    "prettier/prettier": ["error", {}]
  }
};
