/*
import React from 'react'
import AppNavigator from './js/navigators/AppNavigator'

export default AppNavigator;
*/
import React, { Component } from 'react';
import AppNavigator from './js/navigators/AppNavigator'
type Props = {};
export default class App extends Component<Props> {
    render() {
        return (
            <AppNavigator />
        );
    }
}