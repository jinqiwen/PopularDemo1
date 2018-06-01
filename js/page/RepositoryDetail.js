import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Navigator,
    Image,
    View,
    WebView,
    TouchableOpacity,
    DeviceEventEmitter, Alert
} from 'react-native';
import NavigationBar from "../common/NavigationBar";
import ViewUtils from "../util/ViewUtils";
import ArrayUtils from "../util/ArrayUtils";
const TRENDING_URL='http://github.com/'
export default  class  RepositoryDetail extends  Component{
    constructor(props){
        super(props);
        /*alert(this.props.navigation.getParam('item'));*/
       /* let item= this.props.navigation.getParam('item');*/
        var item=this.props.navigation.getParam('item');
        alert(JSON.stringify(item));
        this.url=item.html_url?this.props.navigation.getParam('item').html_url
        :TRENDING_URL+item.fullName;
        let title=item.full_name?this.props.navigation.getParam('item').full_name
        :item.fullName;
        this.state={
            url:this.url,
            canGoBack:false,
            title:title,
            isFavorite:item.isFavorite,
            favoriteIcon: item.isFavorite ? require('../../res/images/ic_star_navbar.png') : require('../../res/images/ic_unstar_navbar.png'),

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
    renderRightButton(){
        return <TouchableOpacity>
          <Image
              source={{}}
              style={styles}
          />
        </TouchableOpacity>
    }
    render(){
        return (<View style={styles.container}>
            <NavigationBar
                title={this.state.title}
                leftButton={ViewUtils.getLeftButton(()=>this.onBack())}
                style={{backgroundColor:'#6495ED'}}
               rightButton={this.renderRightButton()}
            />
            <WebView
                ref={webView=> this.webView=webView}
                source={{uri: this.state.url}}
                onNavigationStateChange={(e)=>this.onNavigationStateChange(e)}
                startInLoadingState={true}

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