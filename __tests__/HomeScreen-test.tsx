import { render } from '@testing-library/react-native'

import HomeScreen from '@/app/(tabs)/index'

describe('<HomeScreen />', () => {
    test('asdasd', () => {
        const { getByText } = render(<HomeScreen />)

        getByText('Welcome!')
    })
})
