import { Tabs } from 'expo-router'
import React from 'react'
import { Platform } from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign'

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: Platform.select({
                    ios: {
                        // Use a transparent background on iOS to show the blur effect
                        position: 'absolute',
                    },
                    default: {},
                }),
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => (
                        <AntDesign name="home" size={24} color="black" />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => (
                        <AntDesign size={24} name="user" color={color} />
                    ),
                }}
            />
        </Tabs>
    )
}
