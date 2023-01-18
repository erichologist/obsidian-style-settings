import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import css from "rollup-plugin-css-only";
import svelte from "rollup-plugin-svelte";
import {sveltePreprocess} from "svelte-preprocess/dist/autoProcess";

const isProd = process.env.BUILD === "production";

const banner = `/*
THIS IS A GENERATED/BUNDLED FILE BY ROLLUP
if you want to view the source visit the plugins github repository
*/
`;

const output = [
  {
    input: "./src/main.ts",
    output: {
      dir: ".",
      sourcemap: isProd ? false : "inline",
      format: "cjs",
      exports: "default",
      banner,
    },
    external: ["obsidian"],
    plugins: [
      svelte({
        preprocess: sveltePreprocess(),
      }),
      css({ output: "styles.css" }),
      typescript(),
      nodeResolve({ browser: true }),
      commonjs(),
    ],
  },
];

export default output;
