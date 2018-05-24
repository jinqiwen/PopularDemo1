import React, {Component} from 'react';
import {
    DeviceEventEmitter
} from 'react-native';
export default  class  BaseComponent extends React.Component{
    constructor(props){
        super(props);
        this.state={
            theme:this.props.theme
        }
    }
}