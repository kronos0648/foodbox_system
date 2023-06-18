import React from "react";
import { StyleSheet, Text, TouchableOpacity} from 'react-native';
import colors from "../config/colors";
import Ionicons from '@expo/vector-icons/Ionicons'

export default function Button({onPress, height, width, iconSize, icon, color, title, textColor, textSize}){
    return(
        <TouchableOpacity onPress = {onPress} style = {[styles.titleContainer, {backgroundColor : color, height : height, width : width, borderRadius : height/5}]}>
            { icon != null && <Ionicons name = {icon} size = {iconSize} color = {"black"}/>}
            <Text style = {[styles.text, {color : textColor, fontSize : textSize }]} >{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    titleContainer : {
        alignItems :"center",
        justifyContent : "center",
        backgroundColor : "white",
        borderRadius: 5,
        marginVertical : 20
    },
    text : {
        fontSize : 15, 
        fontWeight : "bold", 
        color : colors.black,
        margin : 10
    }
})