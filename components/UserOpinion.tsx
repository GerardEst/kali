import { View, Text, StyleSheet, FlatList } from 'react-native'
import { Texts } from '@/constants/texts'
import { Sentiments } from '@/constants/sentiments'
import { GenericButton } from './GenericButton'
import { Colors, SentimentColors } from '@/constants/colors'
import { Opinion } from '@/interfaces/Opinion'

interface UserOpinionComponent {
    title?: string
    productBarcode: string
    opinion: Opinion
    onUpdateUserOpinion?: (barcode: string) => void
}

export const UserOpinion = ({
    title,
    productBarcode,
    opinion,
    onUpdateUserOpinion,
}: UserOpinionComponent) => {
    return (
        <View style={styles.userOpinion}>
            <View>
                <View>
                    {title && <Text style={Texts.smallTitle}>{title}</Text>}
                    <Text>{opinion.opinion}</Text>
                </View>
                <View
                    style={[
                        styles.sentiment,
                        {
                            backgroundColor: SentimentColors[opinion.sentiment],
                            borderColor: SentimentColors[opinion.sentiment],
                        },
                    ]}
                >
                    <Text style={styles.sentimentEmoji}>
                        {Sentiments[opinion.sentiment]}
                    </Text>
                </View>
            </View>
            {onUpdateUserOpinion && (
                <GenericButton
                    style={styles.modifyButton}
                    text="Modificar"
                    icon="pencil"
                    action={() => onUpdateUserOpinion?.(productBarcode)}
                ></GenericButton>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    userOpinion: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: Colors.background,
        gap: 15,
    },
    modifyButton: {
        alignSelf: 'flex-end',
    },
    sentiment: {
        position: 'absolute',
        right: 0,
        top: -20,
        transform: 'rotate(20deg)',
        width: 45,
        height: 45,
        display: 'flex',
        justifyContent: 'center',
        borderRadius: '100%',
        boxShadow: '2px 2px 15px #00000066',
        borderWidth: 1,
    },
    sentimentEmoji: {
        fontSize: 20,
        textAlign: 'center',
    },
})
