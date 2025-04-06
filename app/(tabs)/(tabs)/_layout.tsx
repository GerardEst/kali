import { Tabs } from 'expo-router'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                animation: 'shift',
                headerShown: false,
                tabBarShowLabel: false,
            }}
        >
            <Tabs.Screen name="lists-page" />
            <Tabs.Screen name="[listId]" />
        </Tabs>
    )
}
