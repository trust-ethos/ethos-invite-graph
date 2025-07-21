#!/usr/bin/env -S deno run -A --watch=static/,routes/

import { start } from "$fresh/server.ts";
import config from "./fresh.config.ts";
import manifest from "./fresh.gen.ts";

import "$std/dotenv/load.ts";

await start(manifest, config); 