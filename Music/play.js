import Sound from 'react-native-sound';
import AsyncStorage from '@react-native-community/async-storage';

var sound1


export function load(file){
    console.log("ysssssssssssssssssssssss",file)
    sound1 = new Sound(file, '',
    (error, sound) => {
        console.log(error,sound)   
  });
}
export function get_sound_function(){
    return sound1
}
export function load_and_play(file){
    sound1 = new Sound(file, '',
    (error, sound) => {
        console.log(error,sound)
        sound1.play(() => {
            sound1.release();
            });
        
  });
}
export function play1(){
    console.log("play")
    sound1.play(() => {
        sound1.release();
    });
}
export function stop1(){
    console.log("stop")
    sound1.stop()
}
export function pause1(){
    console.log("pause")
    sound1.pause();
}
export function duration(){
    var k=sound1.getDuration();
    console.log("k",k)
    // console.log("getCurrentTime",sound1.getCurrentTime())
    // sound1.getCurrentTime((seconds) => {
    //     console.log("so",seconds);
    // //     this.setState({
    // //         currentTime: seconds
    // //    })
    // });
    return k
}
export function get_play_time(){
    
    sound1.getCurrentTime((seconds) => {
        console.log("so",seconds);
        return seconds
        // return seconds
        
    //     this.setState({
    //         currentTime: seconds
    //    })
    });
    // console.log("ok",sound1.getCurrentTime())
    // return 'kk'
    
}


export function next(){
    AsyncStorage.multiGet(['u_id','song_name','artist_name','song_id','song_img','is_like','artist_or_playlist_play','next_list','pre_list','suffer','repeat_one','play']).then((data) => {
      var l={
        "u_id":data[0][1],
        "song_name":data[1][1],
        "artist_name":data[2][1],
        "song_id":data[3][1],
        "song_img":data[4][1],
        "is_like":data[5][1],
        "artist_or_playlist_play":data[6][1],
        "next_list":data[7][1],
        "pre_list":data[8][1],
        "suffer":data[9][1],
        "repeat_one":data[10][1],
        'play':data[11][1]
      }
      console.log("next",l)
      console.log("next new",JSON.parse(data[7][1]))



    });
}
export function pre(){
    AsyncStorage.multiGet(['u_id','song_name','artist_name','song_id','song_img','is_like','artist_or_playlist_play','next_list','pre_list','suffer','repeat_one','play']).then((data) => {
        var l={
          "u_id":data[0][1],
          "song_name":data[1][1],
          "artist_name":data[2][1],
          "song_id":data[3][1],
          "song_img":data[4][1],
          "is_like":data[5][1],
          "artist_or_playlist_play":data[6][1],
          "next_list":data[7][1],
          "pre_list":data[8][1],
          "suffer":data[9][1],
          "repeat_one":data[10][1],
          'play':data[11][1]
        }
        console.log("pre",l)
      });
}