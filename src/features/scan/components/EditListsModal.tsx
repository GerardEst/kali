import { FlatList, StyleSheet, TextInput, View } from 'react-native'
import Text from '@/src/shared/components/Typography'
import { useEffect, useState } from 'react'
import React from 'react'
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
import { useTranslation } from 'react-i18next'
import { Checklist } from '@/src/shared/components/checklist'
import TextInputWithFocus from '@/src/shared/components/TextInputWithFocus'
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
        if (!product || !visible) return

        // Get the user lists and check if the product is inside some of the lists
        async function getLists() {
            const userLists = await getUserLists(user!.id)
            setUserLists(userLists)

            const userListsWithProdcut = await getProductLists(
                product,
                user!.id
            )

            console.log('userListsWithProdcut', userListsWithProdcut)
            setSelectedLists(userListsWithProdcut)
        }

        getLists()
    }, [visible])

    const saveList = async () => {
        if (listName.length === 0) {
            return
        }
        const newList = await createList(listName, user!.id)

        setUserLists([...userLists, newList])
        setIsCreatingList(false)
    }

    const onPressItem = async (item: List) => {
        console.log('onPressItem', item)
        if (selectedLists.some((list) => list.list_id === item.list_id)) {
            setSelectedLists(
                selectedLists.filter((list) => list.list_id !== item.list_id)
            )
            await removeProductFromList(item.list_id, product)
        } else {
            setSelectedLists([...selectedLists, item])
            await addProductToList(item.list_id, product)
        }
    }

    return (
        <CustomModal visible={visible} onClose={onClose}>
            <View style={styles.listsContainer}>
                <Text style={Texts.title}>{t('lists_edit_title')}</Text>
                <FlatList
                    data={userLists}
                    keyExtractor={(item) => item.list_id.toString()}
                    style={styles.lists}
                    renderItem={({ item }) => (
                        <Checklist
                            text={item.list_name}
                            checked={selectedLists.some(
                                (list) => list.list_id === item.list_id
                            )}
                            onPress={() => onPressItem(item)}
                        />
                    )}
                />

                {isCreatingList && (
                    <TextInputWithFocus
                        value={listName}
                        onChangeText={setListName}
                        style={styles.textInput}
                        placeholder={t('lists_create_placeholder')}
                    />
                )}

                <View style={styles.buttonsContainer}>
                    {isCreatingList && (
                        <>
                            <GenericButton
                                text={t('lists_stop_creating')}
                                action={() => {
                                    setIsCreatingList(false)
                                    setListName('')
                                }}
                            />
                            <GenericButton
                                text={t('lists_new_save')}
                                action={() => saveList()}
                                icon={<PlusIcon />}
                            />
                        </>
                    )}
                    {!isCreatingList && (
                        <>
                            <GenericButton
                                text={t('lists_create')}
                                action={() => setIsCreatingList(true)}
                                icon={<PlusIcon />}
                            />
                            <GenericButton
                                text={t('lists_save')}
                                action={() => onClose()}
                                icon={<CheckIcon />}
                            />
                        </>
                    )}
                </View>
            </View>
        </CustomModal>
    )
}

const styles = StyleSheet.create({
    listsContainer: {
        padding: 16,
        borderRadius: 10,
    },
    lists: {
        marginTop: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        paddingBottom: 20,
    },
    buttonsContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'space-between',
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
})
