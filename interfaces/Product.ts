import { Opinion } from "./Opinion"

export interface Product {
    barcode: string,
    name?: string,
    opinions?: Opinion[],
    userOpinion?: Opinion,
}