import { StyleSheet, View, Text, FlatList } from 'react-native'
import { useAuthState } from '@/hooks/authState'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Texts } from '@/constants/texts'
import { Pages } from '@/styles/common'
import { useEffect } from 'react'
import { getAllOpinionsByUser } from '@/apis/products/products-api'
import GoogleSign from '@/components/auth/signInButton'
import { useUserOpinionsState } from '@/hooks/userOpinionsState'
import { UserOpinion } from '@/components/UserOpinion'

export default function Opinions() {
    const { user } = useAuthState()
    const { opinions, setUserOpinions } = useUserOpinionsState()

    useEffect(() => {
        const userId = user?.id
        if (!userId) return

        getAllOpinionsByUser(userId).then((data) => {
            setUserOpinions(data)
        })
    }, [user])

    return (
        <SafeAreaView style={Pages}>
            <Text style={Texts.title}>Les teves opinions</Text>

            {user ? (
                <View style={styles.opinionsList}>
                    <FlatList
                        data={opinions}
                        keyExtractor={(opinion) => opinion.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.userOpinion}>
                                <UserOpinion
                                    title={item.products.name}
                                    productBarcode="null"
                                    opinion={item}
                                ></UserOpinion>
                            </View>
                        )}
                        ListEmptyComponent={
                            <Text>
                                Encara no has valorat cap producte. A què
                                esperes?
                            </Text>
                        }
                    />
                </View>
            ) : (
                <View>
                    <GoogleSign></GoogleSign>
                </View>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    opinionsList: {
        marginTop: 20,
        paddingBottom: 85,
    },
    userOpinion: {
        marginTop: 15,
    },
})
