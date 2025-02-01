import { View, Text, StyleSheet, FlatList } from 'react-native'
import { Texts } from '@/constants/texts'
import { Sentiments } from '@/constants/reactions'
import { GenericButton } from './GenericButton'
import { Colors } from '@/constants/colors'
import { Opinion } from '@/interfaces/Opinion'

interface UserOpinionComponent {
    productBarcode: string
    opinion: Opinion
    onUpdateUserOpinion: (barcode: string) => void
}

export const UserOpinion = ({
    productBarcode,
    opinion,
    onUpdateUserOpinion,
}: UserOpinionComponent) => {
    return (
        <View style={styles.userOpinion}>
            <View style={styles.opinion}>
                <Text style={Texts.smallTitle}>Tu opinión</Text>
                <Text>{opinion.opinion}</Text>
                <Text>{Sentiments[opinion.sentiment]}</Text>
            </View>
            <GenericButton
                text="Modificar"
                icon="pencil"
                action={() => onUpdateUserOpinion(productBarcode)}
            ></GenericButton>
        </View>
    )
}

const styles = StyleSheet.create({
    userOpinion: {
        flexDirection: 'row',
        padding: 15,
        borderRadius: 10,
        backgroundColor: Colors.background,
    },
    opinion: {
        flex: 1,
    },
})
