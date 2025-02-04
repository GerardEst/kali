import { StyleSheet, View, Text, FlatList } from 'react-native'
import { useAuthState } from '@/hooks/authState'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Texts } from '@/constants/texts'
import { Pages } from '@/styles/common'
import { useEffect, useState } from 'react'
import { getAllOpinionsByUser } from '@/api/products'
import GoogleSign from '@/components/auth/signInButton'
import { useUserOpinionsState } from '@/hooks/userOpinionsState'
import { Opinion } from '@/interfaces/Opinion'
import { UserOpinion } from '@/components/UserOpinion'

export default function Favs() {
    const { user } = useAuthState()
    const { opinions, setUserOpinions } = useUserOpinionsState()

    useEffect(() => {
        const userId = user?.id
        if (!userId) return

        getAllOpinionsByUser(userId).then((data) => {
            console.log(data)
            setUserOpinions(data)
        })
    }, [user])

    return (
        <SafeAreaView style={Pages}>
            <Text style={Texts.title}>Tus opiniones</Text>

            {user ? (
                <View style={styles.opinionsList}>
                    <FlatList
                        data={opinions}
                        keyExtractor={(opinion) => opinion.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.userOpinion}>
                                <UserOpinion
                                    productBarcode="null"
                                    opinion={item}
                                ></UserOpinion>
                            </View>
                        )}
                        ListEmptyComponent={
                            <Text>
                                Aún no hay ninguna valoración para este
                                producto. Sé el primero!
                            </Text>
                        }
                    />
                </View>
            ) : (
                <View>
                    <Text>Registrate</Text>
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
