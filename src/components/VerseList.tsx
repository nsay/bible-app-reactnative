import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Verse } from '../api/bible';
import { Theme } from '../theme/theme';

export type VerseEdit = {
  id: string;
  original: string;
  replacement: string;
};

export type VerseNote = {
  id: string;
  text: string;
};

type VerseListProps = {
  verses: Verse[];
  loading: boolean;
  theme: Theme;
  edits: Record<number, VerseEdit[]>;
  notes: Record<number, VerseNote[]>;
  tags: Record<number, string[]>;
  tagSuggestions: string[];
  onEditVerse: (verse: Verse) => void;
  onAddNote: (verse: Verse) => void;
  onEditNote: (verse: Verse, noteId: string) => void;
  onRemoveNote: (verseId: number, noteId: string) => void;
  onAddTag: (verse: Verse) => void;
  onRemoveTag: (verseId: number, tag: string) => void;
};

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const renderVerseText = (text: string, verseEdits: VerseEdit[], theme: Theme) => {
  if (!verseEdits.length) {
    return <Text style={[styles.verseText, { color: theme.colors.verseText }]}>{text}</Text>;
  }

  type Node = string | { original: string; replacement: string };
  let nodes: Node[] = [text];

  verseEdits.forEach((edit) => {
    const original = edit.original.trim();
    if (!original) {
      return;
    }
    const regex = new RegExp(escapeRegExp(original), 'gi');
    const nextNodes: Node[] = [];

    nodes.forEach((node) => {
      if (typeof node !== 'string') {
        nextNodes.push(node);
        return;
      }

      let lastIndex = 0;
      let match;
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

  return (
    <Text style={[styles.verseText, { color: theme.colors.verseText }]}>
      {nodes.map((node, index) =>
        typeof node === 'string' ? (
          <Text key={`text-${index}`} style={{ color: theme.colors.verseText }}>
            {node}
          </Text>
        ) : (
          <Text key={`edit-${index}`}>
            <Text style={styles.strikeText}>{node.original}</Text>
            <Text style={styles.replacementText}> {node.replacement}</Text>
          </Text>
        ),
      )}
    </Text>
  );
};

export function VerseList({
  verses,
  loading,
  theme,
  edits,
  notes,
  tags,
  tagSuggestions,
  onEditVerse,
  onAddNote,
  onEditNote,
  onRemoveNote,
  onAddTag,
  onRemoveTag,
}: VerseListProps) {
  const renderVerse = ({ item }: { item: Verse }) => (
    <View
      style={[
        styles.verseCard,
        {
          backgroundColor: theme.colors.verseCardBg,
          borderColor: theme.colors.verseCardBorder,
        },
      ]}
    >
      <View style={styles.verseHeader}>
        <Text style={[styles.verseNumber, { color: theme.colors.verseNumber }]}>
          {item.verseId}
        </Text>
        <View style={styles.verseActions}>
          <TouchableOpacity style={styles.iconButton} onPress={() => onAddNote(item)}>
            <Feather name="file-plus" size={16} color={theme.colors.sectionTitle} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => onAddTag(item)}>
            <Feather name="tag" size={16} color={theme.colors.sectionTitle} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => onEditVerse(item)}>
            <Feather name="edit-3" size={16} color={theme.colors.sectionTitle} />
          </TouchableOpacity>
        </View>
      </View>
      {renderVerseText(item.verse, edits[item.id] ?? [], theme)}
      {(tags[item.id] ?? []).length > 0 && (
        <View style={styles.tagList}>
          {(tags[item.id] ?? []).map((tag) => (
            <View
              key={tag}
              style={[
                styles.tagChip,
                {
                  backgroundColor: theme.colors.surfaceAlt,
                  borderColor: theme.colors.chipBorder,
                },
              ]}
            >
              <Text style={[styles.tagText, { color: theme.colors.text }]}>{tag}</Text>
              <TouchableOpacity onPress={() => onRemoveTag(item.id, tag)}>
                <Text style={styles.tagRemove}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
      {(notes[item.id] ?? []).map((note) => (
        <View
          key={note.id}
          style={[
            styles.noteCard,
            {
              backgroundColor: theme.colors.surfaceAlt,
              borderColor: theme.colors.chipBorder,
            },
          ]}
        >
          <View style={styles.noteHeader}>
            <Text style={[styles.noteLabel, { color: theme.colors.sectionTitle }]}>Your note</Text>
            <TouchableOpacity style={styles.noteIconButton} onPress={() => onEditNote(item, note.id)}>
              <Feather name="edit-3" size={14} color={theme.colors.sectionTitle} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.noteText, { color: theme.colors.text }]}>{note.text}</Text>
        </View>
      ))}
    </View>
  );

  if (loading && verses.length === 0) {
    return (
      <View style={styles.loadingState}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
        <Text style={[styles.loadingText, { color: theme.colors.loadingText }]}>
          Loading verses...
        </Text>
      </View>
    );
  }

  if (!loading && verses.length === 0) {
    return (
      <View style={styles.loadingState}>
        <Text style={[styles.loadingText, { color: theme.colors.loadingText }]}>
          Select a book and chapter to start reading.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.verseFlatList}
      data={verses}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderVerse}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.verseList}
    />
  );
}

const styles = StyleSheet.create({
  verseList: {
    paddingBottom: 0,
    paddingTop: 12,
  },
  verseFlatList: {
    flex: 1,
  },
  verseCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  verseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  verseNumber: {
    fontWeight: '700',
    marginBottom: 6,
  },
  verseActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verseText: {
    lineHeight: 20,
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    gap: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tagRemove: {
    color: '#f87171',
    fontSize: 12,
    fontWeight: '700',
  },
  strikeText: {
    textDecorationLine: 'line-through',
    color: '#f87171',
  },
  replacementText: {
    color: '#34d399',
    fontWeight: '600',
  },
  noteCard: {
    marginTop: 8,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  noteLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  noteIconButton: {
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteText: {
    lineHeight: 18,
  },
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    textAlign: 'center',
  },
});
