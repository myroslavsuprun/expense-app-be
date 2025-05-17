import js from "@eslint/js";
import path from "node:path";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import stylisticJs from "@stylistic/eslint-plugin-js";
import prettyImports from "eslint-plugin-pretty-imports";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default [
    ...compat.extends(
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ),
    {
        plugins: {
            "@typescript-eslint": typescriptEslint,
            "pretty-imports": prettyImports,
            "@stylistic/js": stylisticJs,
        },

        languageOptions: {
            globals: {
                ...globals.node,
            },

            parser: tsParser,
            ecmaVersion: "latest",
            sourceType: "module",
        },

        rules: {
            "pretty-imports/sorted": "warn",

            "@typescript-eslint/no-unused-vars": "warn",
            "@typescript-eslint/no-use-before-define": "off",

            indent: ["error", 4],
            "linebreak-style": ["error", "unix"],
            quotes: ["error", "double", "avoid-escape"],
            semi: ["error", "always"],

            "no-param-reassign": "error",
            "default-case": "off",
            "consistent-return": "off",
            curly: ["error", "all"],
            "no-negated-condition": "error",
            "no-unneeded-ternary": "error",

            "padding-line-between-statements": [
                "warn",
                {
                    blankLine: "always",
                    prev: "*",
                    next: [
                        "multiline-expression",
                        "multiline-const",
                        "return",
                        "try",
                        "block-like",
                        "class",
                        "function",
                        "multiline-block-like",
                    ],
                },
                {
                    blankLine: "always",
                    next: "*",
                    prev: [
                        "multiline-expression",
                        "multiline-const",
                        "return",
                        "try",
                        "block-like",
                        "class",
                        "function",
                        "multiline-block-like",
                    ],
                },
                {
                    blankLine: "any",
                    prev: ["case", "default"],
                    next: ["case", "default", "return"],
                },
            ],
        },
    },
    {
        files: ["**/.eslintrc.{js,cjs}"],

        languageOptions: {
            globals: {
                ...globals.node,
            },

            ecmaVersion: 5,
            sourceType: "commonjs",
        },
    },
];
