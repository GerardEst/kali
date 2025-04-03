import { FlatList, StyleSheet, View } from 'react-native'
import Text from '@/src/shared/components/Typography'
import { useEffect, useState } from 'react'
import { getUserLists } from '@/src/api/products/lists-api'
import { useAuthState } from '@/src/store/authState'
import { List } from '@/src/shared/interfaces/List'
import CustomModal from '@/src/shared/components/customModal'
import { Texts } from '@/styles/common'

export default function EditListsModal({
    visible,
    product,
    onClose,
}: {
    visible: boolean
    product: string
    onClose: () => void
}) {
    const { user } = useAuthState()
    const [userLists, setUserLists] = useState<List[]>([])

    useEffect(() => {
        // Get the user lists and check if the product is inside some of the lists
        async function getLists() {
            const userLists = await getUserLists(user!.id)
            setUserLists(userLists)
        }

        console.log('product', product)
        console.log('lists', userLists)

        getLists()
    }, [])

    return (
        <CustomModal visible={visible} onClose={onClose}>
            <View style={styles.listsContainer}>
                <Text style={Texts.title}>Edit Lists</Text>
                <FlatList
                    data={userLists}
                    renderItem={({ item }) => (
                        <View>
                            <Text>{item.name}</Text>
                        </View>
                    )}
                />
            </View>
        </CustomModal>
    )
}

const styles = StyleSheet.create({
    listsContainer: {
        padding: 16,
        borderRadius: 10,
    },
})
