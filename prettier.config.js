/** @type {import("prettier").Config} */

const config = {
  semi: true,
  singleQuote: true,
  arrowParens: "avoid",
  trailingComma: "all",
  plugins: [
    "prettier-plugin-organize-imports"
  ]
}

export default config;