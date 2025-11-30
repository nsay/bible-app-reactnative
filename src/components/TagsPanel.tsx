import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Theme } from '../theme/theme';
import { VerseNote, VerseTag } from '../types/verses';

export type TagGroup = {
  verseId: number;
  chapterId: number;
  bookId: number;
  bookName?: string;
  verseText?: string;
  tags: VerseTag[];
  notes: VerseNote[];
};

type TagsPanelProps = {
  visible: boolean;
  panelHeight: number;
  animation: Animated.Value;
  theme: Theme;
  tagGroups: TagGroup[];
  onClose: () => void;
};

export function TagsPanel({
  visible,
  panelHeight,
  animation,
  theme,
  tagGroups,
  onClose,
}: TagsPanelProps) {
  return (
    <>
      {visible && <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />}
      <Animated.View
        style={[
          styles.panel,
          {
            height: panelHeight,
            transform: [{ translateY: animation }],
            backgroundColor: theme.colors.surface,
          },
        ]}
        pointerEvents="box-none"
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.sectionTitle }]}>All Tags</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Feather name="x" size={20} color={theme.colors.sectionTitle} />
          </TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {tagGroups.length === 0 ? (
            <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>You have no tags yet.</Text>
          ) : (
            tagGroups.map((group) => (
              <View
                key={`${group.bookId}-${group.chapterId}-${group.verseId}`}
                style={[
                  styles.card,
                  {
                    borderColor: theme.colors.verseCardBorder,
                    backgroundColor: theme.colors.verseCardBg,
                  },
                ]}
              >
                <Text style={[styles.verseRef, { color: theme.colors.verseNumber }]}> 
                  {group.bookName ?? 'Verse'} {group.chapterId}:{group.verseId}
                </Text>
                <Text style={[styles.verseText, { color: theme.colors.verseText }]}>
                  {group.verseText ?? ''}
                </Text>
                <View style={styles.tagRow}>
                  {group.tags.map((tag) => (
                    <View
                      key={tag.id}
                      style={[
                        styles.tagChip,
                        {
                          backgroundColor: theme.colors.surfaceAlt,
                          borderColor: theme.colors.chipBorder,
                        },
                      ]}
                    >
                      <Text style={[styles.tagText, { color: theme.colors.text }]}>{tag.value}</Text>
                    </View>
                  ))}
                </View>
                {(group.notes ?? []).map((note) => (
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
                    </View>
                    <Text style={[styles.noteText, { color: theme.colors.text }]}>{note.text}</Text>
                  </View>
                ))}
              </View>
            ))
          )}
        </ScrollView>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  panel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    paddingTop: 46,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  verseRef: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  verseText: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 6,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 14,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
    marginBottom: 4,
  },
  tagChip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  noteCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  noteLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  noteText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
