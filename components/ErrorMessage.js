import React, {useEffect} from 'react'
import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';

export default function ErrorMessage(props) {
    const {error, navigation} = props;
    useEffect(() => {
         Alert.alert('Fail', error, [{title: 'OK', style: 'cancel'}]);
    },[])
    
    return (
        <View style={styles.screen}>
            <View style={styles.imageContainer}>
            <Image title='Error' source={require('../assets/icons/error.png')} style={{width: 40, height: 40}} />
            </View>
            <View style={styles.buttonContainer}>
            <Button icon='reload' onPress={props.retry} color='grey'>Retry</Button>
            <Button icon='step-backward' onPress={() => navigation.goBack()} color='grey'>Go Back</Button>
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
