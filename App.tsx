import { useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from './src/components/ScreenHeader';
import { VerseList, VerseEdit, VerseNote } from './src/components/VerseList';
import { ErrorBanner } from './src/components/ErrorBanner';
import { BookPicker } from './src/components/BookPicker';
import { ChapterPicker } from './src/components/ChapterPicker';
import { useBibleData } from './src/hooks/useBibleData';
import { useBibleTheme } from './src/hooks/useBibleTheme';
import { POPULAR_TRANSLATIONS } from './src/constants/translations';
import { Verse } from './src/api/bible';

export default function App() {
  const { theme, toggleTheme } = useBibleTheme();
  const [translation, setTranslation] = useState(POPULAR_TRANSLATIONS[0].value);
  const [verseEdits, setVerseEdits] = useState<Record<number, VerseEdit[]>>({});
  const [verseNotes, setVerseNotes] = useState<Record<number, VerseNote[]>>({});
  const [verseTags, setVerseTags] = useState<Record<number, string[]>>({});
  const [editingVerse, setEditingVerse] = useState<Verse | null>(null);
  const [editOriginal, setEditOriginal] = useState('');
  const [editReplacement, setEditReplacement] = useState('');
  const [noteContext, setNoteContext] = useState<{ verse: Verse; noteId?: string } | null>(null);
  const [noteText, setNoteText] = useState('');
  const [tagVerse, setTagVerse] = useState<Verse | null>(null);
  const [tagText, setTagText] = useState('');
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);

  const {
    books,
    chapters,
    verses,
    selectedBookId,
    selectedChapter,
    loadingBooks,
    loadingChapters,
    loadingVerses,
    error,
    setSelectedBookId,
    setSelectedChapter,
    dismissError,
  } = useBibleData(translation);

  const selectedTranslationOption = useMemo(
    () => POPULAR_TRANSLATIONS.find((option) => option.value === translation),
    [translation],
  );
  const headerSubtitle = selectedTranslationOption
    ? `Reading ${selectedTranslationOption.label}`
    : 'Browse books, chapters, and verses.';

  const handleRequestEdit = (verse: Verse) => {
    setEditingVerse(verse);
    setEditOriginal('');
    setEditReplacement('');
  };

  const handleSaveEdit = () => {
    if (!editingVerse) {
      return;
    }

    const trimmedOriginal = editOriginal.trim();
    const trimmedReplacement = editReplacement.trim();

    if (!trimmedOriginal || !trimmedReplacement) {
      return;
    }

    setVerseEdits((prev) => {
      const current = prev[editingVerse.id] ?? [];
      const nextEdit: VerseEdit = {
        id: `${Date.now()}`,
        original: trimmedOriginal,
        replacement: trimmedReplacement,
      };

      return {
        ...prev,
        [editingVerse.id]: [...current, nextEdit],
      };
    });

    setEditingVerse(null);
    setEditOriginal('');
    setEditReplacement('');
  };

  const handleRemoveEdit = (verseId: number, editId: string) => {
    setVerseEdits((prev) => {
      const filtered = (prev[verseId] ?? []).filter((edit) => edit.id !== editId);
      const next = { ...prev };
      if (filtered.length === 0) {
        delete next[verseId];
      } else {
        next[verseId] = filtered;
      }
      return next;
    });
  };

  const handleCancelEdit = () => {
    setEditingVerse(null);
    setEditOriginal('');
    setEditReplacement('');
  };

  const editingVerseEdits = editingVerse ? verseEdits[editingVerse.id] ?? [] : [];

  const handleAddNote = (verse: Verse) => {
    setNoteContext({ verse });
    setNoteText('');
  };

  const handleEditNote = (verse: Verse, noteId: string) => {
    const existing = verseNotes[verse.id]?.find((note) => note.id === noteId);
    setNoteContext({ verse, noteId });
    setNoteText(existing?.text ?? '');
  };

  const handleSaveNote = () => {
    if (!noteContext) {
      return;
    }

    const trimmed = noteText.trim();

    if (!trimmed) {
      if (noteContext.noteId) {
        handleRemoveNote(noteContext.verse.id, noteContext.noteId);
      }
      setNoteContext(null);
      setNoteText('');
      return;
    }

    setVerseNotes((prev) => {
      const current = prev[noteContext.verse.id] ?? [];
      if (noteContext.noteId) {
        return {
          ...prev,
          [noteContext.verse.id]: current.map((note) =>
            note.id === noteContext.noteId ? { ...note, text: trimmed } : note,
          ),
        };
      }

      const nextNote: VerseNote = {
        id: `${Date.now()}`,
        text: trimmed,
      };

      return {
        ...prev,
        [noteContext.verse.id]: [...current, nextNote],
      };
    });

    setNoteContext(null);
    setNoteText('');
  };

  const handleRemoveNote = (verseId: number, noteId: string) => {
    setVerseNotes((prev) => {
      const current = prev[verseId] ?? [];
      const filtered = current.filter((note) => note.id !== noteId);
      const next = { ...prev };
      if (filtered.length === 0) {
        delete next[verseId];
      } else {
        next[verseId] = filtered;
      }
      return next;
    });
  };

  const handleCancelNote = () => {
    setNoteContext(null);
    setNoteText('');
  };

  const handleRemoveNoteInModal = () => {
    if (!noteContext?.noteId) {
      return;
    }

    handleRemoveNote(noteContext.verse.id, noteContext.noteId);
    setNoteContext(null);
    setNoteText('');
  };

  const handleAddTag = (verse: Verse) => {
    setTagVerse(verse);
    setTagText('');
  };

  const handleSaveTag = () => {
    if (!tagVerse) {
      return;
    }

    const trimmed = tagText.trim();
    if (!trimmed) {
      setTagVerse(null);
      setTagText('');
      return;
    }

    setVerseTags((prev) => {
      const current = prev[tagVerse.id] ?? [];
      if (current.some((tag) => tag.toLowerCase() === trimmed.toLowerCase())) {
        return prev;
      }
      return {
        ...prev,
        [tagVerse.id]: [...current, trimmed],
      };
    });

    setTagSuggestions((prev) => {
      if (prev.some((tag) => tag.toLowerCase() === trimmed.toLowerCase())) {
        return prev;
      }
      return [trimmed, ...prev].slice(0, 10);
    });

    setTagVerse(null);
    setTagText('');
  };

  const handleRemoveTag = (verseId: number, tag: string) => {
    setVerseTags((prev) => {
      const current = prev[verseId] ?? [];
      const filtered = current.filter((item) => item !== tag);
      const next = { ...prev };
      if (filtered.length === 0) {
        delete next[verseId];
      } else {
        next[verseId] = filtered;
      }
      return next;
    });
  };

  const handleCancelTag = () => {
    setTagVerse(null);
    setTagText('');
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
        <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
        <View style={styles.container}>
          <ScreenHeader
            title="Daily Bible"
            subtitle={headerSubtitle}
            theme={theme}
            onToggleTheme={toggleTheme}
            translationOptions={POPULAR_TRANSLATIONS}
            selectedTranslation={translation}
            onSelectTranslation={setTranslation}
          />

          <View style={styles.pickerRow}>
            <View style={styles.pickerColumn}>
              <BookPicker
                books={books}
                selectedBookId={selectedBookId}
                onSelect={setSelectedBookId}
                theme={theme}
              />
            </View>
            <View style={styles.pickerColumn}>
              <ChapterPicker
                chapters={chapters}
                selectedChapter={selectedChapter}
                onSelect={setSelectedChapter}
                theme={theme}
              />
            </View>
          </View>

          {error && <ErrorBanner message={error} onDismiss={dismissError} theme={theme} />}

          <VerseList
            verses={verses}
            loading={loadingVerses}
            theme={theme}
            edits={verseEdits}
            notes={verseNotes}
            tags={verseTags}
            tagSuggestions={tagSuggestions}
            onEditVerse={handleRequestEdit}
            onAddNote={handleAddNote}
            onEditNote={handleEditNote}
            onRemoveNote={handleRemoveNote}
            onAddTag={handleAddTag}
            onRemoveTag={handleRemoveTag}
          />
        </View>
      </SafeAreaView>

      <Modal transparent visible={!!editingVerse} animationType="fade" onRequestClose={handleCancelEdit}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.editOverlay}
        >
          <View style={[styles.editCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.editTitle, { color: theme.colors.sectionTitle }]}>
              Edit Verse {editingVerse?.verseId}
            </Text>
            <Text style={[styles.editSubtitle, { color: theme.colors.textMuted }]}>
              Replace a word to personalize your reading. Original words will be crossed out and
              replacements highlighted.
            </Text>
            {editingVerse && (
              <View style={[styles.versePreview, { backgroundColor: theme.colors.surfaceAlt }]}>
                <Text style={[styles.versePreviewText, { color: theme.colors.text }]}>
                  {editingVerse.verse}
                </Text>
              </View>
            )}

            <TextInput
              style={[styles.input, { borderColor: theme.colors.chipBorder, color: theme.colors.text }]}
              placeholder="Word or phrase to replace"
              placeholderTextColor={theme.colors.textMuted}
              value={editOriginal}
              onChangeText={setEditOriginal}
            />
            <TextInput
              style={[styles.input, { borderColor: theme.colors.chipBorder, color: theme.colors.text }]}
              placeholder="Replacement"
              placeholderTextColor={theme.colors.textMuted}
              value={editReplacement}
              onChangeText={setEditReplacement}
            />

            {editingVerseEdits.length > 0 && (
              <View style={styles.currentEdits}>
                <Text style={[styles.currentEditsTitle, { color: theme.colors.subtitle }]}>
                  Current changes
                </Text>
                {editingVerseEdits.map((edit) => (
                  <View key={edit.id} style={styles.currentEditRow}>
                    <Text style={styles.currentEditText}>
                      <Text style={styles.modalStrike}>{edit.original}</Text>
                      <Text style={styles.modalReplacement}> → {edit.replacement}</Text>
                    </Text>
                    <TouchableOpacity onPress={() => handleRemoveEdit(editingVerse!.id, edit.id)}>
                      <Text style={styles.removeEdit}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.editActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveEdit}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal transparent visible={!!noteContext} animationType="fade" onRequestClose={handleCancelNote}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.editOverlay}
        >
          <View style={[styles.noteCardModal, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.editTitle, { color: theme.colors.sectionTitle }]}>
              {noteContext ? `Verse ${noteContext.verse.verseId} note` : 'Add note'}
            </Text>
            <Text style={[styles.editSubtitle, { color: theme.colors.textMuted }]}>
              Jot down what stands out to you in this verse.
            </Text>
            <TextInput
              style={[
                styles.noteInput,
                { borderColor: theme.colors.chipBorder, color: theme.colors.text },
              ]}
              placeholder="Write your note..."
              placeholderTextColor={theme.colors.textMuted}
              value={noteText}
              multiline
              onChangeText={setNoteText}
            />
            <View style={styles.noteActions}>
              {noteContext?.noteId && (
                <TouchableOpacity style={styles.removeButton} onPress={handleRemoveNoteInModal}>
                  <Text style={styles.removeButtonText}>Remove note</Text>
                </TouchableOpacity>
              )}
              <View style={styles.noteActionButtons}>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancelNote}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveNote}>
                  <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal transparent visible={!!tagVerse} animationType="fade" onRequestClose={handleCancelTag}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.editOverlay}
        >
          <View style={[styles.tagCardModal, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.editTitle, { color: theme.colors.sectionTitle }]}>
              {tagVerse ? `Tags for verse ${tagVerse.verseId}` : 'Add tag'}
            </Text>
            <Text style={[styles.editSubtitle, { color: theme.colors.textMuted }]}>
              Create short keywords to categorize this verse.
            </Text>
            <TextInput
              style={[
                styles.tagInput,
                { borderColor: theme.colors.chipBorder, color: theme.colors.text },
              ]}
              placeholder="Enter tag"
              placeholderTextColor={theme.colors.textMuted}
              value={tagText}
              onChangeText={setTagText}
            />
            {tagSuggestions.length > 0 && (
              <View style={styles.tagSuggestions}>
                <Text style={[styles.tagSuggestionLabel, { color: theme.colors.textMuted }]}>
                  Quick add
                </Text>
                <View style={styles.tagSuggestionList}>
                  {tagSuggestions.map((suggestion) => (
                    <TouchableOpacity
                      key={suggestion}
                      style={styles.tagSuggestionChip}
                      onPress={() => setTagText(suggestion)}
                    >
                      <Text style={styles.tagSuggestionText}>{suggestion}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
            <View style={styles.tagActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancelTag}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveTag}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  pickerRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  pickerColumn: {
    flex: 1,
  },
  editOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  editCard: {
    borderRadius: 20,
    padding: 20,
    gap: 12,
  },
  noteCardModal: {
    borderRadius: 20,
    padding: 20,
    gap: 12,
  },
  tagCardModal: {
    borderRadius: 20,
    padding: 20,
    gap: 12,
  },
  editTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  editSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  versePreview: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
  },
  versePreviewText: {
    fontSize: 13,
    lineHeight: 18,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
  noteInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  tagInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
  tagSuggestions: {
    marginTop: 8,
    gap: 6,
  },
  tagSuggestionLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  tagSuggestionList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagSuggestionChip: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.4)',
  },
  tagSuggestionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
  },
  currentEdits: {
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.4)',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  currentEditsTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  currentEditRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentEditText: {
    fontSize: 13,
  },
  modalStrike: {
    textDecorationLine: 'line-through',
    color: '#f87171',
  },
  modalReplacement: {
    color: '#34d399',
    fontWeight: '600',
  },
  removeEdit: {
    color: '#f87171',
    fontSize: 12,
    fontWeight: '600',
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 4,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.5)',
  },
  cancelText: {
    color: '#94a3b8',
    fontWeight: '600',
  },
  saveButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: '#22d3ee',
  },
  saveText: {
    color: '#0f172a',
    fontWeight: '700',
  },
  tagActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  noteActions: {
    marginTop: 4,
    gap: 12,
  },
  noteActionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  removeButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(248, 113, 113, 0.15)',
  },
  removeButtonText: {
    color: '#f87171',
    fontWeight: '600',
    fontSize: 13,
  },
});
