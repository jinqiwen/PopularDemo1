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
import TabNavigator from 'react-native-tab-navigator'

import ThemeFactory,{ThemeFlags} from '../../res/styles/ThemeFactory'
import TrendingPage from './TrendingPage'
import FavoritePage from './FavoritePage'
import MyPage from './my/MyPage'
import PopularPage from './PopularPage';
import BaseComponent from "./BaseComponent";
export const EVENT_TYPE_HOME_TAB_SELECT = "home_tab_select";
export const FLAG_TAB = {
    flag_popularTab: 'tb_popular',
    flag_trendingTab: 'tb_trending',
    flag_favoriteTab: 'tb_favorite',
    flag_my: 'tb_my'
};
export default class HomePage extends BaseComponent {
    constructor(props) {
        super(props);
      /*  this.params = this.props.navigation.state.params;*/
        this.state={
            selectedTab:'tb_popular',
           /* theme: this.params.theme|| ThemeFactory.createTheme(ThemeFlags.Default),*/
        }
    }
    onTabClick(from,to){
        this.setState({selectedTab: to})
        DeviceEventEmitter.emit(EVENT_TYPE_HOME_TAB_SELECT,from,to)
    }
    _renderTab(Component, selectedTab, title, renderIcon){
        return<TabNavigator.Item
                title={title}
                selected={this.state.selectedTab===selectedTab}
                renderSelectedIcon={()=><Image style={styles.image} source={renderIcon}/>}
            /*    selectedTitleStyle={this.state.theme.styles.selectedTitleStyle}*/
                renderIcon={()=><Image style={styles.image} source={renderIcon}/>}
                selectedTitleStyle={{color:'red '}}
                onPress={()=>this.onTabClick(this.state.selectedTab, selectedTab)}>
                <Component {...this.props}  />
            </TabNavigator.Item>
    }

    render() {
        return (<View style={styles.container}>
            <TabNavigator>
            {this._renderTab(PopularPage,FLAG_TAB.flag_popularTab,'最熱',require('../../res/images/ic_polular.png'))}
            {this._renderTab(TrendingPage, FLAG_TAB.flag_trendingTab, '趋势', require('../../res/images/ic_trending.png'))}
            {this._renderTab(FavoritePage, FLAG_TAB.flag_favoriteTab, '收藏', require('../../res/images/ic_favorite.png'))}
            {this._renderTab(MyPage, FLAG_TAB.flag_my,'我的', require('../../res/images/ic_my.png'))}
            </TabNavigator>
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

