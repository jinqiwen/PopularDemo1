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
import SortKeyPage from '../page/my/SortKeyPage'
import RepositoryDetail from '../page/RepositoryDetail'
type Props = {};
/*注冊導航器*/

const AppNavigator = StackNavigator({
    HomePage:{
        screen: HomePage
    },
    RepositoryDetail:{
    screen: RepositoryDetail
    },

    TrendingPage: {
        screen: TrendingPage
    },
    CustormKeyPage: {
        screen: CustormKeyPage
    },
    SortKeyPage:{
        screen:SortKeyPage
    }
}, {
    navigationOptions: {
        header: null
    }

})
export default AppNavigator;

