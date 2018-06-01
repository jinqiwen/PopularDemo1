import React from 'react';
import {View,Text,TextInput,StyleSheet,ListView,RefreshControl,DeviceEventEmitter} from 'react-native'
import NavigationBar from '../common/NavigationBar'
import DataRepository,{FLAG_STORAGE} from '../expand/dao/DataRepository'
import RepositoryCell from '../common/RepositoryCell';
import LanguageDao,{FLAG_LANGUAGE} from '../expand/dao/LanguageDao'
import FavoriteDao from '../expand/dao/FavoriteDao'
import ProjectModel from '../model/ProjectModel'
import ActionUtils from '../util/ActionUtils'
import Utils from '../util/Utils'
import  ScrollableTabView,{ScrollableTabBar}  from 'react-native-scrollable-tab-view'
const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
//为什么要创建全局的dao ,原因在于这样可以在每个页签下使用这个dao
var favoriteDao=new FavoriteDao(FLAG_STORAGE.flag_popular);
export default  class PopularPage extends React.Component{
    constructor(props) {
        super(props);
        this.languageDao=new LanguageDao(FLAG_LANGUAGE.flag_key)
        this.dataRepository=new DataRepository(FLAG_STORAGE.flag_popular)
        this.state={
            languages:[]
        }
    }
    loadData(){
        this.languageDao.fetch()
            .then(result=>{
                this.setState({
                    languages:result
                })
            })
            .catch(error=>{
                console.log(error);
            })

    }
    componentDidMount() {
     this.loadData();
    }
   onLoad(){
        let url=this.genFetchUrl(this.text);
        this.dataRepository.fetchNetRepository(url)
            .then(result=>{
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
    genFetchUrl(key){
        return URL+key+QUERY_STR;
   }
    render() {
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
                    return lan.checked ? <PopularTab key={i} tabLabel={lan.name} {...this.props}/> : null;
                })}

            </ScrollableTabView>:null;
        return(<View style={styles.container}>
            <NavigationBar
              title="最热"
              statusBar={{
                backgroundColor:'#2196F3'
            }}
            />

            {content}
        </View>)
    }
}

/**
 * 最热模块的头部导航
 */
class PopularTab extends React.Component{
    constructor(props) {
        super(props);
        this.isFavoriteChanged=false;
        this.dataRepository=new DataRepository()
        this.state={
            result:'',
            dataSource:new ListView.DataSource({rowHasChanged:(r1,r2)=>r1==r2}),
            isLoading:false,
            favoriteKeys:[]
        }
    }
    FavoriteChanged(){
        this.isFavoriteChanged = true;
    }
    componentDidMount() {
        this.listener = DeviceEventEmitter.addListener('favoriteChanged_popular',this.FavoriteChanged());
        this.loadData();
    }
    // 在componentDidMount执行之后执行
    componentWillUnmount() {
        super.componentWillUnmount();
         if(this.listener){
            this.listener.remove();
        }
    }
    componentWillReceiveProps() {
  /*      if(this.isFavoriteChanged){//如果收藏的项目有改变的话
            this.isFavoriteChanged=false;
            this.getFavoriteKeys();//刷新当前页面
        }*/
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
                 })

    }
    getDataSource(items) {
        return this.state.dataSource.cloneWithRows(items);
    }
    updateState(dic){
        if(!this) return;
        this.setState(dic);
    }
    loadData(){
        this.setState({isLoading:true});
        let url=URL+this.props.tabLabel+QUERY_STR;
       this.dataRepository.fetchNetRepository(url)
            .then(result=>{
                 this.items = result && result.items ? result.items : result ? result : [];
                this.getFavoriteKeys()
              /*if(result && result.update_date &&!this.dataRepository.checkData(result.update_date)) return this.dataRepository.fetchNetRepository(url);
*/
            })
          .then(items=>{
                if(!items || items.length===0)return;
                this.items=items;
              this.getFavoriteKeys()
           })
           .catch(error=>{
               console.log(error);
                this.updateState({
                    isLoading:false
                })
            })

    }
    onSelect(item){
        this.props.navigation.navigate('RepositoryDetail',{item:item, ...this.props})
    }

    /**
     * favoroteIcon的单击回调函数，处理一些数据库的操作（点击收藏和取消收藏）
     * @param item
     * @param isFavorite
     */
     onFavorite(item,isFavorite){
           if(isFavorite){  //收藏
               favoriteDao.saveFavoriteItem(item.id.toString(),JSON.stringify(item))
           }else{   //取消收藏
               favoriteDao.removeFavoroteItem(item.id.toString())
           }
    }

    /*返回每一行的结构内容*/
    renderRow(projectModel){
        return <RepositoryCell
            onSelect={()=>this.onSelect(projectModel)}
               key={projectModel.item.id}
             projectModel={projectModel}
            //接受用户传输过来的俩个参数，一个item，一个isFavorite
            onFavorite={(item,isFavorite)=>this.onFavorite(item,isFavorite)}
        />
    }
    render() {
        return(<View style={{flex:1}}>
       <ListView
           dataSource={this.state.dataSource}
           renderRow={(projectModel)=>this.renderRow(projectModel)}
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
    tips:{
        fontSize:29
    },
    container:{
        flex:1
    }

})