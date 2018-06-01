/**
 *
 *
 * @flow
 */
'use strict';

import React, {Component} from 'react'
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert,
} from 'react-native'
import HTMLView from 'react-native-htmlview'
export default class TrendingCell extends Component {
    constructor(props){
        super(props);
        alert(JSON.stringify(this.props.projectModel));
        this.state={
            isFavorite:this.props.projectModel.isFavorite,
            favoriteIcon:this.props.projectModel.isFavorite?require('../../res/images/ic_unstar_transparent.png')
                : require('../../res/images/ic_unstar_transparent.png')
        }
    }
    setFavoriteState(isFavorite){
        this.setState({
            isFavorite:isFavorite,
            favoriteIcon:isFavorite? require('../../res/images/ic_star.png')
                : require('../../res/images/ic_unstar_transparent.png')
        })
    }

    componentWillReceiveProps(nextProps) {
        this.setFavoriteState(nextProps.projectModel.isFavorite)

    }

    /**
     * 当用户点击收藏图标
     */
    onPressFavorite(){
        this.setFavoriteState(!this.state.isFavorite);
        //当用户点击列表项时，向PopularPage页面发送消息，从而让popularPage处理逻辑
        this.props.onFavorite(this.props.projectModel.fullName,!this.state.isFavorite)
    }
    render(){

        let isFavorite=!this.state.isFavorite;
        let item=this.props.projectModel.item?this.props.projectModel.item:this.props.projectModel;
       /* alert(JSON.stringify(this.props.projectModel))*/
        let favoriteButton= this.props.projectModel.item?<TouchableOpacity
            style={{padding:6}}
            onPress={()=>this.onPressFavorite()} underlayColor='transparent'>
            <Image
                ref='favoriteIcon'
                style={{width:22,height:22,tintColor:'#2196F3'}}
                source={this.state.favoriteIcon}/>
        </TouchableOpacity>:null;
        var description='<p>'+item.description+'</p>';
        return   <TouchableOpacity
            onPress={this.props.onSelect}
            style={styles.container}
        >
            <View style={styles.cell_container}>
                <Text style={styles.title}>{item.fullName}</Text>
                <HTMLView
                    value={description}
                    onLinkPress={(url) => {
                    }}
                    stylesheet={{
                        p:styles.description,
                        a:styles.description,
                    }}
                />
                <Text style={[styles.description, {fontSize: 14}]}>
                    {item.meta}
                </Text>
                <View style={styles.row}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={styles.author}>Built by  </Text>
                        {item.contributors.map((result, i, arr) => {
                            return <Image
                                key={i}
                                style={{width: 22, height: 22,margin:2}}
                                source={{uri: arr[i]}}
                            />
                        })
                        }
                    </View>
                    {favoriteButton}
                </View>


            </View>
        </TouchableOpacity>
    }
}
const styles=StyleSheet.create({
    container:{
        flex:1
    },
    row: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        marginBottom: 2,
        color: '#212121'
    },
    description: {
        fontSize: 14,
        marginBottom: 2,
        color: '#757575'
    },
    cell_container: {
        backgroundColor: 'white',
        padding: 10,
        marginLeft: 5,
        marginRight: 5,
        marginVertical: 3,
        borderColor: '#dddddd',
        borderWidth: 0.5,
        borderRadius: 2,
        shadowColor: 'gray',
        shadowOffset: {width:0.5, height: 0.5},
        shadowOpacity: 0.4,
        shadowRadius: 1,
        elevation:2
    },
    author: {
        fontSize: 14,
        marginBottom: 2,
        color: '#757575'
    },
})