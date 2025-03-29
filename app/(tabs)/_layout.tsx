import { Tabs } from 'expo-router'
import React from 'react'
import { Palette } from '@/styles/colors'
import { useTranslation } from 'react-i18next'
import {
    BookmarkIcon,
    CommentIcon,
    ReviewIcon,
    SearchIcon,
    SettingsIcon,
} from '@/src/shared/icons/icons'

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
                tabBarLabelStyle: {
                    fontSize: 9,
                    fontFamily: 'Sora-Medium',
                },
                tabBarInactiveTintColor: Palette.primary,
            }}
        >
            <Tabs.Screen
                name="saved-page"
                options={{
                    title: t('tabs_saved'),
                    tabBarActiveTintColor: Palette.accent,
                    tabBarIcon: ({ focused, color }) => (
                        <BookmarkIcon
                            size={22}
                            color={focused ? color : Palette.primary}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="reviews-page"
                options={{
                    title: t('tabs_reviews'),
                    tabBarActiveTintColor: Palette.accent,
                    tabBarIcon: ({ focused, color }) => (
                        <CommentIcon
                            size={20}
                            color={focused ? color : Palette.primary}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    title: t('tabs_search'),
                    tabBarActiveTintColor: Palette.accent,
                    tabBarIcon: ({ focused, color }) => (
                        <SearchIcon
                            size={22}
                            color={focused ? color : Palette.primary}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings-page"
                options={{
                    title: t('tabs_options'),
                    tabBarActiveTintColor: Palette.accent,
                    tabBarIcon: ({ focused, color }) => (
                        <SettingsIcon
                            size={20}
                            color={focused ? color : Palette.primary}
                        />
                    ),
                }}
            />
        </Tabs>
    )
}
