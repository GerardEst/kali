import { useState } from 'react'
import { checkTimes } from '../scanParameters'
import { Code } from 'react-native-vision-camera'

export const useScan = () => {
    const [lastScan, setLastScan] = useState('')
    const [checkCode, setCheckCode] = useState<string>('')
    const [timesChecked, setTimesChecked] = useState<number>(0)

    function scan(code: Code) {
        if (!code.value) return

        const scannedCode = code.value

        if (!scannedCode) return

        // Check to prevent repeated codes
        if (scannedCode === lastScan) return

        // Multiple check to prevent bad codes
        if (scannedCode === checkCode) {
            setTimesChecked(timesChecked + 1)
        } else {
            setCheckCode(scannedCode)
            setTimesChecked(0)
        }
        if (timesChecked <= checkTimes) return

        // Finally accept the scanned code
        setTimesChecked(0)
        setLastScan(scannedCode)

        return code
    }

    return { scan }
}
