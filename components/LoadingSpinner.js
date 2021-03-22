import React from 'react'
import { StyleSheet, View } from 'react-native'
import { ActivityIndicator, Colors } from 'react-native-paper';

export default function LoadingSpinner() {
    return (
        <View style={styles.screen}>
            <ActivityIndicator animating={true} color={Colors.red800} />
        </View>
    )
}

const styles = StyleSheet.create({
    screen:{
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'white'
    }
})
