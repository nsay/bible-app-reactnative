import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Theme } from '../../../theme/theme';

type NotesProps = {
  theme: Theme;
  onPress: () => void;
};

export function Notes({ theme, onPress }: NotesProps) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.row}>
        <Feather name="file-text" size={18} color={theme.colors.text} />
        <Text style={[styles.text, { color: theme.colors.text }]}>Notes</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    paddingVertical: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
