import React, {useRef, useState} from "react";
import {View, StyleSheet, TextInput} from 'react-native';
import colors from "../config/colors";

export default function CodeInputIiew({number}){
    const input_1 = useRef();
    const input_2 = useRef();
    const input_3 = useRef();
    const input_4 = useRef();
    const input_5 = useRef();

    const [num1, setNum1] = useState("");
    const [num2, setNum2] = useState("");
    const [num3, setNum3] = useState("");
    const [num4, setNum4] = useState("");
    const [num5, setNum5] = useState("");

    return(
        <View style = {styles.mainContainer}>
           <View style = {styles.inputBox}>
             <TextInput 
                        maxLength={1}
                        numberOfLines={1}
                        inputMode="numeric"
                        autoFocus = {true}
                        value={num1}
                        onChangeText={(num1) => {setNum1(num1); if (num1.length == 1)  input_2.current.focus()}}
                        ref = {input_1}
             />     
           </View>
           <View style = {styles.inputBox}>
           <TextInput 
                        maxLength={1}
                        numberOfLines={1}
                        inputMode="numeric"
                        ref = {input_2}
                        value={num2}
                        onChangeText={(num2) => {
                          setNum2(num2);  
                          if (num2.length == 1) input_3.current.focus();
                          if(num2.length ==0) input_1.current.focus();
                        }}
             />
           </View>
           <View style = {styles.inputBox}>
           <TextInput 
                        maxLength={1}
                        numberOfLines={1}
                        inputMode="numeric"
                        ref = {input_3}
                        value={num3}
                        onChangeText={(num3) => {
                          setNum3(num3);  
                          if (num3.length == 1) input_4.current.focus();
                          if(num3.length ==0) input_2.current.focus();
                        }}
             />
           </View>
           <View style = {styles.inputBox}>
           <TextInput 
                        maxLength={1}
                        numberOfLines={1}
                        inputMode="numeric"
                        ref = {input_4}
                        value={num4}
                        onChangeText={(num4) => {
                          setNum4(num4); 
                          if (num4.length == 1) input_5.current.focus();
                          if(num4.length ==0) input_3.current.focus();
                        }}
             />
           </View>
           <View style = {styles.inputBox}>
           <TextInput 
                        maxLength={1}
                        numberOfLines={1}
                        inputMode="numeric"
                        ref = {input_5}
                        value={num5}
                        onChangeText={(num5) => {
                          setNum5(num5);
                          number(num1 + num2 + num3 + num4 + num5);
                          if(num5.length ==0) input_4.current.focus();
                        }}
             />
           </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer : {
        flexDirection : "row",
        height : 60,
        width : "80%",
        alignItems : "center",
        justifyContent :"space-between",
        marginTop : 50
    },
    inputBox : {
        height : 50,
        width : 50,
        borderRadius : 5,
        backgroundColor : colors.lightgrey,
        alignItems : 'center',
        justifyContent : "center"
    }
})