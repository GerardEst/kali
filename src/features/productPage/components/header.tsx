import { GenericButton } from '@/src/shared/components/buttons/GenericButton'
import { BackIcon, PencilIcon } from '@/src/shared/icons/icons'
import { Palette } from '@/styles/colors'
import { router } from 'expo-router'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Product } from '@/src/shared/interfaces/Product'
import { Texts } from '@/styles/common'
interface HeaderProps {
    product: Product
    canEdit: boolean | undefined
    setInfoModalVisible: (visible: boolean) => void
}

export const Header = ({
    product,
    canEdit,
    setInfoModalVisible,
}: HeaderProps) => {
    return (
        <View style={styles.header}>
            <Pressable onPress={() => router.back()}>
                <GenericButton
                    icon={<BackIcon size={20} color={Palette.primary} />}
                    noBorder
                    nonPressable={true}
                />
            </Pressable>
            <Text style={Texts.title} numberOfLines={2}>
                {product?.name || product?.barcode || '...'}
            </Text>
            {canEdit && (
                <GenericButton
                    style={styles.editButton}
                    action={() => setInfoModalVisible(true)}
                    icon={<PencilIcon size={20} color={Palette.primary} />}
                    noBorder
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingRight: 25,
        paddingVertical: 10,
    },
    editButton: {
        marginLeft: 'auto',
    },
})
