import { create } from 'zustand'
import { Opinion } from '@/src/shared/interfaces/Opinion'

export const useUserOpinionsState = create<any>((set) => ({
    opinions: [],

    setUserOpinions: (opinions: Opinion[]) => {
        set(() => {
            return {
                opinions: opinions,
            }
        })
    },
}))
