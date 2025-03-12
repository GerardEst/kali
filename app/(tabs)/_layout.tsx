import { Tabs } from 'expo-router'
import React from 'react'
import { Colors } from '@/styles/colors'
import { useTranslation } from 'react-i18next'
import {
    BookmarkIcon,
    NotesIcon,
    SearchIcon,
    SettingsIcon,
} from '@/src/shared/icons'

export default function TabLayout() {
    const { t } = useTranslation()

    return (
        <Tabs
            screenOptions={{
                animation: 'none',
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 15,
                    height: 60,
                    width: '95%',
                    marginLeft: '2.5%',
                    borderRadius: 10,
                    paddingVertical: 20,
                },
                tabBarItemStyle: {
                    paddingVertical: 5,
                    borderRadius: 20,
                },
            }}
        >
            <Tabs.Screen
                name="saved-page"
                options={{
                    title: t('tabs.saved'),
                    tabBarIcon: ({ color }) => <BookmarkIcon color={color} />,
                    tabBarActiveTintColor: Colors.love,
                }}
            />
            <Tabs.Screen
                name="notes-page"
                options={{
                    title: t('tabs.notes'),
                    tabBarIcon: ({ color }) => <NotesIcon color={color} />,
                    tabBarActiveTintColor: Colors.primary,
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    title: t('tabs.search'),
                    tabBarIcon: ({ color }) => <SearchIcon color={color} />,
                    tabBarActiveTintColor: Colors.primary,
                }}
            />
            <Tabs.Screen
                name="settings-page"
                options={{
                    title: t('tabs.options'),
                    tabBarIcon: ({ color }) => <SettingsIcon color={color} />,
                    tabBarActiveTintColor: Colors.primary,
                }}
            />
        </Tabs>
    )
}
