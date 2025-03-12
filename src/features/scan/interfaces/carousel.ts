import { Product } from '@/src/shared/interfaces/Product'

export interface CustomElement {
    isLastItem: boolean
    element: React.ReactNode
}

export type CarouselItem = Product | CustomElement
