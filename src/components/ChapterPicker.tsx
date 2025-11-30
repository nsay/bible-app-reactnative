import { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Theme } from '../theme/theme';

type ChapterPickerProps = {
  chapters: number[];
  selectedChapter: number;
  onSelect: (chapter: number) => void;
  theme: Theme;
};

const SHEET_DURATION = 250;

export function ChapterPicker({ chapters, selectedChapter, onSelect, theme }: ChapterPickerProps) {
  const [visible, setVisible] = useState(false);
  const sheetAnim = useRef(new Animated.Value(0)).current;
  const screenHeight = Dimensions.get('window').height;

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

  const handleSelect = (chapter: number) => {
    onSelect(chapter);
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
        <Text style={[styles.triggerLabel, { color: theme.colors.textMuted }]}>Current Chapter</Text>
        <Text style={[styles.triggerValue, { color: theme.colors.sectionTitle }]}>{selectedChapter}</Text>
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
                <Text style={[styles.sheetTitle, { color: theme.colors.sectionTitle }]}>Choose a Chapter</Text>
              <TouchableOpacity style={styles.closeButton} onPress={closeSheet}>
                <Feather name="x" size={20} color={theme.colors.sectionTitle} />
              </TouchableOpacity>
            </View>
              <FlatList
                data={chapters}
                keyExtractor={(item) => String(item)}
                numColumns={3}
                columnWrapperStyle={styles.columnWrapper}
                contentContainerStyle={styles.chapterGrid}
                renderItem={({ item }) => {
                  const isActive = item === selectedChapter;
                  return (
                    <TouchableOpacity
                      style={[
                        styles.chapterChip,
                        {
                          borderColor: theme.colors.chipBorder,
                          backgroundColor: isActive ? theme.colors.chipBgActive : 'transparent',
                        },
                      ]}
                      onPress={() => handleSelect(item)}
                      activeOpacity={0.9}
                    >
                      <Text
                        style={[
                          styles.chapterText,
                          {
                            color: isActive ? theme.colors.chipTextActive : theme.colors.chipText,
                          },
                        ]}
                      >
                        {item}
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
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
  },
  chapterGrid: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  chapterChip: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  chapterText: {
    fontWeight: '600',
  },
});
