import { useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Theme } from '../theme/theme';

type ChapterPickerProps = {
  chapters: number[];
  selectedChapter: number;
  onSelect: (chapter: number) => void;
  theme: Theme;
};

export function ChapterPicker({
  chapters,
  selectedChapter,
  onSelect,
  theme,
}: ChapterPickerProps) {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);
  const handleSelect = (chapter: number) => {
    onSelect(chapter);
    close();
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
        onPress={() => setOpen(true)}
        activeOpacity={0.85}
      >
        <Text style={[styles.triggerLabel, { color: theme.colors.textMuted }]}>Current Chapter</Text>
        <Text style={[styles.triggerValue, { color: theme.colors.sectionTitle }]}>
          {selectedChapter}
        </Text>
      </TouchableOpacity>

      <Modal transparent visible={open} animationType="fade" onRequestClose={close}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={close} />
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.chipBorder,
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.sectionTitle }]}>Choose a Chapter</Text>
              <TouchableOpacity style={styles.closeButton} onPress={close}>
                <Text style={[styles.closeText, { color: theme.colors.sectionTitle }]}>×</Text>
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
            />
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    maxHeight: '70%',
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 22,
    fontWeight: '600',
  },
  chapterGrid: {
    paddingBottom: 12,
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
