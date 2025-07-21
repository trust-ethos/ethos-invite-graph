import { defineConfig } from "$fresh/server.ts";
import { css as _css } from "twind/css";
import twindPlugin from "$fresh/plugins/twind.ts";
import twindConfig from "./twind.config.ts";

export default defineConfig({
  plugins: [twindPlugin(twindConfig)],
});
