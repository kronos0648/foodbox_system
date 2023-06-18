import React from "react";
import {StyleSheet, Text, TouchableOpacity, Dimensions, Image} from 'react-native';
import colors from "../config/colors";

export default function StoreListItem({item, navigation, }){

    const onItemPresss = () => {
        navigation.navigate('OrderRequest', {store : item})
    }

    return(
        <TouchableOpacity style = {styles.mainContainer} onPress = {onItemPresss} >
            <Image style = {styles.image} source = { require('../assets/store.png')}/>
            <Text style = {styles.orderNumText}>{item.store_name} </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    mainContainer : {
        backgroundColor : colors.white,
        padding : 15,
        flexDirection : 'row',
        justifyContent : 'flex-start',
        alignItems : 'center',
        alignSelf : 'center',
        height : 100,
        marginBottom : 10,
        borderRadius : 10,
        width :Dimensions.get('window').width * 0.95,
    },
    orderNumText : {
        fontSize : 18,
        fontWeight : "600",
        alignSelf : 'flex-start'
    },
    image : {
        height : 80,
        width : 80,
        marginRight : 15,
        borderRadius : 5,
        resizeMode : 'contain'
    }
})