import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Navigator,
    Image,
    View,
    WebView,
    TextInput,
    DeviceEventEmitter
} from 'react-native';
import NavigationBar from '../common/NavigationBar'
import ViewUtils from "../util/ViewUtils";
const URL='http://www.imooc.com'
export default  class  FavoritePage extends  React.Component{
    constructor(props){
        super(props);
        this.state={
            url:URL,
            canGoBack:false,
             title:this.props.title
        }

    }
    go(){
        this.setState({
            url:this.text
        })
    }
    goBack(){
        if(this.state.canGoBack){
            this.webView.goBack()
        }else {
            DeviceEventEmitter.emit('showText','到顶了');
        }
    }
    onBackPress(e){
        if(this.state.canGoBack){
            this.state.goBack();
        }else {
            this.props.navigation.goBack();
        }
    }

    onNavigationStateChange(navState){
        this.setState({
            canGoBack :navState.canGoBack,
            url:navState.url
        })
    }
     render(){
         return (<View style={styles.container}>
             <NavigationBar
              // title={
                /* navigator={this.props.navigator}
                 popEnabled={false}

                 leftButton={ViewUtils.getLeftButton(()=>this.onBackPress())}*/
                 title='webView的使用'
                 style={{backgroundColor:'#2196F3'}}

             />
             <View style={styles.row}>
                 <Text style={styles.tips}
                       onPress={()=>this.goBack()}
                 >
                     返回
                 </Text>
             <TextInput
                 defaultValue={URL}
                 style={styles.input}
                 onChangeText={text=>this.text=text}
             />
                 <Text style={styles.tips}
                       onPress={()=>this.go()}
                 >
                   前往
                 </Text>
             </View>

             <WebView
                 ref={webView=> this.webView=webView}
               source={{uri: this.state.url}}
                 onNavigationStateChange={(e)=>this.onNavigationStateChange(e)}
             />

         </View>);
}
}
const  styles=StyleSheet.create({
    container: {
        flex:1
    },
    tips:{
        fontSize :20
    },
    row:{
        flexDirection:'row',
        alignItems:'center',
        margin:10
    },
    input:{
        height:40,
        flex:1,
        borderWidth:1,
        margin:2
    }
})