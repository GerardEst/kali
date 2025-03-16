import React from 'react'
import {
    Nutriscore_A,
    Nutriscore_B,
    Nutriscore_C,
    Nutriscore_D,
    Nutriscore_E,
} from '@/src/shared/icons/nutriscore'

interface NutriscoreProps {
    grade: 'a' | 'b' | 'c' | 'd' | 'e'
}

export const Nutriscore: React.FC<NutriscoreProps> = ({ grade }) => {
    switch (grade.toLowerCase()) {
        case 'a':
            return <Nutriscore_A />
        case 'b':
            return <Nutriscore_B />
        case 'c':
            return <Nutriscore_C />
        case 'd':
            return <Nutriscore_D />
        case 'e':
            return <Nutriscore_E />
        default:
            return null
    }
}
