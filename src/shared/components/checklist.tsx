import { View, StyleSheet, Touchable, Pressable } from 'react-native'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import Text from './Typography'

export const Checklist = ({
    text,
    checked,
    onPress,
}: {
    text: string
    checked: boolean
    onPress: () => void
}) => {
    return (
        <Pressable style={styles.listItem} onPress={onPress}>
            <Text>{text}</Text>
            <BouncyCheckbox isChecked={checked} />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    listItem: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
})
