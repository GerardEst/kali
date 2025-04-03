import { FlatList, StyleSheet, TextInput, View } from 'react-native'
import Text from '@/src/shared/components/Typography'
import { useEffect, useState } from 'react'
import {
    addProductToList,
    createList,
    getProductLists,
    getUserLists,
    removeProductFromList,
} from '@/src/api/products/lists-api'
import { useAuthState } from '@/src/store/authState'
import { List } from '@/src/shared/interfaces/List'
import CustomModal from '@/src/shared/components/customModal'
import { Texts } from '@/styles/common'
import { GenericButton } from '@/src/shared/components/buttons/GenericButton'
import { PlusIcon, CheckIcon } from '@/src/shared/icons/icons'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import { useTranslation } from 'react-i18next'

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
    const [isCreatingList, setIsCreatingList] = useState(false)
    const [listName, setListName] = useState('')
    const { t } = useTranslation()
    const [selectedLists, setSelectedLists] = useState<List[]>([])

    useEffect(() => {
        // Get the user lists and check if the product is inside some of the lists
        async function getLists() {
            const userLists = await getUserLists(user!.id)
            setUserLists(userLists)

            // Tinc les llistes, pero nomes el nom i l'id
            // Tinc el producte, pero no a quines llistes pertany
            // Potser hauria de pillar les llistes del producte quan s'obre aixo
            // No avera pude no, segur clar

            const userListsWithProdcut = await getProductLists(
                product,
                user!.id
            )

            console.log('userListsWithProdcut', userListsWithProdcut)
            setSelectedLists(userListsWithProdcut)
        }

        getLists()
    }, [])

    const saveList = async () => {
        if (listName.length === 0) {
            return
        }

        const newList = await createList(listName, user!.id)

        setUserLists([...userLists, newList])
        setIsCreatingList(false)
    }

    return (
        <CustomModal visible={visible} onClose={onClose}>
            <View style={styles.listsContainer}>
                <Text style={Texts.title}>Edit Lists</Text>
                <FlatList
                    data={userLists}
                    renderItem={({ item }) => (
                        <View style={styles.listItem}>
                            <Text>{item.list_name}</Text>
                            <BouncyCheckbox
                                isChecked={selectedLists.some(
                                    (list) => list.list_id === item.list_id
                                )}
                                onPress={async () => {
                                    if (
                                        selectedLists.some(
                                            (list) =>
                                                list.list_id === item.list_id
                                        )
                                    ) {
                                        setSelectedLists(
                                            selectedLists.filter(
                                                (list) =>
                                                    list.list_id !==
                                                    item.list_id
                                            )
                                        )
                                        await removeProductFromList(
                                            item.list_id,
                                            product
                                        )
                                    } else {
                                        setSelectedLists([
                                            ...selectedLists,
                                            item,
                                        ])
                                        await addProductToList(
                                            item.list_id,
                                            product
                                        )
                                    }
                                }}
                            />
                        </View>
                    )}
                />
                {isCreatingList && (
                    <View>
                        <TextInput
                            value={listName}
                            onChangeText={setListName}
                        />
                        <GenericButton
                            text={t('lists_new_save')}
                            action={() => saveList()}
                            icon={<PlusIcon />}
                        />
                    </View>
                )}
                {!isCreatingList && (
                    <GenericButton
                        text={t('lists_create')}
                        action={() => setIsCreatingList(true)}
                        icon={<PlusIcon />}
                    />
                )}
                <GenericButton
                    text={t('lists_save')}
                    action={() => onClose()}
                    icon={<CheckIcon />}
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
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
})
