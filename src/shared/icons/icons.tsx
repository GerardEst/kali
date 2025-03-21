import Octicons from '@expo/vector-icons/Octicons'
import AntDesign from '@expo/vector-icons/AntDesign'
import { Palette } from '@/styles/colors'

export const BookmarkIcon = (props: any) => {
    return (
        <Octicons
            name="bookmark"
            size={24}
            color={Palette.primary}
            {...props}
        />
    )
}

export const BookmarkSlashIcon = (props: any) => {
    return (
        <Octicons
            name="bookmark-slash"
            size={24}
            color={Palette.primary}
            {...props}
        />
    )
}
export const NotesIcon = (props: any) => {
    return (
        <Octicons name="report" size={24} color={Palette.primary} {...props} />
    )
}

export const OpenIcon = (props: any) => {
    return (
        <AntDesign
            name="select1"
            size={24}
            color={Palette.primary}
            {...props}
        />
    )
}

export const SearchIcon = (props: any) => {
    return (
        <Octicons name="search" size={24} color={Palette.primary} {...props} />
    )
}

export const SettingsIcon = (props: any) => {
    return <Octicons name="gear" size={24} color={Palette.primary} {...props} />
}

export const PencilIcon = (props: any) => {
    return (
        <Octicons name="pencil" size={24} color={Palette.primary} {...props} />
    )
}

export const PlusIcon = (props: any) => {
    return <Octicons name="plus" size={24} color={Palette.primary} {...props} />
}

export const CheckIcon = (props: any) => {
    return (
        <Octicons name="check" size={24} color={Palette.primary} {...props} />
    )
}
