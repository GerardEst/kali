import React, { useEffect, useRef } from 'react'
import { TextInput } from 'react-native'

/**
 * TextInput component that automatically focuses after a delay
 * Useful for inputs inside modals where standard autoFocus doesn't work properly
 */
export default function TextInputWithFocus(
    props: React.ComponentProps<typeof TextInput>
) {
    const inputRef = useRef<TextInput>(null)

    useEffect(() => {
        // Delay focus to ensure modal animation is complete
        const timer = setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus()
            }
        }, 550) // Slightly longer than modal animation duration

        return () => clearTimeout(timer)
    }, [])

    return <TextInput ref={inputRef} {...props} />
}
