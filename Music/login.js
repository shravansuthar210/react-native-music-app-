import React from 'react';
import { StyleSheet, Text, View,Button,Alert } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import {load} from './play';
class login extends React.Component{
    constructor({props}){
        super(props)  
        this.state = {
          autologin: "",   
          u_id:0 ,
          input:'',
          password:''
        }
    }
    login(email,password){
            try{
                fetch('http://192.168.43.5:8000/login', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "email":email,
                    "password":password
                }),
                
            }).then((response)=>
                response.json()
            ).then((responseJson) => {
                if (responseJson['email']=="wrong"){
                    Alert.alert("email or password are not valid")
                }else{
                    console.log("seccesfull")
                    AsyncStorage.multiSet([
                        ["email", responseJson['email']],
                        ["password", responseJson['password']],
                        ["name", responseJson['full_name']],
                        ["u_id",responseJson['u_id'].toString()],
                        ["song_name",''],
                        ["artist_name",''],
                        ["song_id",''],
                        ['song_img',''],
                        ['is_like','false'],
                        ['artist_or_playlist_play',''],
                        ['next_list',''],
                        ['pre_list',''],
                        ['suffer','false'],
                        ['repeat_one','false'],
                        ['play','false'],
                        ['song_file','']
                    ])
                    this.desboard(responseJson['u_id'])
                }
            }); 
            }catch(e){
                console.log("E",e)
            }
    }
    desboard(u_id){
        try{
            fetch('http://192.168.43.5:8000/desboard', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "u_id":u_id
            }),}).then((response)=>response.json())
            .then((responseJson1) => {           
                this.props.navigation.navigate('home',{"desboard":responseJson1})

            }); 
            }catch(e){
                console.log("E1",e)
            }
    }
    render (){
        AsyncStorage.multiGet(['email', 'password','u_id','song_file']).then((data) => {
            let email = data[0][1];
            let password = data[1][1];
            let u_id=data[2][1]
            console.log("dtat",data)
            if (u_id !== null){
                console.log("email",email)
                console.log("passs",password)
                try{
                    load(data[3][1])
                }catch(e){
                    console.log("eroor",e)
                }
                this.desboard(u_id)
            }
            else{
                console.log("empty")
            }
        });
        const { u_id,email,password } = this.state;
        return (
            <View style={{justifyContent:'center',flex:1,flexDirection:'column',paddingLeft:'5%',paddingRight:'5%'}}>
                <Text>Email</Text>
                <TextInput editable maxLength={30} autoCompleteType="email" placeholder="Email" onChangeText={(text)=>this.setState({email:text})}/>
                <Text>Password</Text>
                <TextInput editable maxLength={25} autoCompleteType="password" placeholder="Password" onChangeText={(text)=>this.setState({password:text})}/>
                <Button
                    title="SignIn"
                    onPress={()=>{
                            console.log(email,password)
                            this.login(email,password)
                        }
                    }
                    />
                <Text style={{textAlignVertical: "center",textAlign: "center",}} onPress={()=>this.props.navigation.navigate('register')}>Register Email address</Text>
            </View>
        );
    }
}
export default login;