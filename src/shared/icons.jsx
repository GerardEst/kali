import Octicons from '@expo/vector-icons/Octicons'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import AntDesign from '@expo/vector-icons/AntDesign'

export const BookmarkIcon = (props) => {
    return <Octicons name="bookmark" size={24} color="white" {...props} />
}

export const BookmarkSlashIcon = (props) => {
    return <Octicons name="bookmark-slash" size={24} color="white" {...props} />
}

export const NotesIcon = (props) => {
    return (
        <FontAwesome6 name="sticky-note" size={24} color="white" {...props} />
    )
}

export const OpenIcon = (props) => {
    return <AntDesign name="select1" size={24} color="white" {...props} />
}

export const SearchIcon = (props) => {
    return <AntDesign name="search1" size={24} color="white" {...props} />
}

export const SettingsIcon = (props) => {
    return <AntDesign name="setting" size={24} color="white" {...props} />
}

export const PencilIcon = (props) => {
    return <Octicons name="pencil" size={24} color="white" {...props} />
}

export const PlusIcon = (props) => {
    return <Octicons name="plus" size={24} color="white" {...props} />
}

export const CheckIcon = (props) => {
    return <Octicons name="check" size={24} color="white" {...props} />
}
