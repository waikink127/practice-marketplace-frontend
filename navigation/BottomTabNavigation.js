import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeStack, SearchStack, UserStack, CreateProductStack, OwnedProductStack } from './MainStackNavigation';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';  
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';


const Tab = createBottomTabNavigator();


export default function BottomTabNavigation () {

    const nonMaterialStyle = {
        showLabel: false, activeTintColor: 'red', inactiveTintColor: 'black'
    }

    return (
        <Tab.Navigator initialRouteName='MainStack' tabBarOptions={nonMaterialStyle}>
            <Tab.Screen name='MainStack' component={HomeStack} options={{tabBarIcon: ({color}) => (<Ionicons name="earth-sharp" size={24} color={color} />)}} />
            <Tab.Screen name='SearchStack' component={SearchStack} options={{tabBarIcon: ({color}) => (<FontAwesome name="search" size={24} color={color} />)}} />
            <Tab.Screen name='CreateStack' component={CreateProductStack} options={{tabBarIcon: ({color}) => (<Entypo name="squared-plus" size={24} color={color} />)}} />
            <Tab.Screen name='OwnedStack' component={OwnedProductStack} options={{tabBarIcon: ({color}) => (<MaterialIcons name="storefront" size={24} color={color} />)}} />
            <Tab.Screen name='UserStack' component={UserStack} options={{tabBarIcon: ({color}) => (<Feather name="user" size={24} color={color} />)}} />
        </Tab.Navigator>
        
    )
}

// 

