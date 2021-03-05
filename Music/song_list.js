import React from 'react';
import { StyleSheet, Text, View,Button,Alert,Image,TouchableOpacity,ScrollView,SafeAreaView,FlatList } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {load_and_play,get_sound_function} from './play';
var play=true;
class song_list extends React.Component{
    constructor({route}){
        super();
        const {item}=route.params;       
        this.state = {
            song_list:[],
            artist_detail:item,
            me_like_artist:false,
            initial: 'state',
            some: '' ,
            artist_play:false,
            login_data:''
        };
    }
    componentDidMount() {
        const{artist_detail} = this.state;
        AsyncStorage.multiGet(['email', 'password','u_id','name','song_name','artist_name','song_id','song_img','is_like','artist_or_playlist_play','next_list','pre_list','suffer','repeat_one','play']).then((data) => {
            const l={
              "email":data[0][1],
              "u_id":data[2][1],
              "name":data[3][1],
              "song_name":data[4][1],
              "artist_name":data[5][1],
              "song_id":data[6][1],
              "song_img":data[7][1],
              "is_like":data[8][1],
              "artist_or_playlist_play":data[9][1],
              "next_list":data[10][1],
              "pre_list":data[11][1],
              "suffer":data[12][1],
              "repeat_one":data[13][1],
              'play':data[14][1]
            }
            // console.log("l",l)
            this.setState({ login_data: l});
            fetch('http://192.168.43.5:8000/get_list', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                    },body: JSON.stringify({
                        "u_id":l['u_id'].toString(),
                        "type":"artist",
                        "artist":artist_detail['artist_name']
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

            fetch('http://192.168.43.5:8000/islke', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                    },body: JSON.stringify({
                        "u_id":l['u_id'],
                        "type":"artist",
                        "artist":artist_detail['artist_name']
                    })
                })
            .then((response) => response.json())
            .then((json) => {
                console.log("json",json)
                this.setState({me_like_artist:json['is_like']})
            })
            .catch((error) => console.error(error))
            .finally(() => {
                this.setState({ isLoading: false });
            });
        }); 
    }
    like(){
        const { login_data,artist_detail } = this.state;
        console.log("like")
        try{
            fetch('http://192.168.43.5:8000/like', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
                },body: JSON.stringify({
                    "u_id":login_data['u_id'].toString(),
                    "type":"artist",
                    "artist":artist_detail['artist_name'].toString()
                }),
            }).then((response)=>
                response.json()
            ).then((responseJson) => {
                console.log("rea",responseJson);
                this.setState({ me_like_artist: responseJson['is_like']});
                // this.setState({ like_c: responseJson['like']});
            }); 
        }catch(e){
            console.log("E",e)
        }
    }
    dislike(){
        const { login_data,artist_detail } = this.state;
        console.log("dislike")
        try{
            fetch('http://192.168.43.5:8000/dislke', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
                },body: JSON.stringify({
                    "u_id":login_data['u_id'].toString(),
                    "type":"artist",
                    "artist":artist_detail['artist_name'].toString()
                }),
            }).then((response)=>
                response.json()
            ).then((responseJson) => {
                console.log("rea dis",responseJson);
                this.setState({ me_like_artist: responseJson['is_like']});
                // this.setState({ like_c: responseJson['like']});
                
            }); 
        }catch(e){
            console.log("E",e)
        }
    }
    play_list(){
        const { song_list,login_data,artist_detail} = this.state;
        console.log("play list",song_list)
        var item=song_list[0]
        var pre=[]
        var next=song_list
        console.log("item",item,pre,next)
        // condrion="play"
        this.add_history(login_data['u_id'],'artist','',artist_detail.artist_name)
        this.add_data_and_play(item,next,pre,'play_list')
    }
    play_song(item,con){
        const { song_list} = this.state;
        var pre='';
        var next='';
        console.log("song_list",song_list)
        for(var i=0;i<=song_list.length;i++){
            console.log("i",i)
            console.log("i",song_list[i])
            if (song_list[i].song_id==item.song_id){
                console.log("i",i)
                var list=song_list
                pre=list.splice(0,i)
                next=list//.splice(i,song_list.length)
                console.log("aaaaaaaaaaaaaaaaaaaaa-------------------------------------------------",pre.concat(next))
                this.setState({song_list:pre.concat(next)})
                // console.log("son",list)
                // console.log("pre",pre)
                // console.log("next",next)
                this.add_data_and_play(item,next,pre,con)
                break
            }
        }      
    }
    add_data_and_play(item,next,pre,con){
        console.log("play song",item)
        let keys = ['song_name', 'artist_name','song_id','song_img','is_like','song_file','play','next_list','pre_list'];
          AsyncStorage.multiRemove(keys, (err) => {
              console.log('Local storage user info removed!');
          });
        AsyncStorage.multiSet([
            ["song_name",item['song_name']],
            ["artist_name",item['artist']],
            ["song_id",item['song_id'].toString()],
            ['song_img',item['song_img'].toString()],
            ['is_like',item['me_like'].toString()],
            ['song_file',item['song_file'].toString()],
            ['next_list',JSON.stringify(next)],
            ['pre_list',JSON.stringify(pre)],
            ['play','false']
        ])
        AsyncStorage.multiGet(['email', 'password','u_id','name','song_name','artist_name','song_id','song_img','is_like','artist_or_playlist_play','next_list','pre_list','suffer','repeat_one','play','song_file']).then((data) => {
            const l={
              "email":data[0][1],
              "u_id":data[2][1],
              "name":data[3][1],
              "song_name":data[4][1],
              "artist_name":data[5][1],
              "song_id":data[6][1],
              "song_img":data[7][1],
              "is_like":data[8][1],
              "artist_or_playlist_play":data[9][1],
              "next_list":data[10][1],
              "pre_list":data[11][1],
              "suffer":data[12][1],
              "repeat_one":data[13][1],
              'play':data[14][1],
              'song_file':data[15][1]
            }
            console.log("l------------------------------------------------------------------------------------------",l)
            console.log("next",JSON.stringify(data[10][1]))
            console.log("pre",JSON.stringify(data[11][1]))
            if (get_sound_function==null){
                load_and_play(l.song_file)
            }else{
                var k=get_sound_function()
                k.stop()
                load_and_play(l.song_file)
            }
            
            if (con=='item'){
                this.props.navigation.navigate('player',{'login_data':l})
            }
        });

    }
    pause_song(){
        console.log("pasues song")
        var k =get_sound_function()
        k.pause()
    }
    play_list_pause(){
        console.log("pasues song")
        var k =get_sound_function()
        k.stop()
        // let keys = ['song_name', 'artist_name','song_id','song_img','is_like','song_file','play'];
        //   AsyncStorage.multiRemove(keys, (err) => {
        //       console.log('Local storage user info removed!');
        //   });
        // AsyncStorage.multiSet([
        //     ["song_name",""],
        //     ["artist_name",""],
        //     ["song_id",""],
        //     ['song_img',""],
        //     ['is_like',""],
        //     ['song_file',""],
        //     ['next_list',""],
        //     ['pre_list',""],
        //     ['play','true']
        // ])
        AsyncStorage.multiGet(['u_id','song_name','artist_name','song_id','song_img','is_like','artist_or_playlist_play','next_list','pre_list','suffer','repeat_one','play']).then((data) => {
            console.log("dtataaaaaaaa",data)
          });

    }
    add_history(u_id,type,song_id,artist){
        fetch('http://192.168.43.5:8000/history', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
                },body: JSON.stringify({
                    "u_id":u_id,
                    "type":type,
                    "song_id":song_id,
                    "artist":artist
                })
            })
        .then((response) => response.json())
        .then((json) => {
            // console.log("json",json)
        })
        .catch((error) => console.error(error))
        .finally(() => {
            this.setState({ isLoading: false });
        });
    }
    render(){
        const { navigate } = this.props.navigation;
        const { song_list,artist_detail,me_like_artist,artist_play,login_data } = this.state;
        console.log("login_data render",login_data)
        const songitem = ({item}) => (
                // onPress={() => this.play_song(item)}>
              <View style={{paddingTop: 5, paddingBottom: 5,flexDirection: 'row',marginLeft: 5,marginRight: 5,borderBottomColor:'#000000',borderBottomWidth:1}}>
                <TouchableOpacity style={{flexDirection: 'row'}} onPress={()=>{
                    console.log("open player");
                    this.play_song(item,'item')
                }}>
                    <Image style={{width: 55, height: 55,marginLeft:5,marginRight:5}}
                        source={{uri: item.song_img.toString(),}}/>
                    <View style={{justifyContent:'center',marginLeft:5,width:260}}>
                        <Text>{item.song_name}</Text>
                    </View>
                </TouchableOpacity>
                
                <View style={{justifyContent:'flex-end',width:20}}>
                    {item.me_like==false?
                        <View style={{flexDirection: 'column',alignItems:'center'}}>
                            <Image style={{width: 15, height: 15}}
                                source={require('./asset/dislike.png')}
                                />
                            <Text style={{fontSize:10}}>{item.like}</Text>
                        </View>
                        :
                        <View style={{flexDirection: 'column',alignItems:'center'}}>
                            <Image style={{width: 15, height: 15}}
                                source={require('./asset/like.png')}
                                />
                            <Text style={{fontSize:10}}>{item.like}</Text>
                        </View> 
                    }
                </View>
                <View>
                    {play==false?
                        <TouchableOpacity onPress={()=>{this.pause_song()}}>
                            <Image style={{height: 40, width: 40}}
                                source={require('./asset/pause-stop-interup-break.png')}
                                size={48} color="#444" />
                        </TouchableOpacity>
                    :
                        <TouchableOpacity onPress={()=>{this.play_song(item,'play')}}>
                            <Image style={{height: 40, width: 40}}
                                source={require('./asset/play-triangle-launch-start.png')}
                                size={48} color="#444" />
                        </TouchableOpacity>
                    }
                </View>
              </View>
          );
        const style=StyleSheet.create({
            play_like:{
                borderColor:'#000000',
                borderWidth:2,
                borderRadius:100,
                margin:5,
                padding:5
            },
            like_txt:{
                fontSize:20,
                marginLeft:5,
                marginRight:5
            }
        })
        return(
            <View style={{flexDirection: 'column',alignItems: 'center',flex:1}}>
                <View style={{alignItems:'center',marginTop:10}}>
                    <Image style={{height: 150, width: 150,borderRadius:100,borderColor:"#000000",borderWidth:1}}
                        source={{uri:artist_detail.artist_img,}}
                        size={48} color="#444"/>
                    
                    <Text style={{marginTop:3,marginBottom:3}}>{artist_detail.artist_name}</Text>
                </View> 
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <View style={style.play_like}>
                        {login_data['artist_or_playlist_play']!=""?
                            <TouchableOpacity style={{flexDirection:'row',justifyContent:'center'}} onPress={()=>{this.pause_list()}} >
                                <Image style={{height: 30, width: 30}}
                                    source={require('./asset/pause-stop-interup-break.png')}
                                    size={48} color="#444" />
                                <View style={{flexDirection:'column',justifyContent:'center'}}>
                                    <Text style={style.like_txt}>PAUSE</Text>
                                </View>
                            </TouchableOpacity>
                        :
                            <TouchableOpacity style={{flexDirection:'row'}} onPress={()=>{this.play_list()}}>
                                <Image style={{height: 30, width: 30}}
                                    source={require('./asset/play-triangle-launch-start.png')}
                                    size={48} color="#444" />
                                <View style={{flexDirection:'column',justifyContent:'center'}}>
                                    <Text style={style.like_txt}>PLAY</Text>
                                </View>
                            </TouchableOpacity>
                        }
                    </View>
                    <View style={style.play_like}>
                        {me_like_artist==false?
                            <TouchableOpacity style={{flexDirection: 'row',alignItems:'center'}} onPress={()=>{this.like()}}>
                                <Image style={{width: 30, height: 30}} source={require('./asset/dislike.png')}/>
                                <View style={{flexDirection:'column',justifyContent:'center'}}>
                                    <Text style={style.like_txt}>LIKE</Text>
                                </View>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={{flexDirection: 'row',alignItems:'center'}} onPress={()=>{this.dislike()}}>
                                <Image style={{width: 30, height: 30}} source={require('./asset/like.png')}/>
                                <View style={{flexDirection:'column',justifyContent:'center'}}>
                                    <Text style={style.like_txt}>DISLIKE</Text>
                                </View>
                            </TouchableOpacity> 
                        }
                    </View>
                </View>
                <View style={{backgroundColor:'#00000',width:500,height:5,borderBottomColor: 'black',borderBottomWidth: 5,}}/>
                <SafeAreaView style={{marginLeft:5,marginRight:5,flex:1}}>
                    <FlatList
                        data={song_list}
                        renderItem={songitem}
                        keyExtractor={(item) => item.song_id.toString()}/>
                </SafeAreaView>
            </View>
        )
    }
}
export default song_list;