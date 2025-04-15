import {
    StyleSheet,
    View,
    Text,
    FlatList,
    Pressable,
    TextInput,
} from 'react-native'
import { useAuthState } from '@/src/store/authState'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Pages, Texts } from '@/styles/common'
import { useEffect, useState } from 'react'
import {
    getUserLists,
    deleteList,
    createList,
} from '@/src/api/products/lists-api'
import { useListsState } from '@/src/store/listsState'
import { useTranslation } from 'react-i18next'
import { Link } from 'expo-router'
import { CallToSubscribe } from '@/src/shared/components/callToSubscribe'
import React from 'react'
import { Palette } from '@/styles/colors'
import { TrashIcon, PlusIcon } from '@/src/shared/icons/icons'
import { GenericButton } from '@/src/shared/components/buttons/GenericButton'
import DeleteConfirmationModal from '@/src/shared/components/DeleteConfirmationModal'
import CustomModal from '@/src/shared/components/customModal'
import { List } from '@/src/shared/interfaces/List'

export default function Saved() {
    const { user } = useAuthState()
    const { userLists, setUserLists } = useListsState()
    const { t } = useTranslation()
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    const [listToDelete, setListToDelete] = useState<List | null>(null)
    const [createModalVisible, setCreateModalVisible] = useState(false)
    const [newListName, setNewListName] = useState('')

    useEffect(() => {
        const userId = user?.id
        if (!userId) return

        getUserLists(userId).then((data) => {
            console.log('userLists', data)
            setUserLists(data)
        })
    }, [user])

    const handleDeleteList = async () => {
        if (!listToDelete) return

        try {
            await deleteList(listToDelete.list_id)

            // Update local state
            setUserLists(
                userLists.filter(
                    (list: List) => list.list_id !== listToDelete.list_id
                )
            )

            // Close modal
            setDeleteModalVisible(false)
            setListToDelete(null)
        } catch (error) {
            console.error('Error deleting list:', error)
        }
    }

    const openDeleteConfirmation = (list: List) => {
        // Check if this is the favs list - favs list should not be deletable
        if (list.list_name.toLowerCase() === 'favs') {
            // Do not allow deletion of favs list
            return
        }

        setListToDelete(list)
        setDeleteModalVisible(true)
    }

    const handleCreateList = async () => {
        if (!newListName.trim() || !user) return

        try {
            const newList = await createList(newListName, user.id)
            setUserLists([...userLists, newList])
            setCreateModalVisible(false)
            setNewListName('')
        } catch (error) {
            console.error('Error creating list:', error)
        }
    }

    const renderListItem = ({ item }: { item: List }) => {
        const isFavsList = item.list_name.toLowerCase() === 'favs'

        return (
            <View style={styles.listItemContainer}>
                <Link style={styles.listItem} asChild href={`/${item.list_id}`}>
                    <Pressable>
                        <Text style={Texts.regular}>{item.list_name}</Text>
                    </Pressable>
                </Link>
                {!isFavsList && (
                    <GenericButton
                        icon={<TrashIcon size={20} />}
                        noBorder
                        fill={false}
                        action={() => openDeleteConfirmation(item)}
                    />
                )}
            </View>
        )
    }

    return (
        <SafeAreaView style={Pages}>
            {user ? (
                <>
                    <View style={styles.headerContainer}>
                        <Text style={Texts.title}>{t('lists_title')}</Text>
                        <GenericButton
                            icon={<PlusIcon size={20} />}
                            action={() => setCreateModalVisible(true)}
                        />
                    </View>
                    <View style={styles.savedList}>
                        <FlatList
                            data={userLists}
                            keyExtractor={(list) => list.list_id}
                            renderItem={renderListItem}
                            ListEmptyComponent={
                                <Text>{t('saved_emptyState')}</Text>
                            }
                        />
                    </View>

                    <DeleteConfirmationModal
                        visible={deleteModalVisible}
                        onClose={() => {
                            setDeleteModalVisible(false)
                            setListToDelete(null)
                        }}
                        onConfirm={handleDeleteList}
                        title={t('lists_delete_confirmation')}
                        confirmText={t('lists_delete_confirm')}
                        cancelText={t('lists_delete_cancel')}
                    />

                    <CustomModal
                        visible={createModalVisible}
                        onClose={() => {
                            setCreateModalVisible(false)
                            setNewListName('')
                        }}
                    >
                        <View style={styles.createModalContainer}>
                            <Text style={Texts.title}>{t('lists_create')}</Text>
                            <TextInput
                                style={styles.textInput}
                                value={newListName}
                                onChangeText={setNewListName}
                                placeholder={t('lists_create_placeholder')}
                                autoFocus
                            />
                            <View style={styles.modalButtons}>
                                <GenericButton
                                    text={t('lists_delete_cancel')}
                                    action={() => {
                                        setCreateModalVisible(false)
                                        setNewListName('')
                                    }}
                                />
                                <GenericButton
                                    text={t('lists_new_save')}
                                    icon={<PlusIcon size={20} />}
                                    action={handleCreateList}
                                />
                            </View>
                        </View>
                    </CustomModal>
                </>
            ) : (
                <CallToSubscribe />
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    savedList: {
        marginTop: 30,
        paddingBottom: 85,
    },
    listItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    listItem: {
        padding: 20,
        backgroundColor: Palette.background,
        borderRadius: 10,
        flex: 1,
    },
    createModalContainer: {
        padding: 16,
        borderRadius: 10,
    },
    textInput: {
        marginTop: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 12,
        backgroundColor: '#fff',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
})
