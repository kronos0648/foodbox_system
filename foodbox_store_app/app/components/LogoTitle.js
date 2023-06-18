import React from "react";
import {View, StyleSheet, Text} from 'react-native';
import colors from "../config/colors";

export default function LogoTitle({size}){
    return(
        <View style = {styles.titleContainer}>
            <Text style = {{fontSize : size, fontWeight : "bold", color : colors.lightblue, padding: 1 }} >배</Text>
            <Text style = {{fontSize : size, fontWeight : "bold", color : colors.black }} >달</Text>
            <Text style = {{fontSize : size, fontWeight : "bold", color : colors.orange, padding: 1 }} >천</Text>
            <Text style = {{fontSize : size, fontWeight : "bold", color : colors.black }} >국</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    titleContainer : {
        flexDirection : "row",
        marginTop : 10
    }
})