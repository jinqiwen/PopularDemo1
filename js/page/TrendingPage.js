import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Navigator,
    Image,
    View,
    WebView,
    TextInput,
    RefreshControl,
    TouchableOpacity,
    DeviceEventEmitter, Alert, ListView
} from 'react-native';
import NavigationBar from "../common/NavigationBar";
import ViewUtils from "../util/ViewUtils";
import ArrayUtils from "../util/ArrayUtils";
import GitHubTrending from 'GitHubTrending'
import  ScrollableTabView,{ScrollableTabBar}  from 'react-native-scrollable-tab-view'
import DataRepository,{FLAG_STORAGE} from '../expand/dao/DataRepository'
import LanguageDao,{FLAG_LANGUAGE} from '../expand/dao/LanguageDao'
import TrendingCell from '../common/TrendingCell';
import Popover from '../common/Popover'
import TimeSpan from '../model/TimeSpan'
import FavoriteDao from "../expand/dao/FavoriteDao";
import Utils from '../util/Utils'
import ProjectModel from "../model/ProjectModel";
const ApI_URL='https://github.com/trending/'
import ActionUtils from '../util/ActionUtils'
import RepositoryDetail from "./RepositoryDetail";
var timeSpanTextArray=[new TimeSpan('今天','since=daily'),
new TimeSpan('本周','since=weekly'),new TimeSpan('本月','since=month')]
var favoriteDao=new FavoriteDao(FLAG_STORAGE.flag_popular);
var dataRepository= new DataRepository(FLAG_STORAGE.flag_trending)
export default  class  TrendingPage extends  Component{
    constructor(props) {
        super(props);
        this.languageDao=new LanguageDao(FLAG_LANGUAGE.flag_key)
        this.state={
            languages:[]
        }
        this.loadLanguage();
    }
    loadLanguage(){
        this.languageDao.fetch().then((languages)=> {
            if (languages) {
                this.setState({
                    languages: languages,
                });
            }
        }).catch((error)=> {

        });
    }
    onLoad(){
        let url=this.genFetchUrl(this.text);
        this.dataRepository.fetchNetRepository(url)
            .then(result=>{
              /*  alert(result);*/
                this.setState({
                    result:JSON.stringify(result)
                })
            })
            .catch(error=>{
                this.setState({
                    result:JSON.stringify(error)
                })
            })

    }

    getFetchUrl(timeSpan,category){
        return ApI_URL+category+'?'+timeSpan.searchText;
    }
    showPopover() {
        this.refs.button.measure((ox, oy, width, height, px, py) => {
            this.setState({
                isVisible: true,
                buttonRect: {x: px, y: py, width: width, height: height}
            });
        });
    }

    closePopover() {
        this.setState({isVisible: false});
    }
    renderTitleView(){
        return (<View>
            <TouchableOpacity
               ref='button'
               onPress={()=>{this.showPopover()}}
             >
               <View style={{flexDirection:'row',alignItems:'center'}}>
                   <Text
                       style={{
                           fontSize:18,
                           color:'white',
                           fontWeight:'400'
                       }}
                   >趋势</Text>
                   <Image source={require('../../res/images/ic_spinner_triangle.png')}
                          style={{width:12,height :12,marginLeft:5}}/>
               </View>
           </TouchableOpacity>
        </View>)
}

    render() {
       let navigationBar= <NavigationBar
           titleView={this.renderTitleView()}
           statusBar={{backgroundColor:'#2196F3'}}
       />
        let content =this.state.languages.length>0?
            <ScrollableTabView
                tabBarBackgroundColor="#2196F3"
                tabBarInactiveTextColor="mintcream"
                tabBarActiveTextColor="white"
                tabBarUnderlineStyle={{backgroundColor:"#e7e7e7",height:2}}
                renderTabBar={()=><ScrollableTabBar/>}
            >
                {this.state.languages.map((result,i,arr)=>{
                    let lan=arr[i];
                    return lan.checked ? <TrendingTab key={i} tabLabel={lan.name} {...this.props}/> : null;
                })}

            </ScrollableTabView>:null;
            let timeSpanView =
                <Popover
                isVisible={this.state.isVisible}
                fromRect={this.state.buttonRect}
                onClose={this.closePopover}>
                <Text>I'm the content of this popover!</Text>
              </Popover>
        return(<View style={styles.container}>
            {navigationBar}
            {content}
            {timeSpanView}
        </View>)

    }
}
/**
 * 趋势模块的头部导航
 */
class TrendingTab extends React.Component{
    constructor(props) {
        super(props);
        this.isFavoriteChanged = false;
        this.dataRepository=new DataRepository(FLAG_STORAGE.flag_trending)
        this.state={
            result:'',
            dataSource:new ListView.DataSource({rowHasChanged:(r1,r2)=>r1==r2}),
            isLoading:false,
            favoriteKeys:[],

        }
    }
    updateState(dic) {
        if (!this)return;
        this.setState(dic);
    }
    componentDidMount() {
        this.loadData()
    }
    getFetchUrl(category,timeSpan){
        return ApI_URL+category+'?'+timeSpan.searchText;
    }
    getDataSource(items) {
        return this.state.dataSource.cloneWithRows(items);
    }

    /**
     * 更新project item favorite状态
     */
    flushFavoriteState(){
        let projectModels=[];
        let items=this.items;
        //遍历用户的每项的收藏情况
        for (var i = 0, len = items.length; i < len; i++){
            //Utils.checkFavorite(items[i],this.state.favoriteKeys) ， items[i]是获取到的每一项，this.state.favoroteKeys是用户之前收藏的集合
            projectModels.push(new ProjectModel(items[i],Utils.checkFavorite(items[i],this.state.favoriteKeys)))
        }
        this.updateState({
            isLoading :false,
            dataSource:this.getDataSource(projectModels)

        })
    }
    getFavoriteKeys(){
        favoriteDao.getFavoriteKeys()
            .then(keys=>{
                if(keys){
                    //将数据库获取到的用户所有keys拿出
                    this.updateState({
                        favoriteKeys:keys
                    })
                }
                //刷新状态
                this.flushFavoriteState();
            })
            .catch(e=>{
                this.flushFavoriteState();
                console.log(error);
            })

    }
    loadData(){
        this.setState({isLoading:true});
        let url=this.getFetchUrl(this.props.tabLabel,'since=daily');
        dataRepository.fetchNetRepository(url)
            .then(result=>{
                this.items = result && result.items ? result.items : result ? result : [];
                this.getFavoriteKeys();
                /* alert(JSON.stringify(items));*/
                this.setState({
                    dataSource:this.state.dataSource.cloneWithRows(this.items),
                    isLoading:false
                })
                /*
                              if(result && result.update_date &&!this.dataRepository.checkData(result.update_date)) return this.dataRepository.fetchNetRepository(url);
                */

            })
        /* .then(items=>{

              if(!items || items.length===0)return;
               this.setState({
                   dataSource:this.state.dataSource.cloneWithRows(items)
               })
         })
         .catch(error=>{
              this.setState({
                  result:JSON.stringify(error)
              });
          })*/

    }
    /**
     * favoroteIcon的单击回调函数，处理一些数据库的操作（点击收藏和取消收藏）
     * @param item
     * @param isFavorite
     */
    onFavorite(item,isFavorite){
        if(isFavorite){  //收藏
            favoriteDao.saveFavoriteItem(item.fullName,JSON.stringify(item))
        }else{   //取消收藏
            favoriteDao.removeFavoroteItem(item.fullName)
        }
    }
  /*  onSelect(item){
        /!*alert('--'+iem);*!/
        this.props.navigation.navigate('RepositoryDetail',{item:item, ...this.props})
    }*/
  /*  onSelectRepository(projectModel){
        var item=projectModel;
        this.props.navigation.navigate('RepositoryDetail',{
            title:item.fullName,
            params:{
                projectModel:projectModel,
                parentComponent:this,
                flag:FLAG_STORAGE.flag_trending,
                ...this.props
            }

        })
    }*/
    onSelect(item){
        this.props.navigation.navigate('RepositoryDetail',{item:item, ...this.props})
    }
    /*返回每一行的结构内容*/
    renderRow(projectModel){
        //projectModel中的格式简介：1.item包括fullName，url,starCounr在内的网上获取数据，2.isFavorite包括用户是否点击：false.true
        return <TrendingCell
      /*      theme={this.state.theme}*/
            onSelect={()=>ActionUtils.onSelectRepository({
                projectModel: projectModel,
                flag: FLAG_STORAGE.flag_trending,
                ...this.props,
                onUpdateFavorite: ()=>this.onUpdateFavorite(),
            })}
            key={projectModel.item.id}
            projectModel={projectModel}
           onFavorite={(item,isFavorite)=>this.onFavorite(item,isFavorite)}
        />
    }
    render() {

        return(<View style={{flex:1}}>
            <ListView
                dataSource={this.state.dataSource}
                renderRow={(data)=>this.renderRow(data)}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.isLoading}
                        onRefresh={()=>this.loadData()}
                        colors={['#2196F3']}
                        tintColor={'#2196F3'}
                        title={'Loading...'}
                    />
                }

            />

        </View>)
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