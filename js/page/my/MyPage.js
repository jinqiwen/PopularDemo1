import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Navigator,
    Image,
    View,
    DeviceEventEmitter
} from 'react-native';
/*import CustormKeyPage from './CustormKeyPage'*/
import NavigationBar from "../../common/NavigationBar";

export default  class  MyPage extends  React.Component{
    constructor(props){
        super(props);
    }

    render(){
 /*       const {navigation} = this.props;*/
        return (<View style={styles.container}>
            <NavigationBar
             title='欢迎'
             style={{backgroundColor:'#6495ED'}}
            />
            <Text onPress={()=>{
                    this.props.navigation.navigate('CustormKeyPage',{
                        params:{...this.props}
                    })
                }}
            >自定义标签</Text>


            <Text onPress={()=>{
                this.props.navigation.navigate('SortKeyPage',{
                    params:{...this.props}
                })
            }}
            >标签排序</Text>
            <Text
                isRemoveKey={true}
                onPress={()=>{
                this.props.navigation.navigate('CustormKeyPage',{
                   params: {
                       ...this.props,

                   }, isRemoveKey: true
                })
            }}
            >标签移除</Text>
        </View>);
    }
}
const styles =StyleSheet.create({
    container: {
        flex:1
    }
})