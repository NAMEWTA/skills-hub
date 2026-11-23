import { readFile, writeFile } from 'node:fs/promises';
export async function loadNotes(file) { return JSON.parse(await readFile(file, 'utf8')); }
export async function saveNotes(file, notes) { await writeFile(file, JSON.stringify(notes, null, 2)); }
