import { Tabs } from 'expo-router'
import React from 'react'
import AntDesign from '@expo/vector-icons/AntDesign'
import { Colors } from '@/constants/colors'

export default function TabLayout() {
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
                name="saved"
                options={{
                    title: 'Guardats',
                    tabBarIcon: ({ color }) => (
                        <AntDesign name="heart" size={24} color={color} />
                    ),
                    tabBarActiveTintColor: Colors.love,
                }}
            />
            <Tabs.Screen
                name="opinions"
                options={{
                    title: 'Opinions',
                    tabBarIcon: ({ color }) => (
                        <AntDesign name="like1" size={24} color={color} />
                    ),
                    tabBarActiveTintColor: Colors.primary,
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Buscador',
                    tabBarIcon: ({ color }) => (
                        <AntDesign name="search1" size={24} color={color} />
                    ),
                    tabBarActiveTintColor: Colors.primary,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Opcions',
                    tabBarIcon: ({ color }) => (
                        <AntDesign size={24} name="setting" color={color} />
                    ),
                    tabBarActiveTintColor: Colors.primary,
                }}
            />
        </Tabs>
    )
}
