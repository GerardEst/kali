import { CodeType } from 'react-native-vision-camera'

// Increasing it ads checks to the barcode to prevent bad lectures
export const checkTimes = 4

export const supportedBarcodeTypes: CodeType[] = [
    'ean-13',
    'ean-8',
    'upc-e',
    //'aztec',
    'qr',
    //'codabar',
    'code-128',
    'code-39',
    'code-93',
    //'data-matrix',
    //'itf',
    //'pdf-417',
    'upc-a',
]
