import *  as React from 'react';
import {useState} from 'react';
import {Text,View,TextInput,Image,Button,TouchableOpacity,StyleSheet,ScrollView} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FlatList} from 'react-native-gesture-handler';
import Sound from 'react-native-sound';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import AsyncStorage from '@react-native-community/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {duration,get_play_time,get_sound_function,load_and_play} from './play';

class home extends React.Component{
  
  constructor({props,route}){
    super(props)  
    const {desboard} = route.params;
    var p
    try{
      p=get_sound_function()._playing
    }catch(e){
      console.log("e",e)
      p=false
    }
    this.state = {
      initial: 'state',
      some: '' ,
      login_data:'',
      search_list:'',
      desboard1 : desboard,
      play:p,
      song_serach_list:'',
      song_s:false
   }
    this.update_value()
  }
  
  update_value(){
    console.log("update every 3000ms shravan suthar")
    
    AsyncStorage.multiGet(['email', 'password','u_id','name','song_name','artist_name','song_id','song_img','is_like','artist_or_playlist_play','next_list','pre_list','suffer','repeat_one','play']).then((data) => {
      var l={
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
    });
    
    
  }
  
  // componentWillMount(){
  //   console.log("reload page")
  //   AsyncStorage.multiGet(['email', 'password','u_id','name','song_name','artist_name','song_id','song_img','is_like','artist_or_playlist_play','next_list','pre_list','suffer','repeat_one','play']).then((data) => {
  //     var l={
  //       "email":data[0][1],
  //       "u_id":data[2][1],
  //       "name":data[3][1],
  //       "song_name":data[4][1],
  //       "artist_name":data[5][1],
  //       "song_id":data[6][1],
  //       "song_img":data[7][1],
  //       "is_like":data[8][1],
  //       "artist_or_playlist_play":data[9][1],
  //       "next_list":data[10][1],
  //       "pre_list":data[11][1],
  //       "suffer":data[12][1],
  //       "repeat_one":data[13][1],
  //       'play':data[14][1]
  //     }
  //     this.setState({ login_data: l});
  //   });
  // }
  
  // componentDidMount() {
  //   this.interval = setInterval(() => this.update_value(), 3000);
  // }
  // componentWillUnmount() {
  //   clearInterval(this.interval);
  // }
  play(){

    var s=get_sound_function()
    console.log("s",s)
    if (s==null){
      console.log("s is nulll")
    }
    s.play()
  }
  pause(){
      var s=get_sound_function()
      console.log("pause",s)
      s.pause()

  }
  next(){
    AsyncStorage.multiGet(['u_id','song_name','artist_name','song_id','song_img','is_like','artist_or_playlist_play','next_list','pre_list','suffer','repeat_one','play','song_file']).then((data)=>{
      console.log("datat",data)
      var next_list=JSON.parse(data[7][1])
      var pre_list=JSON.parse(data[8][1])
      console.log("next_list",next_list.length)
      if (next_list.length>=2){
          console.log("login",next_list)
          console.log("pre",pre_list)
          var exchange=next_list[0]
          console.log("exchange",exchange)
          var new_pre_list=pre_list.splice(0,0,next_list[0])
          var new_next_list=next_list.splice(0,1)
          console.log("new_pre_list",new_pre_list,"new_next_list",new_next_list)
          console.log("login",next_list)
          console.log("pre",pre_list)
          
          // this.setState({pre_list:pre_list})
          // this.setState({login_data:next_list[0]})
          // this.setState({is_like:next_list[0]['me_like']})

          
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
          if (get_sound_function()==null){
            load_and_play(exchange['song_file'].toString())
            this.setState({play:true})  
          }else{
            var s=get_sound_function();
            s.stop()
            load_and_play(exchange['song_file'].toString())
            this.setState({play:true})
          }
          
      }
    })   
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
        console.log("json",json)
        this.setState({song_list:json['song']})
    })
    .catch((error) => console.error(error))
    .finally(() => {
        this.setState({ isLoading: false });
    });
}
  render(){  
    
    const { login_data,desboard1,play,song_serach_list,song_s} = this.state;
    var new_next_list=login_data['next_list']
    console.log("login11111111",new_next_list)
    
   console.log("re",desboard1['user_like'][0]['history'])
    const { navigation:navigate } = this.props;

    const Tab_top = createMaterialTopTabNavigator();
    const Tab = createBottomTabNavigator();
    
    
    
    const style = StyleSheet.create({
      profileScreen_option: {
        borderBottomColor: '#000000',
        borderBottomWidth: 1,
        paddingLeft:10,
        paddingBottom: 5,
        flexDirection:'row',
        marginTop:5
      },
      profileScreen_history: {
        borderBottomColor: '#000000',
        borderBottomWidth: 1,
        marginLeft: 20,
        marginRight: 20,
        paddingLeft: 10,
        paddingBottom: 5,
        flexDirection: 'row',
        marginTop: 5,
      },
    });
    const sub_player = ({navigation}) =>(
      <View style={{flexDirection: 'row',paddingLeft:15,paddingBottom:4,paddingTop:4}}>
        <Image style={{width: 45, height: 45,borderColor:"#000000",borderWidth:1,borderRadius:50}}
            source={{
              uri:login_data['song_img'],
            }}
            onPress={()=>navigation.navigate('player',{'login_data':login_data})}
          />
        <View style={{marginLeft:20,justifyContent: 'center',width:220}}>
          <Text style={{fontSize:13}} onPress={()=>navigation.navigate('player',{'login_data':login_data})} >{login_data['song_name']}</Text>
          <Text style={{fontSize:12}} onPress={()=>navigation.navigate('player',{'login_data':login_data})}  >{login_data['artist_name']}</Text>
        </View>
        <View style={{justifyContent: 'flex-end',paddingBottom:3,width:20}}>
          {login_data['is_like']=='false'?
            <Image style={{width: 15, height: 15}}
              source={require('./asset/dislike.png')}
            />:
            <Image style={{width: 15, height: 15}}
              source={require('./asset/like.png')}
            />
          }
        </View>
        <View style={{width:48}}>
          {play==false?
            <TouchableOpacity onPress={()=>{this.play();this.setState({play:true})}}>
              <Image style={{width: 40, height: 40}} source={require('./asset/play-triangle-launch-start.png')}/>
            </TouchableOpacity>
            :
            <TouchableOpacity onPress={()=>{this.pause();this.setState({play:false})}}>
              <Image style={{width: 40, height: 40}} source={require('./asset/pause-stop-interup-break.png')}/>
            </TouchableOpacity>
          }
        </View>
        <View style={{width:40}}>
          {new_next_list<=1?
            <Image style={{width: 38, height: 38}} source={require('./asset/skip-next-play-pause.png')} blurRadius={4}/>
          :
            <TouchableOpacity onPress={()=>{this.next();console.log("next")}}>
              <Image style={{width: 38, height: 38}} source={require('./asset/skip-next-play-pause.png')}/>
            </TouchableOpacity>
          }
        </View>
      </View>
    )
    
    const deshboardScreen =({navigation}) => {
      const renderItem = ({item}) => (
        <View style={{width: 120,borderColor: '#000000',borderWidth: 1,marginTop: 2,marginLeft: 5,marginRight: 5,alignItems: 'center',}}>
          <View style={{paddingTop: 10, paddingBottom: 5}}>
            <Image
              style={{width: 90, height: 90}}
              source={{
                uri: item.artist_img.toString(),
              }}
            />
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text>{item.artist}</Text>
              <Text>{item.artist}</Text>
            </View>
          </View>
        </View>
      );
      const artistItem = ({item}) => (
        <TouchableOpacity
          style={{width: 120,borderColor: '#000000',borderWidth: 1,marginTop: 2,marginLeft: 5,marginRight: 5,paddingTop: 10, paddingBottom: 5, alignItems: 'center'}}
             onPress={() => navigation.navigate('song_list', {item: item})}>
            <Image style={{width: 90, height: 90,borderRadius:100}}
              source={{
                uri: item.artist_img.toString(),
              }}
            />
            <Text>{item.artist_name}</Text>
        </TouchableOpacity>
      );
      const weekly_songItem = ({item}) => (
        <View style={{ width: 160, borderColor: '#000000', borderWidth: 1,marginTop: 10,marginLeft: 13,marginRight: 13,}}>
          <View style={{alignItems: 'center', paddingTop: 10, paddingBottom: 5}}>
            <Image
              style={{width: 120, height: 120}}
              source={{
                uri: item.artist_img.toString(),
              }}
            />
            <Text>{item.artist}</Text>
          </View>
        </View>
      );
      return(
        <View style={{flex: 1}}>
          <ScrollView  style={{flex: 1}}>
            {/* <View>
              <View style={style.profileScreen_history}>
                <Text>Recent</Text>
                <Text style={{marginLeft: 250}}>See More +</Text>
              </View>
              <SafeAreaView>
                <FlatList
                  horizontal={true}
                  data={song_artist_playlist}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.song_id.toString()}
                />
              </SafeAreaView>
            </View> */}
            {/* <View>
              <Text>Weekly Song</Text>
              <View>
                <SafeAreaView>
                  <FlatList
                    numColumns={2}
                    data={weekly_song}
                    renderItem={weekly_songItem}
                    keyExtractor={(item) => item.song_id.toString()}
                  />
                </SafeAreaView>
              </View>
            </View> */}
            {/* <View>
              <View style={style.profileScreen_history}>
                <Text>Play list</Text>
              </View>
              <SafeAreaView>
                <FlatList
                  horizontal={true}
                  data={song_artist_playlist}
                  renderItem={artistItem}
                  keyExtractor={(item) => item.song_id.toString()}
                />
              </SafeAreaView>
            </View> */}
            <View>
              <View style={style.profileScreen_history}>
                <Text>Artist</Text>
              </View>
              <SafeAreaView>
                <FlatList
                  horizontal={true}
                  data={desboard1.artist}
                  renderItem={artistItem}
                  keyExtractor={(item) => item.artist_name}
                />
              </SafeAreaView>
            </View>
            {/* <View>
              <View style={style.profileScreen_history}>
                <Text>Albums</Text>
              </View>
              <SafeAreaView>
                <FlatList
                  horizontal={true}
                  data={desboard1['albums']}
                  renderItem={artistItem}
                  keyExtractor={(item)=>item.song_id.toString()}/>
              </SafeAreaView>
            </View>
            */}
            {/*  <View>
              <View style={style.profileScreen_history}>
                <Text>Recent upload song</Text>
              </View>
              <SafeAreaView>
                <FlatList
                  horizontal={true}
                  data={song_artist_playlist}
                  renderItem={artistItem}
                  keyExtractor={(item)=>item.song_id.toString()}/>
              </SafeAreaView>
            </View> */}
          </ScrollView>
          {login_data['song_id']!=''?
            <View style={{borderTopColor:"#000000",borderTopWidth:1,width:500}}>{sub_player({navigation})}</View>
            :
            null
          }
        </View>
    );
  }
    const profileScreen=({navigation})=> {
      const renderItem = ({item}) => (
        // <Item title={item.artist} />
        <View style={{width: 120,borderColor: '#000000',borderWidth: 1,marginTop: 7,marginLeft: 5,marginRight: 5,}}>
          <View style={{alignItems: 'center', paddingTop: 10, paddingBottom: 5}}>
            {item.artist_img!=null?
                <Image style={{width: 90, height: 90,borderRadius:100}}
                  source={{
                    uri: item.artist_img.toString(),
                  }}
                />
              :
              <Image style={{width: 90, height: 90}}
                source={{
                  uri: item.song_img.toString(),
                }}
              />
            }
            
            {item.song_name==null?
              <Text>Artist</Text>
            :
              <Text>{item.song_name}</Text>
            }
            {item.artist!=null?
              <Text>{item.artist}</Text>
            :
              <Text>{item.artist_name}</Text>
            }
            
            
          </View>
        </View>
      );
      // console.log("AsyncStorage.getItem('email')",AsyncStorage.getItem('email'))
      return (
        <View style={{flex: 1}}>
          <View style={{paddingLeft:25,paddingRight:25}}>
            <View style={{flexDirection:'row',borderBottomWidth: 1,borderBottomColor: '#000000',paddingBottom: 10,marginBottom: 5,marginTop:10}}>
              <Image style={{width: 90, height: 90, borderRadius: 100}}
                source={{
                  uri: 'https://reactnative.dev/img/tiny_logo.png',
                }}
              />
              <View style={{justifyContent:'center',marginLeft:20}}>
                <Text style={{marginTop: 10}}>{login_data['name']}</Text>
                <Text>{login_data['email']}</Text>
              </View>
            </View>
          </View>
            <View>
              <Text style={{paddingLeft: 30,fontSize:15}}>Recent Play</Text>
              <SafeAreaView>
                <FlatList
                  horizontal={true}
                  data={desboard1['user_like'][0]['history']}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.date.toString()}
                />
              </SafeAreaView>
            </View>
            <View style={{marginTop:10,marginLeft:15,marginRight:25}}>
              <View style={{borderBottomColor:"#000000",borderBottomWidth:1}}/>
              <View style={style.profileScreen_option} >
                <Image style={{width: 20, height: 20}} source={require('./asset/premium.png')}/>
                <Text style={style.profileScreen_option,{fontSize:15,marginLeft:5}}>Get Premium</Text>
              </View>
              <View style={style.profileScreen_option} >
                <Image style={{width: 20, height: 20}} source={require('./asset/history.png')}/>
                <Text style={style.profileScreen_option,{fontSize:15,marginLeft:5}}>History</Text>
              </View>
              <View style={style.profileScreen_option} >
                <Image style={{width: 20, height: 20}} source={require('./asset/settings.png')}/>
                <Text style={style.profileScreen_option,{fontSize:15,marginLeft:5}}>Setting</Text>
              </View>
              <View style={style.profileScreen_option} >
                <Image style={{width: 20, height: 20}} source={require('./asset/logout.png')}/>
                <Text style={style.profileScreen_option,{fontSize:15,marginLeft:5}}
                onPress={()=>{AsyncStorage.clear();navigation.navigate('Login')}}>logOut</Text>
              </View>
            </View>
            
          {login_data['song_id']!=''?
           <View style={{position:'absolute',left:0,bottom:0,borderTopColor:"#000000",borderTopWidth:1,width:500}}>{sub_player({navigation})}</View>
            :
            null
          }
        </View>
      );
    }
    const libraryScreen=({})=> {
      return (
        <View style={{flex:1}}>
          <Tab_top.Navigator>
            <Tab_top.Screen name="Song" component={songScreen} />
            <Tab_top.Screen name="Artist" component={artistScreen} />
            <Tab_top.Screen name="Albums" component={albumsScreen} />
          </Tab_top.Navigator>
          {login_data['song_id']!=''?
            <View style={{borderTopColor:"#000000",borderTopWidth:1,width:500}}>{sub_player({navigation})}</View>
            :
            null
          }
        </View>
      );
    }
    const songScreen=({})=> {
      var song = desboard1.user_like[0].song_like;
      console.log('song', song);
      const renderItem = ({item}) => (
        <View
          style={{flex: 1,flexDirection: 'row',marginTop: 5,borderBottomColor: '#000000',borderBottomWidth: 1,paddingBottom: 5,}}>
          <Image
            style={{width: 50, height: 50, borderRadius: 50}}
            source={{uri: item.song_img}}/>
          <View style={{marginStart: 30}}>
            <Text onPress={() => navigate('Player', {item: item})}>
              {item.song_name}
            </Text>
            <Text>{item.artist}</Text>
          </View>
          <Image style={{width: 15, height: 15}}
              source={require('./asset/like.png')}
          />
          
        </View>
      );
      return (
        <View style={{flex: 1}}>
          <SafeAreaView style={{marginLeft: 20, marginRight: 20, marginTop: 5}}>
            <FlatList
              data={song}
              renderItem={renderItem}
              keyExtractor={(item) => item.song_id.toString()}
            />
          </SafeAreaView>
        </View>
      );
    }
    const artistScreen=({})=> {
      var artist = desboard1.user_like[0].artist_like;
      const renderItem = ({item}) => (
        <View
          style={{width: 120,borderColor: '#000000',borderWidth: 1,marginTop: 10,marginLeft: 5,marginRight: 5,alignItems: 'center',}}>
          <View style={{paddingTop: 10, paddingBottom: 5}}>
            <Image
              style={{width: 90, height: 90}}
              source={{
                uri: item.artist_img.toString(),
              }}
            />
            <View style={{flexDirection: 'row', justifyContent: 'space-between',marginTop:5}}>
              <Text style={{fontSize:10,width:70}}>{item.artist_name}</Text>
              <Image style={{width: 15, height: 15}}
                source={require('./asset/like.png')}
              />
            </View>
          </View>
        </View>
      );
      return (
        <View style={{flex: 1}}>
          <SafeAreaView style={{marginLeft: 15, marginRight: 15, marginTop: 5}}>
            <FlatList
              data={artist}
              renderItem={renderItem}
              keyExtractor={(item) => item.artist_name}
              numColumns={3}
            />
          </SafeAreaView>
        </View>
      );
    }
    const albumsScreen=({navigation}) =>{
      var albums = [
        {
          artist: 'Na',
          artist_img:
            'http://192.168.43.5:8000/media/song/31122010234/31122010234.jpg',
          like: 0,
          listen_total: 0,
          listen_week: 0,
          song_id: 31122010234,
          song_name: 'tere ast mast do nain',
        },
        {
          artist: 'Na',
          artist_img:
            'http://192.168.43.5:8000/media/song/14202010317/14202010317.png',
          like: 0,
          listen_total: 0,
          listen_week: 0,
          song_id: 14202010317,
          song_name: 'Na',
        },
      ];
      const renderItem = ({item}) => (
        // <Item title={item.artist} />
        <View
          style={{
            width: 160,
            borderColor: '#000000',
            borderWidth: 1,
            marginTop: 10,
            marginLeft: 13,
            marginRight: 13,
          }}>
          <View style={{alignItems: 'center', paddingTop: 10, paddingBottom: 5}}>
            <Image
              style={{width: 120, height: 120}}
              source={{
                uri: item.artist_img.toString(),
              }}
            />
            <Text>{item.artist}</Text>
          </View>
        </View>
      );
      return (
        <View style={{flex: 1}}>
          <SafeAreaView style={{marginLeft: 22, marginRight: 22, marginTop: 5}}>
            <FlatList
              data={albums}
              renderItem={renderItem}
              keyExtractor={(item) => item.song_id.toString()}
              numColumns={2}
            />
          </SafeAreaView>
        </View>
      );
    }

    const searchScreen=({navigation})=> {
      const [text, setText] = useState();  
      const renderItem = ({item}) => (
        <TouchableOpacity  style={{flex: 1,flexDirection: 'row',marginTop: 5,borderBottomColor: '#000000',borderBottomWidth: 1,paddingBottom: 5,}}
        onPress={() => navigate('player', {item: item,'login_data1':login_data1})}>
          <Image style={{width: 50, height: 50, borderRadius: 50}}
            source={{uri: item.song_img}}/>
          <View style={{marginStart: 30}}>
            <Text>
              {item.artist}
            </Text>
            <Text>{item.song_name}</Text>
          </View>
        </TouchableOpacity >
      );
      const artistItem = ({item}) => (
        <TouchableOpacity style={{width: 120,borderColor: '#000000',borderWidth: 1,marginTop: 2,marginLeft: 5,marginRight: 5,alignItems: 'center',paddingTop: 10, paddingBottom: 5,alignItems: 'center',}}
        onPress={() => navigate('song_list', {item: item,'login_data1':login_data1})}>
            <Image style={{width: 90, height: 90,borderRadius:50}}
              source={{
                uri: item.artist_img,
              }}
            />
            <Text>{item.artist_name}</Text>
        </TouchableOpacity>
      );
      const albumsItem = ({item}) => (
        <TouchableOpacity style={{width: 110,borderColor: '#000000',borderWidth: 1,marginTop: 2,marginLeft: 5,marginRight: 5,alignItems: 'center', paddingTop: 10, paddingBottom: 5}}>
          <Image style={{width: 90, height: 90}}
            source={{
              uri: item.artist_img.toString(),
            }}
          />
          <Text>{item.artist}</Text>
        </TouchableOpacity>
      );

      const  search_no=({s})=>{
        const { login_data} = this.state;
        console.log("s",s)
        if (s.length>=1){
          try {
            fetch('http://192.168.43.5:8000/search', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },body: JSON.stringify({
                  u_id: login_data.u_id,
                  search_text: s
                })}).then((response) => response.json()).then((responseJson) => {
                console.log('jon', responseJson);
                this.setState({song_s:true})
                this.setState({song_serach_list:responseJson})
              });
          } catch (e) {
            console.log('E', e);
          }
        }
      }
      
      
      
      return (
        <View style={{flex: 1}}>
            <TextInput style={{borderColor: 'gray',borderWidth: 1,marginTop: 7,marginLeft: 20,marginRight: 20,height: 45,}}
              editable maxLength={30} autoCompleteType="name" placeholder="Song,Artist,Albums,Play list"
              onChangeText={(text) => {
                setText(text)
                console.log("texr",text)
                search_no(text)
              }}
              defaultValue={text}
            />
            {song_s==false ? (
              <View style={{marginLeft: 20, marginRight: 20,flex:1}}>
                <SafeAreaView style={{flex: 1}}>
                  <FlatList data={desboard1.user_like[0].search} renderItem={({item}) => (
                      <TouchableOpacity style={{borderBottomColor: '#000000',borderBottomWidth: 1,marginLeft: 4,marginRight: 5,}}
                      onPress={() => {console.log('click', {item});}}>
                        <Text style={{marginLeft: 7,fontSize: 15,paddingBottom: 3,paddingTop: 3,}}>
                          {item}
                        </Text>
                      </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item}
                  />
                </SafeAreaView>
              </View>
            ) : (        
              <View style={{marginLeft: 15, marginRight: 15,flex:1}}>
                <View style={{marginTop: 5,flex:1}}>
                  <View style={{marginBottom: 5,borderBottomColor: '#20232a',borderBottomWidth: 1,}}>
                    <Text style={{}}>Song</Text>
                  </View>
                  <SafeAreaView style={{flex:1}}>
                    <FlatList style={{flex:1}}
                      data={song_serach_list.song}
                      renderItem={renderItem}
                      keyExtractor={(item) => item.song_id.toString()}/>
                  </SafeAreaView>
                </View>
                {/* Artist */}
                {/* <View style={{marginTop: 7}}>
                  <View style={{marginBottom: 5,borderBottomColor: '#20232a',borderBottomWidth: 1,}}>
                    <Text style={{}}>Artist</Text>
                  </View>
                  <SafeAreaView>
                    <FlatList
                      data={song_serach_list.artist}
                      renderItem={artistItem}
                      keyExtractor={(item) => item.artist_name.toString()}
                      horizontal={true}
                    />
                  </SafeAreaView>
                </View> */}
                {/* Albums */}
                {/* <View style={{marginTop: 7}}>
                  <View
                    style={{
                      marginBottom: 5,
                      borderBottomColor: '#20232a',
                      borderBottomWidth: 1,
                    }}>
                    <Text style={{}}>Albums</Text>
                  </View>
                  <SafeAreaView>
                    <FlatList
                      data={k.albums}
                      renderItem={albumsItem}
                      keyExtractor={(item) => item.song_id.toString()}
                      horizontal={true}
                    />
                  </SafeAreaView>
                </View> */}
                {/* playlist */}
                {/* <View style={{marginTop: 7}}>
                  <View
                    style={{
                      marginBottom: 5,
                      borderBottomColor: '#20232a',
                      borderBottomWidth: 1,
                    }}>
                    <Text style={{}}>Playlist</Text>
                  </View>
                  <SafeAreaView>
                    <FlatList
                      data={albums}
                      renderItem={albumsItem}
                      keyExtractor={(item) => item.song_id.toString()}
                      horizontal={true}
                    />
                  </SafeAreaView>
                </View> */}
              </View  >
            )}
          {login_data['song_id']!=''?
            <View style={{borderTopColor:"#000000",borderTopWidth:1,width:500}}>{sub_player({navigation})}</View>
            :
            null
          }
        </View>
      );
    }
    return(
      <Tab.Navigator>
        <Tab.Screen name="Home" component={deshboardScreen} options={{tabBarLabel: 'Home',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size}/>
            ),
          }} />
        <Tab.Screen name="Search" component={searchScreen} options={{tabBarLabel: 'Search',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="magnify" color={color} size={size}/>
            ),
          }} />
        <Tab.Screen name="Library" component={libraryScreen} options={{tabBarLabel: 'Library',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="heart-outline" color={color} size={size}/>
            ),
          }}/>
        <Tab.Screen name="Profile" component={profileScreen} options={{tabBarLabel: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account-outline" color={color} size={size}/>
            ),
          }}/>
      </Tab.Navigator>
    )
  }
}
export default home;