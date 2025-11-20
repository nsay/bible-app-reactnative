import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Theme } from '../theme/theme';

type SectionHeaderProps = {
  theme: Theme;
  title: string;
  loading?: boolean;
};

export function SectionHeader({ theme, title, loading }: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: theme.colors.sectionTitle }]}>{title}</Text>
      {loading && <ActivityIndicator size="small" color={theme.colors.accent} />}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 0,
    fontWeight: '600',
  },
});
