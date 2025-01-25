/** @type {import("prettier").Config} */
export default {
  plugins: [
    'prettier-plugin-astro',
    'prettier-plugin-tailwindcss',
    'prettier-plugin-classnames',
    'prettier-plugin-merge',
  ],
  printWidth: 105, // Use this to limit line length globally, including classes
  proseWrap: 'always',
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  arrowParens: 'always',
  tailwindConfig: './tailwind.config.mjs',
  overrides: [
    {
      files: '*.astro',
      options: { parser: 'astro' },
    },
  ],
};
