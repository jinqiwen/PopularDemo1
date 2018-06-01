import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Navigator,
    Image,
    View,
    WebView,
    TextInput,
    DeviceEventEmitter, Alert
} from 'react-native';
import NavigationBar from "../common/NavigationBar";
import ViewUtils from "../util/ViewUtils";
import ArrayUtils from "../util/ArrayUtils";
import GitHubTrending from 'GitHubTrending'
const URL='https://github.com/trending/'
export default  class  TrendingText extends  Component{
    constructor(props){
        super(props);
    this.trending=new GitHubTrending();
     this.state={
         result:''
     }
    }
    onBack(){
        if(this.state.canGoBack){
            this.webView.goBack()
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
    goLoad(){
    let url= URL+this.text;
     this.trending.fetchTrending(url)
         .then(result=>{
         this.setState({
           result:JSON.stringify(result)
         })
         }).catch(error=>{
             this.setState({
                 result:JSON.stringify(error)
             })

     })
    }

    render(){
        return (<View style={styles.container}>
            <NavigationBar
                title='GithubTrending的使用'
                leftButton={ViewUtils.getLeftButton(()=>this.onBack())}
                style={{backgroundColor:'#6495ED'}}
                /* rightButton={rightButton}*/
            />
            <View style={styles.row}>
                <Text style={styles.tips}
                      onPress={()=>this.goLoad()}
                >
                    加载数据
                </Text>
                <Text style={{flex:1}}>
                    {this.state.result}
                </Text>
            </View>
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