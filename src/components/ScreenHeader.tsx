import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Theme } from '../theme/theme';
import { TranslationOption } from '../constants/translations';
import { TranslationDropdown } from './TranslationDropdown';

type ScreenHeaderProps = {
  theme: Theme;
  title: string;
  translationOptions: TranslationOption[];
  selectedTranslation: string;
  onSelectTranslation: (value: string) => void;
  onToggleMenu: () => void;
};

export function ScreenHeader({
  theme,
  title,
  translationOptions,
  selectedTranslation,
  onSelectTranslation,
  onToggleMenu,
}: ScreenHeaderProps) {
  return (
    <View style={styles.headerRow}>
        <TouchableOpacity style={styles.menuButton} onPress={onToggleMenu}>
          <Text style={[styles.menuIcon, { color: theme.colors.sectionTitle }]}>☰</Text>
        </TouchableOpacity>
        <Text style={[styles.appTitle, { color: theme.colors.title }]} numberOfLines={1}>
        {title}
      </Text>

      <View style={styles.actionsRow}>
        <TranslationDropdown
          options={translationOptions}
          selectedValue={selectedTranslation}
          onSelect={onSelectTranslation}
          theme={theme}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  menuButton: {
    padding: 6,
  },
  menuIcon: {
    fontSize: 22,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '700',
    flex: 1,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
  },
});
