export const state = {
  catalog: null, currentBook: null, currentBookData: null, currentChapterIndex: 0,
  settings: { fontSize: 19, theme: "light" }, bookmarks: [], notes: {}, highlights: []
};
export const currentChapter = () => state.currentBookData?.chapters?.[state.currentChapterIndex] ?? null;
