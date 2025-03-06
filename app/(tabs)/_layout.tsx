import { Tabs } from 'expo-router'
import React from 'react'
import AntDesign from '@expo/vector-icons/AntDesign'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import { Colors } from '@/styles/colors'
import { useTranslation } from 'react-i18next'
import Octicons from '@expo/vector-icons/Octicons'

export default function TabLayout() {
    const { t } = useTranslation()

    return (
        <Tabs
            screenOptions={{
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
                    tabBarIcon: ({ color }) => (
                        <Octicons name="bookmark" size={24} color={color} />
                    ),
                    tabBarActiveTintColor: Colors.love,
                }}
            />
            <Tabs.Screen
                name="notes-page"
                options={{
                    title: t('tabs.notes'),
                    tabBarIcon: ({ color }) => (
                        <FontAwesome6
                            name="sticky-note"
                            size={24}
                            color={color}
                        />
                    ),
                    tabBarActiveTintColor: Colors.primary,
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    title: t('tabs.search'),
                    tabBarIcon: ({ color }) => (
                        <AntDesign name="search1" size={24} color={color} />
                    ),
                    tabBarActiveTintColor: Colors.primary,
                }}
            />
            <Tabs.Screen
                name="settings-page"
                options={{
                    title: t('tabs.options'),
                    tabBarIcon: ({ color }) => (
                        <AntDesign size={24} name="setting" color={color} />
                    ),
                    tabBarActiveTintColor: Colors.primary,
                }}
            />
        </Tabs>
    )
}
