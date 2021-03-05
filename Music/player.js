import React from 'react';
import { StyleSheet, Text, View,Button,Alert,Image,TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Slider from '@react-native-community/slider';
import {duration,get_play_time,get_sound_function,pre,stop1,load_and_play} from './play';

var repeat_one=false
class player extends React.Component{
    constructor({route}){
        super();
        const {login_data}=route.params;
        // console.log("song",item);
        // item_temp=item   
        this.state = {
            data: [],
            isLoading: true,
            is_like:'',
            like_c:0,
            // item_temp:item
            login_data:login_data,
            played_time:0.0,
            end_time:0.0,
            play_song:false,
            next_list:JSON.parse(login_data.next_list),
            pre_list:JSON.parse(login_data.pre_list),
        };
          
    }
    componentDidMount() {
        this.interval = setInterval(() => this.update_value(), 3000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    next(){
        const { next_list,pre_list } = this.state;
        console.log("next_list",next_list.length)
        if (next_list.length>=1){
            console.log("login",next_list)
            console.log("pre",pre_list)
            var exchange=next_list[0]
            console.log("exchange",exchange)
            var new_pre_list=pre_list.splice(0,0,next_list[0])
            var new_next_list=next_list.splice(0,1)
            console.log("new_pre_list",new_pre_list,"new_next_list",new_next_list)
            console.log("login",next_list)
            console.log("pre",pre_list)
            this.setState({next_list:next_list})
            this.setState({pre_list:pre_list})
            this.setState({login_data:next_list[0]})
            this.setState({is_like:next_list[0]['me_like']})

            this.data_set_and_play(next_list,pre_list)   
            this.add_history(next_list[0]['song_id'])         
        }
    }
    pre(){
        console.log("pre")
        const { next_list,pre_list } = this.state;
        console.log("next_list",pre_list.length)
        if (pre_list.length>0){
            console.log("login",next_list)
            console.log("pre",pre_list)
            var exchange=pre_list[0]
            console.log("exchange",exchange)
            
            var new_next_list=next_list.splice(0,0,exchange)
            var new_pre_list=pre_list.splice(0,1)
            console.log("new_pre_list",new_pre_list,"new_next_list",new_next_list)
            console.log("login",next_list)
            console.log("pre",pre_list)

            this.setState({next_list:next_list})
            this.setState({pre_list:pre_list})
            this.setState({login_data:next_list[0]})
            this.setState({is_like:next_list[0]['me_like']})

            this.data_set_and_play(next_list,pre_list)
            this.add_history(next_list[0]['song_id'])           
        }
    }
    data_set_and_play(next_list,pre_list){
        let keys = ['song_name', 'artist_name','song_id','song_img','is_like','song_file','play','next_list','pre_list'];
            AsyncStorage.multiRemove(keys, (err) => {
                console.log('Local storage user info removed!');
            });
            AsyncStorage.multiSet([
                ["song_name",next_list[0]['song_name']],
                ["artist_name",next_list[0]['artist']],
                ["song_id",next_list[0]['song_id'].toString()],
                ['song_img',next_list[0]['song_img'].toString()],
                ['is_like',next_list[0]['me_like'].toString()],
                ['song_file',next_list[0]['song_file'].toString()],
                ['next_list',JSON.stringify(next_list)],
                ['pre_list',JSON.stringify(pre_list)],
                ['play','true']
            ])
            AsyncStorage.multiGet(['song_name','artist_name']).then((data)=>{
                console.log("dtat",data)
            })
            if (get_sound_function==null){
                load_and_play(next_list[0]['song_file'].toString())
            }else{
                var s=get_sound_function();
                s.stop()
                load_and_play(next_list[0]['song_file'].toString())
            }
    }
    update_value(){
        // console.log("every 3000ms update",get_sound_function().getDuration())
        this.setState({end_time:duration()})
        this.setState({"play_song":get_sound_function()._playing})
        console.log("get_sound_function()._playing",get_sound_function()._playing)
        get_sound_function().getCurrentTime((seconds) => {
            console.log("so",seconds);
            this.setState({
                played_time: seconds
           })
        });

    }
    setposition(time){
        // console.log("time",time)
        var k=get_sound_function().setCurrentTime(time)
        console.log("k",k)
    }
    like(){
        console.log("like")
        const { login_data } = this.state;
        try{
            fetch('http://192.168.43.5:8000/like', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
                },body: JSON.stringify({
                    "u_id":login_data['u_id'].toString(),
                    "type":"song",
                    "song_id":login_data['song_id'].toString(),
                }),
            }).then((response)=>
                response.json()
            ).then((responseJson) => {
                console.log("rea",responseJson);
                this.setState({ is_like: responseJson['is_like']});
                this.setState({ like_c: responseJson['like']});
            }); 
        }catch(e){
            console.log("E",e)
        }
    }
    dislike(){
        console.log("dislike")
        const { login_data } = this.state;
        try{
            fetch('http://192.168.43.5:8000/dislke', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
                },body: JSON.stringify({
                    "u_id":login_data['u_id'].toString(),
                    "type":"song",
                    "song_id":login_data['song_id'].toString(),
                }),
            }).then((response)=>
                response.json()
            ).then((responseJson) => {
                console.log("rea dis",responseJson);
                this.setState({ is_like: responseJson['is_like']});
                this.setState({ like_c: responseJson['like']});
                
            }); 
        }catch(e){
            console.log("E",e)
        }
    }
    play(){
        var s=get_sound_function()
        console.log("s",s)
        s.play()
    }
    pause(){
        var s=get_sound_function()
        console.log("pause",s)
        s.pause()
    }
    add_history(song_id){
        AsyncStorage.multiGet(['u_id']).then((data) => {
            const u_id=data[0][1]
            fetch('http://192.168.43.5:8000/history', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                    },body: JSON.stringify({
                        "u_id":u_id,
                        "type":'song',
                        "song_id":song_id,
                        "artist":''
                    })
                })
            .then((response) => response.json())
            .then((json) => {
                console.log("json",json)
                this.setState({song_list:json['song']})
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setState({ isLoading: false });
            });
        })
    }
    render (){
        const { data, isLoading,is_like,like_c,login_data,end_time,played_time,play_song,next_list,pre_list } = this.state;
        console.log("data",is_like,like_c);
        console.log("login_data player ",login_data)
        console.log("end_time",end_time)
        console.log("pre_list",pre_list)
        const style=StyleSheet.create({
            song_name:{
                fontSize:18,
            }
        })
        const style1=StyleSheet.create({
            justifyContent1:{
                justifyContent:'center'
            }
        })          
        
        return (
            <View style={{flex: 1,flexDirection: 'column',justifyContent: 'flex-start',alignItems:'center'}}>
                <View style={{}}>
                    <Image style={{height: 350, width: 350,marginTop:10}}
                        source={{uri:login_data.song_img.toString(),}}/>
                </View>
                <View style={{flexDirection:'row',marginTop:5,borderBottomColor:"#00000",borderBottomWidth:1}}>
                    <View style={{flexDirection:'column',width:300}}>
                        <Text style={style.song_name}>{login_data.song_name}</Text>
                        <Text style={style.song_name}>{login_data.artist_name}</Text>
                    </View>
                    {is_like=='true'?
                        <TouchableOpacity style={{flexDirection: 'column',alignItems:'center'}} onPress={()=>{this.dislike()}} >
                            <Image  style={{height:30,width:30}} source={require('./asset/like.png')}/>
                            {/* <Text>{like_c}</Text> */}
                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={{flexDirection: 'column',alignItems:'center'}} onPress={()=>{this.like()}}>
                            <Image  style={{height:30,width:30}} source={require('./asset/dislike.png')}/>
                            {/* <Text>{like_c}</Text> */}
                        </TouchableOpacity>
                    }
                </View>
                <View style={{flexDirection:'column',marginTop:10}}>
                    <Slider style={{width:350, height: 20}}
                        minimumValue={0}
                        maximumValue={end_time}
                        value={played_time}
                        minimumTrackTintColor="#000000"
                        maximumTrackTintColor="#000000"
                        thumbTintColor='#FF0000'
                        onValueChange={(value)=>{this.setposition(value)}}
                    />
                    <View style={{flexDirection:'row'}}>
                        <Text style={{width:300}}>{("0"+(played_time/60).toString()).substr(0,5)}</Text>
                        <Text style={{}}>{("0"+(end_time/60).toString()).substr(0,5)}</Text>
                    </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <View style={style1.justifyContent1}>
                        {repeat_one==true?
                            <TouchableOpacity style={style1.justifyContent1}>
                                <Image style={{height: 35, width: 35,margin:10}}
                                    source={require('./asset/repeat2.png')}
                                    size={48} color="#444" />
                            </TouchableOpacity>
                        :
                            <TouchableOpacity style={style1.justifyContent1}>
                                <Image style={{height: 35, width: 35,margin:10}}
                                    source={require('./asset/repeat.png')}
                                    size={48} color="#444" />
                            </TouchableOpacity>
                        }
                    </View>
                    <View style={style1.justifyContent1}>
                        {pre_list.length<1?
                            <Image style={{height: 50, width: 50,margin:10}}
                                source={require('./asset/skip-previous-play-pause.png')}
                                size={48} color="#444" blurRadius={4}/>
                            :
                            <TouchableOpacity style={style1.justifyContent1} onPress={()=>{console.log("pre");this.pre()}}>
                                <Image style={{height: 50, width: 50,margin:10}}
                                    source={require('./asset/skip-previous-play-pause.png')}
                                    size={48} color="#444"/>
                            </TouchableOpacity>
                            
                        } 
                    </View>
                    <View style={{marginLeft:5,marginRight:5}}>
                        {play_song==false?
                            <TouchableOpacity style={style1.justifyContent1} onPress={()=>{
                                // play1();
                                this.play();
                                this.setState({"play_song":true})}}>
                                <Image style={{height: 120, width: 120}}
                                    source={require('./asset/play-triangle-launch-start.png')}
                                    size={48} color="#444" />
                            </TouchableOpacity>
                        :
                            <TouchableOpacity style={style1.justifyContent1} onPress={()=>{this.pause();this.setState({"play_song":false})}} >
                                <Image style={{height: 120, width: 120}}
                                    source={require('./asset/pause-stop-interup-break.png')}
                                    size={48} color="#444" />
                            </TouchableOpacity>
                           
                        }
                    </View>
                    <View style={style1.justifyContent1}>
                        {next_list.length<=1?
                            <Image style={{height: 50, width: 50,margin:10}}
                                source={require('./asset/skip-next-play-pause.png')}
                                size={48} color="#444" blurRadius={4}/>
                        :
                            <TouchableOpacity style={style1.justifyContent1} onPress={()=>{console.log("next");this.next()}}>
                                <Image style={{height: 50, width: 50,margin:10}}
                                    source={require('./asset/skip-next-play-pause.png')}
                                    size={48} color="#444" />
                            </TouchableOpacity>
                        }
                    </View>
                    <TouchableOpacity style={style1.justifyContent1} onPress={()=>{ console.log("duration",get_play_time())}}>
                        <Image style={{height:35,width:35,margin:10}}
                            source={require('./asset/shuffle.png')}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
export default player;