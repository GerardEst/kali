import { create } from 'zustand'

// TODO - De moment serveix només pels favs, quan tingui llistes adaptar-ho
export const useListsState = create<any>((set) => ({
    favs: [],

    setUserFavs: (favs: any) => {
        set(() => {
            return { favs: favs }
        })
    },
}))
