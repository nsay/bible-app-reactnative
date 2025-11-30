export type VerseEdit = {
  id: string;
  original: string;
  replacement: string;
};

export type VerseNote = {
  id: string;
  text: string;
  ref?: {
    verseId: number;
    chapterId: number;
    bookId: number;
    bookName: string;
    text?: string;
  };
};

export type VerseTag = {
  id: string;
  value: string;
  ref?: {
    verseId: number;
    chapterId: number;
    bookId: number;
    bookName: string;
    text?: string;
  };
};
