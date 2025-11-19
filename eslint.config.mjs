// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    // tseslint.configs.recommended,

    tseslint.configs.strict,
    tseslint.configs.stylistic,

    // tseslint.configs.recommendedTypeChecked,

    // Custom Rules
    {
        rules: {

            // WARNING: Do not leave any console.log uncommented
            "no-console": "warn",


            // ERROR: Do not use explicit any
            //"@typescript-eslint/no-explicit-any": "off",


            // This rules says not to allow any unused variables or arguments or parameters,
            // except for those that start with an underscore (_).
            "@typescript-eslint/no-unused-vars": ["error", {"varsIgnorePattern": "_", "argsIgnorePattern": "_"}],

        },
    }
);
