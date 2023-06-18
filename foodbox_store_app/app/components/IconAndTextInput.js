import React, {useState} from 'react'
import { StyleSheet, View, TextInput } from 'react-native';
import colors from '../config/colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


export default function IconAndTextInput({iconName, placeholder, keyboardType, returnKeyType, secureTextEntry, input, onSubmitEditing}) {
    const [userName, setUserName] = useState('');

    return(
        <View style = {styles.container}>
            <MaterialCommunityIcons name = {iconName} size={40} color = {colors.orange} />
            <TextInput  value={userName}
                        onChangeText={(userName) => {setUserName(userName); input(userName)}}
                        placeholder = {placeholder}
                        secureTextEntry={secureTextEntry}
                        numberOfLines={1}
                        maxLength = {20}
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType= {returnKeyType}
                        keyboardType = {keyboardType}
                        style={styles.input}
                        onSubmitEditing={onSubmitEditing}
                       />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection : "row",
        height : 60,
        width : "90%",
        alignItems : 'center',
        justifyContent : "flex-start",
        backgroundColor : "#ECECEC",
        borderRadius : 20,
        paddingLeft : 10,
        marginTop : 15,
        
    },
    input: {
        width: "60%",
        height: 40,
        padding: 10,

      },
})