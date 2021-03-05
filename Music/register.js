import React from 'react';
import { StyleSheet, Text, View,Button,Alert } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';


class register extends React.Component{
    login(email,password,name){
        try{
            fetch('http://192.168.43.5:8000/register', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "email":email,
                "password":password,
                "full_name":name
            }),
            
        }).then((response)=>response.json())
        .then((responseJson) => {
            console.log("jon",responseJson);
            if (responseJson['email']=="email already taken"){
                Alert.alert(responseJson['email'])
            }else{
                AsyncStorage.multiSet([
                    ["email", responseJson['email']],
                    ["password", responseJson['password']],
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
                // this.props.navigation.navigate('home')
            }
         }); 
        }catch(e){
            console.log("Error",e)
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
        return (
            <View style={{justifyContent:'center',flex:1,flexDirection:'column',paddingLeft:'5%',paddingRight:'5%'}}>
                <TextInput editable maxLength={30} autoCompleteType="name" placeholder="Full Name" onChangeText={(text)=>this.setState({name:text})}/>
                <TextInput editable maxLength={30} autoCompleteType="email" placeholder="Email" onChangeText={(text)=>this.setState({email:text})}/>
                <TextInput editable maxLength={30} autoCompleteType="password" placeholder="Password" onChangeText={(text)=>this.setState({password:text})}/>
                <TextInput editable maxLength={30} autoCompleteType="password" placeholder="Comform Password" onChangeText={(text)=>this.setState({c_password:text})}/>
                <Button
                    title="Sign up"
                    onPress={() =>{
                        console.log("register",this.state.name,this.state.email,this.state.password,this.state.c_password)
                        this.login(this.state.email,this.state.password,this.state.name)  
                    }}
                    />
                <Text style={{textAlignVertical: "center",textAlign: "center",}} onPress={()=>this.props.navigation.navigate('login')}>back to login</Text>
            </View>
        );
    }
}
export default register;