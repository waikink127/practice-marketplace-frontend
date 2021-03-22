import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import HomeScreen from '../screens/HomeScreen';
import UserScreen from '../screens/UserScreen';
import SearchScreen from '../screens/SearchScreen';
import CreateProductScreen from '../screens/CreateProductScreen';
import OwnedProductScreen from '../screens/OwnedProductScreen';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import EditUserScreen from '../screens/EditUserScreen';
import EditProfilePicScreen from '../screens/EditProfilePicScreen';
import EditProductScreen from '../screens/EditProductScreen';

const Stack = createStackNavigator();

const globalHeaderConfig = {
    headerBackTitleVisible: false
}

export function HomeStack(props) {
    return (
        <Stack.Navigator initialRouteName='Home' screenOptions={globalHeaderConfig}>
            <Stack.Screen name='Home' component={HomeScreen} />
            <Stack.Screen name='ProductList' component={ProductListScreen} />
            <Stack.Screen name='ProductDetails' component={ProductDetailsScreen} />

        </Stack.Navigator>
    )
}

export function UserStack(props) {
    return (
        <Stack.Navigator initialRouteName='User' screenOptions={globalHeaderConfig}>
            <Stack.Screen name='User' component={UserScreen} options={{headerLeft: null}}  />
            <Stack.Screen name='EditUser' component={EditUserScreen} options={{title: 'Edit'}} />
            <Stack.Screen name='EditProfilePic' component={EditProfilePicScreen} options={{title: "Profile Picture"}} /> 
        </Stack.Navigator>
    )
}

export function SearchStack(props) {
    return (
        <Stack.Navigator initialRouteName='Search' screenOptions={globalHeaderConfig}>
            <Stack.Screen name='Search' component={SearchScreen} options={{headerShown: false}} />
            <Stack.Screen name='SearchProductsDetails' component={ProductDetailsScreen} />
        </Stack.Navigator>
    )
}

export function OwnedProductStack(props){
    return(
        <Stack.Navigator initialRouteName='Owned' screenOptions={globalHeaderConfig}>
            <Stack.Screen name='Owned' component={OwnedProductScreen} options={{title: 'My Products'}} />
            <Stack.Screen name='MyProductsDetails' component={ProductDetailsScreen} />
            <Stack.Screen name='EditProduct' component={EditProductScreen} />
        </Stack.Navigator>
    );
}

export function CreateProductStack(props){
    return(
        <Stack.Navigator initialRouteName='Create' screenOptions={globalHeaderConfig}>
            <Stack.Screen name='Create' component={EditProductScreen} />
        </Stack.Navigator>
    );
}
