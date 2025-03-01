import { Note } from './Note'
import { Opinion } from './Opinion'

export interface Product {
    barcode: string
    name?: string
    barcode_type?: string
    image_url?: string
    opinions?: Opinion[]
    userOpinion?: Opinion
    userNotes?: Note[]
    isFav?: Boolean
}
