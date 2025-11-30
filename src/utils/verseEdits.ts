import { VerseEdit } from '../types/verses';

export type VerseEditNode = string | { original: string; replacement: string };

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const buildVerseEditNodes = (text: string, verseEdits: VerseEdit[] = []): VerseEditNode[] => {
  if (!verseEdits.length) {
    return [text];
  }

  const normalizedEdits = verseEdits.filter((edit) => edit.original.trim().length > 0);
  if (!normalizedEdits.length) {
    return [text];
  }

  let nodes: VerseEditNode[] = [text];

  normalizedEdits.forEach((edit) => {
    const regex = new RegExp(escapeRegExp(edit.original.trim()), 'gi');
    const nextNodes: VerseEditNode[] = [];

    nodes.forEach((node) => {
      if (typeof node !== 'string') {
        nextNodes.push(node);
        return;
      }

      let lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = regex.exec(node)) !== null) {
        if (match.index > lastIndex) {
          nextNodes.push(node.slice(lastIndex, match.index));
        }

        nextNodes.push({
          original: match[0],
          replacement: edit.replacement,
        });
        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < node.length) {
        nextNodes.push(node.slice(lastIndex));
      }
    });

    nodes = nextNodes;
  });

  return nodes;
};
