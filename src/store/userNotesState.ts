import { create } from 'zustand'
import { Note } from '../shared/interfaces/Note'

interface UserNotesState {
    notes: Note[]
    setUserNotes: (notes: Note[]) => void
    updateUserNoteFromNotesList: (note: Note) => void
}

export const useUserNotesState = create<UserNotesState>((set) => ({
    notes: [],

    setUserNotes: (notes: Note[]) => {
        set(() => {
            return {
                notes: notes,
            }
        })
    },

    updateUserNoteFromNotesList: (note: Note) => {
        set((state) => {
            const previousNoteRemoved = state.notes.filter(
                (previousNote) => previousNote.product !== note.product
            )

            return {
                notes: [note, ...previousNoteRemoved],
            }
        })
    },
}))
