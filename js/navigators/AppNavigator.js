/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {StackNavigator} from 'react-navigation';
import HomePage from '../page/HomePage'
import TrendingPage from '../page/TrendingPage'
import CustormKeyPage from '../page/my/CustormKeyPage'
type Props = {};
/*注冊導航器*/

const AppNavigator = StackNavigator({
    HomePage:{
        screen: HomePage
    },
    TrendingPage: {
        screen: TrendingPage
    },
    CustormKeyPage: {
        screen: CustormKeyPage
    }

}, {
    navigationOptions: {
        header: null
    }

})
export default AppNavigator;

