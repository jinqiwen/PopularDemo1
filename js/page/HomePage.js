/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Navigator,
    Image,
    View,
    DeviceEventEmitter
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import ViewPropTypes from "react-native-tab-navigator/config/ViewPropTypes";
export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state={
            selectedTab:'tb_popular'

        }
    }

    render() {
        return (<View style={styles.container}>
         {/*   <TabNavigator>
            <TabNavigator.Item
                title="最热"
                    selected={this.state.selectedTab==='tb_popular'}
                renderSelectedIcon={()=><Image style={styles.image} source={require('')}/>}
                renderIcon={()=><Image style={[styles.image,{tintColor = {}}]} source={require('')}/>}
                selectedTitleStyle={{color:'red '}}
                onPress={()=>{setState({selectedTab:'tb_popular'})}}>
            </TabNavigator.Item>
            </TabNavigator>*/}
        </View>);
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        height: 26,
        width: 26,
    }
});

