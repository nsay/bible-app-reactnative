import { Animated, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Theme } from '../../theme/theme';
import { Notes } from './Notes/Notes';
import { Tags } from './Tags/Tags';

type SideBarProps = {
  width: number;
  theme: Theme;
  sidebarAnim: Animated.Value;
  onClose: () => void;
  onOpenNotes: () => void;
  onOpenTags: () => void;
  toggleTheme: () => void;
};

export function SideBar({
  width,
  theme,
  sidebarAnim,
  onClose,
  onOpenNotes,
  onOpenTags,
  toggleTheme,
}: SideBarProps) {
  return (
    <Animated.View
      style={[
        styles.container,
        {
          width,
          transform: [{ translateX: sidebarAnim }],
          backgroundColor: theme.colors.surface,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.sectionTitle }]}>Menu</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Feather name="x" size={20} color={theme.colors.sectionTitle} />
        </TouchableOpacity>
      </View>

      <Notes theme={theme} onPress={onOpenNotes} />
      <Tags theme={theme} onPress={onOpenTags} />

      <TouchableOpacity style={styles.item} activeOpacity={0.8}>
        <View style={styles.row}>
          <Feather name="settings" size={18} color={theme.colors.text} />
          <Text style={[styles.itemText, { color: theme.colors.text }]}>Settings</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.divider} />
      <View style={styles.themeRow}>
        <Text style={[styles.itemText, { color: theme.colors.text }]}>Dark Mode</Text>
        <Switch
          value={theme.mode === 'dark'}
          onValueChange={toggleTheme}
          thumbColor={theme.mode === 'dark' ? '#0f172a' : '#f8fafc'}
          trackColor={{ false: '#cbd5f5', true: '#22d3ee' }}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
    borderRightWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
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
  item: {
    paddingVertical: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(148, 163, 184, 0.3)',
    marginVertical: 16,
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
