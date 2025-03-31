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
export const ReviewIcon = (props: any) => {
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

export const PeopleIcon = (props: any) => {
    return (
        <Octicons name="people" size={24} color={Palette.primary} {...props} />
    )
}

export const CommentIcon = (props: any) => {
    return (
        <Octicons name="comment" size={24} color={Palette.primary} {...props} />
    )
}

export const CommentDiscussionIcon = (props: any) => {
    return (
        <Octicons
            name="comment-discussion"
            size={24}
            color={Palette.primary}
            {...props}
        />
    )
}

export const ChevronDownIcon = (props: any) => {
    return (
        <Octicons
            name="chevron-down"
            size={24}
            color={Palette.primary}
            {...props}
        />
    )
}

export const TrashIcon = (props: any) => {
    return (
        <Octicons name="trash" size={24} color={Palette.primary} {...props} />
    )
}

export const CloseIcon = (props: any) => {
    return <Octicons name="x" size={24} color={Palette.primary} {...props} />
}

export const LockIcon = (props: any) => {
    return <Octicons name="lock" size={24} color={Palette.primary} {...props} />
}

export const InfoIcon = (props: any) => {
    return <Octicons name="info" size={24} color={Palette.primary} {...props} />
}

export const BackIcon = (props: any) => {
    return (
        <Octicons
            name="arrow-left"
            size={24}
            color={Palette.primary}
            {...props}
        />
    )
}
