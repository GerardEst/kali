import { Opinion } from "./Opinion"

export interface Product {
    barcode: number,
    name?: string,
    opinions?: Opinion[],
    userOpinion?: Opinion,
}