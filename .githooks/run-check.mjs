#!/usr/bin/env node
import { main } from '../scripts/check.mjs';

export function run(mode) {
  process.exitCode = main([mode]);
}
