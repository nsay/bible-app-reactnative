import { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Book } from '../api/bible';
import { Theme } from '../theme/theme';

type BookPickerProps = {
  books: Book[];
  selectedBookId: number | null;
  onSelect: (bookId: number) => void;
  theme: Theme;
};

const SHEET_DURATION = 250;

export function BookPicker({ books, selectedBookId, onSelect, theme }: BookPickerProps) {
  const [visible, setVisible] = useState(false);
  const sheetAnim = useRef(new Animated.Value(0)).current;
  const screenHeight = Dimensions.get('window').height;
  const selectedBook = books.find((book) => book.id === selectedBookId);
  const sections = useMemo(() => {
    const grouped: Record<string, Book[]> = {};
    books.forEach((book) => {
      const title =
        book.testament === 'OT'
          ? 'Old Testament'
          : book.testament === 'NT'
          ? 'New Testament'
          : book.testament;
      grouped[title] = grouped[title] ? [...grouped[title], book] : [book];
    });

    const orderedTitles = ['Old Testament', 'New Testament', ...Object.keys(grouped)];
    return orderedTitles
      .filter((title, index, arr) => arr.indexOf(title) === index && grouped[title])
      .map((title) => ({
        title,
        data: grouped[title].sort((a, b) => a.id - b.id),
      }));
  }, [books]);

  const openSheet = () => {
    setVisible(true);
    sheetAnim.setValue(screenHeight);
    Animated.timing(sheetAnim, {
      toValue: 0,
      duration: SHEET_DURATION,
      useNativeDriver: true,
    }).start();
  };

  const closeSheet = () => {
    Animated.timing(sheetAnim, {
      toValue: screenHeight,
      duration: SHEET_DURATION - 30,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  const handleSelect = (bookId: number) => {
    onSelect(bookId);
    closeSheet();
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.trigger,
          {
            borderColor: theme.colors.chipBorder,
            backgroundColor: theme.colors.surfaceAlt,
          },
        ]}
        onPress={openSheet}
        activeOpacity={0.85}
      >
        <Text style={[styles.triggerLabel, { color: theme.colors.textMuted }]}>Current Book</Text>
        <Text style={[styles.triggerValue, { color: theme.colors.sectionTitle }]}> 
          {selectedBook ? selectedBook.name : 'Select a book'}
        </Text>
      </TouchableOpacity>

      {visible && (
        <Modal transparent animationType="none" visible onRequestClose={closeSheet}>
          <View style={styles.sheetWrapper}>
            <TouchableOpacity style={styles.sheetOverlay} activeOpacity={1} onPress={closeSheet} />
            <Animated.View
              style={[
                styles.sheetContent,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.verseCardBorder,
                  transform: [{ translateY: sheetAnim }],
                },
              ]}
            >
              <View style={styles.sheetHeader}>
                <Text style={[styles.sheetTitle, { color: theme.colors.sectionTitle }]}>Choose a Book</Text>
                <TouchableOpacity style={styles.closeButton} onPress={closeSheet}>
                  <Feather name="x" size={20} color={theme.colors.sectionTitle} />
                </TouchableOpacity>
              </View>
              <SectionList
                sections={sections}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={styles.sheetListContent}
                renderSectionHeader={({ section }) => (
                  <View
                    style={[
                      styles.sectionHeaderContainer,
                      { backgroundColor: theme.colors.surface },
                    ]}
                  >
                    <Text style={[styles.sectionHeader, { color: theme.colors.textMuted }]}> 
                      {section.title}
                    </Text>
                  </View>
                )}
                renderItem={({ item }) => {
                  const isActive = item.id === selectedBookId;
                  return (
                    <TouchableOpacity
                      style={[
                        styles.bookRow,
                        {
                          borderColor: theme.colors.chipBorder,
                          backgroundColor: isActive ? theme.colors.chipBgActive : 'transparent',
                        },
                      ]}
                      onPress={() => handleSelect(item.id)}
                      activeOpacity={0.9}
                    >
                      <Text
                        style={[
                          styles.bookName,
                          {
                            color: isActive ? theme.colors.chipTextActive : theme.colors.chipText,
                          },
                        ]}
                      >
                        {item.name}
                      </Text>
                      <Text
                        style={[
                          styles.bookMeta,
                          {
                            color: isActive ? theme.colors.chipTextActive : theme.colors.textMuted,
                          },
                        ]}
                      >
                        {item.genre.name}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
                showsVerticalScrollIndicator={false}
              />
            </Animated.View>
          </View>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  triggerLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  triggerValue: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 4,
  },
  sheetWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  sheetContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 46,
    paddingHorizontal: 20,
    paddingBottom: 32,
    borderTopWidth: 1,
    maxHeight: '100%',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  sheetListContent: {
    paddingBottom: 60,
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
  sectionHeaderContainer: {
    paddingVertical: 4,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  bookRow: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  bookName: {
    fontSize: 15,
    fontWeight: '600',
  },
  bookMeta: {
    fontSize: 12,
    marginTop: 4,
  },
});
