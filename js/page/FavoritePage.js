import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    TextInput,
    ListView,
    RefreshControl,
    DeviceEventEmitter
} from 'react-native';
import NavigationBar from '../common/NavigationBar'
import ActionUtils from '../util/ActionUtils'
import ViewUtils from '../util/ViewUtils'
import {FLAG_TAB} from './HomePage'
import {FLAG_STORAGE} from '../expand/dao/DataRepository'
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import RepositoryCell from '../common/RepositoryCell'
import TrendingCell from '../common/TrendingCell'
import FavoriteDao from '../expand/dao/FavoriteDao'
import ProjectModel from '../model/ProjectModel'
import ArrayUtils from "../util/ArrayUtils";


export default  class  FavoritePage extends  React.Component {
    constructor(props) {
        super(props);
        this.state = {
           /*theme:this.props.theme,*/
            customThemeViewVisable:false
        }

    }
    render(){
      /*  var statusBar={
            backgroundColor:this.state.theme.themeColor
        }*/

        let navigationBar= <NavigationBar
          title={'收藏'}
          statusBar={{
              backgroundColor:'#2196F3'
          }}
     /*     rightButton={}*/
         /* statusBar={statusBar}*/
        />
        let content=<ScrollableTabView
            tabBarUnderlineStyle={{backgroundColor:'#e7e7e7',height:2 }}
            tabBarBackgroundColor="#2196F3"
            tabBarInactiveTextColor="mintcream"
            tabBarActiveTextColor="white"
            ref="scrollableTabView"
            renderTabBar={()=><ScrollableTabBar style={{height:40,borderWidth: 0,elevation:2}}
                                                              tabStyle={{height:39}} />}
        >
            <FavoriteTab   {...this.props} tabLabel='最热' flag={FLAG_STORAGE.flag_popular}/>
            <FavoriteTab   {...this.props} tabLabel='趋势' flag={FLAG_STORAGE.flag_trending}/>
            </ScrollableTabView>;
            return <View style={styles.container}>
                {navigationBar}
                {content}
            </View>
    }
}
class FavoriteTab  extends  Component{
    constructor(props){
        super(props);
        //记录用户取消收藏的key
        this.unFavoriteItems=[];
        this.favoriteDao=new FavoriteDao(this.props.flag);
        this.state={
            dataSource:new ListView.DataSource({rowHasChanged: (r1, r2)=>r1 !== r2}),
            isLoading:false,
            favoriteKeys:[],

        }
    }
    componentDidMount() {
        this.loadData();
    }
    //在详情页返回收藏页面时刷新列表
    componentWillReceiveProps() {
        this.loadData(false);
    }

    /**
     * isShowLoading是否显示加载视图
     * @param isShowLoading
     */
    loadData(isShowLoading){
        if(isShowLoading){
            this.setState({
                isLoading:true
            });
        }
        this.favoriteDao.getAllItems().then((items)=> {
            var resultData = [];
            //获取的所有收藏再二次包装下
            for (var i = 0, len = items.length; i < len; i++) {
                resultData.push(new ProjectModel(items[i], true));
            }
            this.setState({
                isLoading: false,
                dataSource: this.getDataSource(resultData),
            });

        }).catch((error)=>{
            this.setState({
                isLoading: false,
            })
        })
    }

    onRefresh(){
        this.loadData(true);
    }
    getDataSource(items){
        return this.state.dataSource.cloneWithRows(items);
    }

    /**
     * favorite单击回调函数
     * @param item
     * @param isFavorite
     */
    onFavorite(item,isFavorite){
        //记录用户所做的修改
        ArrayUtils.updateArray(this.unFavoriteItems,item);
        //表示用户有取消项目
        if(this.unFavoriteItems.length>0){
            if(this.props.flag===FLAG_STORAGE.flag_popular){
                //通知热门模块用户已经取消收藏了favoriteChanged_popular
               DeviceEventEmitter.emit('favoriteChanged_popular');
            }else {
                //通知趋势模块用户已经取消收藏了
                DeviceEventEmitter.emit('favoriteChanged_trending');
            }
        }
    }
    renderRow(projectModel,sectionID,rowID){
        //中间页显示的内容到底是popular还是trending，通过标示符判断下
        let CellComponent=this.props.flag===FLAG_STORAGE.flag_popular?RepositoryCell:TrendingCell;
        let {navigation}=this.props;
        return(
            <CellComponent
                key={this.props.flag===FLAG_STORAGE.flag_popular?projectModel.item.id:projectModel.item.fullName}
                projectModel={projectModel}
                //接受用户传输过来的俩个参数，一个item，一个isFavorite
                onFavorite={(item,isFavorite)=>ActionUtils.onFavorite(this.favoriteDao,item,isFavorite, this.props.flag)}
                isFavorite={true}
                {...{navigation}}
               /* onSelect={()=>ActionUtils.onSelectRepository({
                    projectModel: projectModel,
                    flag: this.props.flag,
                    ...this.props
                })}*/
            />
        )
    }
    render(){
        var content=
            <ListView
                dataSource={this.state.dataSource}
                renderRow={(e)=>this.renderRow(e)}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.isLoading}
                        onRefresh={()=>this.loadData()}
                        colors={['#2196F3']}
                        tintColor={'#2196F3'}
                        title={'Loading...'}
                    />
                }

            />;
        return(<View style={styles.container}>
                {content}
            </View>
        );


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