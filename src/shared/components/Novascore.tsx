import React from 'react'
import {
    Novascore_1,
    Novascore_2,
    Novascore_3,
    Novascore_4,
} from '@/src/shared/icons/novascore'

interface NovascoreProps {
    grade: 1 | 2 | 3 | 4
}

export const Novascore: React.FC<NovascoreProps> = ({ grade }) => {
    switch (grade.toString()) {
        case '1':
            return <Novascore_1 />
        case '2':
            return <Novascore_2 />
        case '3':
            return <Novascore_3 />
        case '4':
            return <Novascore_4 />
        default:
            return null
    }
}
