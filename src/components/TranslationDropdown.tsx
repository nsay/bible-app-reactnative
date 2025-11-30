import {
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { Theme } from '../theme/theme';
import { TranslationOption } from '../constants/translations';

const SHEET_DURATION = 250;

type TranslationDropdownProps = {
  options: TranslationOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  theme: Theme;
};

export function TranslationDropdown({ options, selectedValue, onSelect, theme }: TranslationDropdownProps) {
  const [visible, setVisible] = useState(false);
  const sheetAnim = useRef(new Animated.Value(0)).current;
  const screenHeight = Dimensions.get('window').height;
  const selectedOption = options.find((option) => option.value === selectedValue);

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
    }).start(() => {
      setVisible(false);
    });
  };

  const handleSelect = (value: string) => {
    onSelect(value);
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
        activeOpacity={0.7}
      >
        <Text style={[styles.triggerText, { color: theme.colors.text }]}>
          {selectedOption?.value ?? 'KJV'}
        </Text>
      </TouchableOpacity>

      {visible && (
        <Modal transparent animationType="none" visible onRequestClose={closeSheet}>
          <View style={styles.sheetWrapper}>
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
                <Text style={[styles.sheetTitle, { color: theme.colors.sectionTitle }]}>Choose a translation</Text>
                <TouchableOpacity style={styles.closeButton} onPress={closeSheet}>
                  <Feather name="x" size={20} color={theme.colors.sectionTitle} />
                </TouchableOpacity>
              </View>
              <ScrollView contentContainerStyle={styles.sheetOptions} showsVerticalScrollIndicator={false}>
                {options.map((option) => {
                  const isActive = option.value === selectedValue;
                  return (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.optionCard,
                        {
                          borderColor: theme.colors.verseCardBorder,
                          backgroundColor: isActive ? theme.colors.bookPillBg : theme.colors.verseCardBg,
                        },
                      ]}
                      activeOpacity={0.9}
                      onPress={() => handleSelect(option.value)}
                    >
                      <Text
                        style={[
                          styles.optionLabel,
                          { color: isActive ? theme.colors.sectionTitle : theme.colors.text },
                        ]}
                      >
                        {option.label}
                      </Text>
                      <Text style={[styles.optionValue, { color: theme.colors.textMuted }]}>{option.value}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </Animated.View>
          </View>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    minWidth: 70,
    alignItems: 'center',
  },
  triggerText: {
    fontWeight: '600',
  },
  sheetWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  sheetContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 46,
    paddingHorizontal: 20,
    paddingBottom: 32,
    borderTopWidth: 1,
    minHeight: '100%',
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
  sheetOptions: {
    paddingBottom: 40,
    gap: 10,
  },
  optionCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  optionValue: {
    fontSize: 13,
    marginTop: 4,
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
});
