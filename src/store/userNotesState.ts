import { create } from 'zustand'
import { Note } from '../shared/interfaces/Note'

interface UserNotesState {
    notes: Note[]
    setUserNotes: (notes: Note[]) => void
    addUserNote: (note: Note) => void
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

    addUserNote: (note: Note) => {
        set((state) => ({
            notes: [note, ...state.notes],
        }))
    },
}))
