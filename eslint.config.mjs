import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,jsx}"]},
  {languageOptions: { 
    globals: {
      ...globals.browser, // Tarayıcı ortamı için global değişkenler
      ...globals.node,    // Node.js ortamı için global değişkenler
    },
  }},
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
];