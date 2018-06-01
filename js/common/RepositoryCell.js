/*
渲染每一行的数据
*/
import React from 'react';
import {
    StyleSheet,
    Text,
    Navigator,
    Image,
    View,
    DeviceEventEmitter,
    TouchableOpacity
} from 'react-native';

export default  class RepositoryCell extends React.Component{
    constructor(props){
        super(props);
         this.state={
             isFavorite:this.props.projectModel.isFavorite,
             favoriteIcon:this.props.projectModel.isFavorite?require('../../res/images/ic_unstar_transparent.png')
                 : require('../../res/images/ic_unstar_transparent.png')
         }
    }
    setFavoriteState(isFavorite){
        this.props.projectModel.isFavorite = isFavorite;
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
        this.props.onFavorite(this.props.projectModel.item,!this.state.isFavorite)
    }
     render(){
         let isFavorite=!this.state.isFavorite;
         let item=this.props.projectModel.item?this.props.projectModel.item:this.props.projectModel;
        let favoriteButton=<TouchableOpacity
             onPress={()=>this.onPressFavorite()}
        >
            <Image
                style={{width:22,height:22,tintColor:'#2196F3'}}
                source={this.state.favoriteIcon}

            />
            </TouchableOpacity>
         return  <TouchableOpacity style={styles.container}
                                  onPress={this.props.onSelect}
         >
         <View style={styles.cell_container}>
             <Text style={styles.title}>{item.full_name}</Text>
             <Text style={styles.description}>{item.description}</Text>
             <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                 <Text>Author:</Text>
                 <Image
                     style={{height:22, width:22}}
                     source={{uri:item.owner.avatar_url}}
                 />
                </View>
                 <View style={{flexDirection:'row',alignItems:'center'}}>
                     <Text>Stars:</Text>
                     <Text>{item.stargazers_count}</Text>
                 </View>
                 {favoriteButton}
             </View>
         </View>
         </TouchableOpacity>
     }
}
const styles=StyleSheet.create({
    constiner:{
     flex:1
    },
    title: {
        fontSize: 16,
        marginBottom: 2,
        color: '#212121'
    },
    description:{
        fontSize:14,
        marginBottom:2,
        color:'#757575',
        borderRadius:2
    },
    cell_container:{
    backgroundColor:'white',
        padding:10,
        marginLeft:5,
        marginRight:5,
        marginVertical:3,
        borderWidth:0.5,
        borderColor:'#dddddd',
        shadowColor:'gray',
        shadowOffset:{width:0.5, height:0.5},
        shadowOpacity:0.4,
        shadowRadius:1,
        elevation:2

    }
})


