import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Theme } from '../../theme/theme';
import { Book } from '../../api/bible';

export type BookSelectorProps = {
  theme: Theme;
  books: Book[];
  selectedBookId: number | null;
  selectedChapter: number;
  visible: boolean;
  panelHeight: number;
  animation: Animated.Value;
  expandedBookId: number | null;
  onToggleBook: (bookId: number) => void;
  onSelectChapter: (bookId: number, chapter: number) => void;
  onClose: () => void;
  bookChaptersMap: Record<number, number[]>;
  loadingBookId: number | null;
};

export function BookSelector({
  theme,
  books,
  selectedBookId,
  selectedChapter,
  visible,
  panelHeight,
  animation,
  expandedBookId,
  onToggleBook,
  onSelectChapter,
  onClose,
  bookChaptersMap,
  loadingBookId,
}: BookSelectorProps) {
  const panelPointerEvents: 'auto' | 'none' = visible ? 'auto' : 'none';

  return (
    <>
      <TouchableOpacity
        style={[styles.overlay, { opacity: visible ? 1 : 0 }]}
        activeOpacity={1}
        onPress={onClose}
        pointerEvents={visible ? 'auto' : 'none'}
      />
      <Animated.View
        pointerEvents={panelPointerEvents}
        style={[
          styles.panel,
          {
            height: panelHeight,
            transform: [{ translateY: animation }],
            backgroundColor: theme.colors.surface,
          },
        ]}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.sectionTitle }]}>Choose Book & Chapter</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Feather name="x" size={20} color={theme.colors.sectionTitle} />
          </TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {books.map((book) => {
            const isExpanded = expandedBookId === book.id;
            const chapters = bookChaptersMap[book.id] ?? [];
            return (
              <View key={book.id} style={styles.bookCard}>
                <TouchableOpacity
                  style={[styles.bookRow, book.id === selectedBookId && styles.activeBookRow]}
                  onPress={() => onToggleBook(book.id)}
                >
                  <Text style={[styles.bookName, { color: theme.colors.text }]}>{book.name}</Text>
                  <Feather
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color={theme.colors.sectionTitle}
                  />
                </TouchableOpacity>
                {isExpanded && (
                  <View style={styles.chapterGrid}>
                    {chapters.map((chapter) => {
                      const isActive = book.id === selectedBookId && chapter === selectedChapter;
                      return (
                        <TouchableOpacity
                          key={chapter}
                          style={[styles.chapterChip, isActive && styles.chapterChipActive]}
                          onPress={() => onSelectChapter(book.id, chapter)}
                        >
                          <Text
                            style={[
                              styles.chapterChipText,
                              { color: theme.colors.text },
                              isActive && styles.chapterChipTextActive,
                            ]}
                          >
                            {chapter}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                    {loadingBookId === book.id && (
                      <Text style={[styles.loadingText, { color: theme.colors.textMuted }]}>Loading chapters...</Text>
                    )}
                  </View>
                )}
              </View>
            );
          })}
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
  bookCard: {
    marginBottom: 10,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    backgroundColor: 'rgba(148, 163, 184, 0.04)',
  },
  bookRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  activeBookRow: {
    backgroundColor: 'rgba(34, 211, 238, 0.08)',
  },
  bookName: {
    fontSize: 16,
    fontWeight: '600',
  },
  chapterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  chapterChip: {
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.4)',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(148, 163, 184, 0.08)',
  },
  chapterChipActive: {
    backgroundColor: '#22d3ee',
    borderColor: '#22d3ee',
  },
  chapterChipText: {
    fontWeight: '600',
  },
  chapterChipTextActive: {
    color: '#0f172a',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 12,
  },
});
