export function listNotes(notes, query = '') {
  const needle = query.toLowerCase();
  return notes.filter(note => !note.archived && note.title.toLowerCase().includes(needle))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
