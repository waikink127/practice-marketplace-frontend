import React, {useEffect} from 'react'
import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';

export default function UnAuth(props) {
    const { navigation} = props;
    
    return (
        <View style={styles.screen}>
            <View style={styles.buttonContainer}>
            <Button icon='step-forward' onPress={() => navigation.navigate('UserStack')} color='grey'>LOGIN / REGISTER</Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screen:{
        flex:1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'white'
    }, 
    message:{
        color: 'grey',
        fontSize: 16, 
    }, 
    imageContainer:{
        marginBottom: 15
    }
})
