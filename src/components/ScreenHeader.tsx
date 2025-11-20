import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Theme } from '../theme/theme';
import { TranslationOption } from '../constants/translations';
import { TranslationDropdown } from './TranslationDropdown';

type ScreenHeaderProps = {
  theme: Theme;
  title: string;
  subtitle: string;
  onToggleTheme: () => void;
  translationOptions: TranslationOption[];
  selectedTranslation: string;
  onSelectTranslation: (value: string) => void;
};

export function ScreenHeader({
  theme,
  title,
  subtitle,
  onToggleTheme,
  translationOptions,
  selectedTranslation,
  onSelectTranslation,
}: ScreenHeaderProps) {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerRow}>
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
          <TouchableOpacity
            onPress={onToggleTheme}
            style={[styles.themeToggle, { borderColor: theme.colors.chipBorder }]}
          >
            <Text style={styles.toggleEmoji}>{theme.mode === 'dark' ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[styles.subtitle, { color: theme.colors.subtitle }]}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '700',
    flex: 1,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 5,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
  },
  themeToggle: {
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
  },
  toggleEmoji: {
    fontSize: 18,
  },
});
