import Octicons from '@expo/vector-icons/Octicons'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import AntDesign from '@expo/vector-icons/AntDesign'

export const BookmarkIcon = (props: any) => {
    return <Octicons name="bookmark" size={24} color="white" {...props} />
}

export const BookmarkSlashIcon = (props: any) => {
    return <Octicons name="bookmark-slash" size={24} color="white" {...props} />
}

export const NotesIcon = (props: any) => {
    return (
        <FontAwesome6 name="sticky-note" size={24} color="white" {...props} />
    )
}

export const OpenIcon = (props: any) => {
    return <AntDesign name="select1" size={24} color="white" {...props} />
}

export const SearchIcon = (props: any) => {
    return <AntDesign name="search1" size={24} color="white" {...props} />
}

export const SettingsIcon = (props: any) => {
    return <AntDesign name="setting" size={24} color="white" {...props} />
}

export const PencilIcon = (props: any) => {
    return <Octicons name="pencil" size={24} color="white" {...props} />
}

export const PlusIcon = (props: any) => {
    return <Octicons name="plus" size={24} color="white" {...props} />
}

export const CheckIcon = (props: any) => {
    return <Octicons name="check" size={24} color="white" {...props} />
}
