import React from 'react';
import {View,Text,TextInput,StyleSheet,ListView,RefreshControl} from 'react-native'
import NavigationBar from '../common/NavigationBar'
import DataRepository from '../expand/dao/DataRepository'
import RepositoryCell from '../common/RepositoryCell';
import LanguageDao,{FLAG_LANGUAGE} from '../expand/dao/LanguageDao'
import ActionUtils from '../util/ActionUtils'
import  ScrollableTabView,{ScrollableTabBar}  from 'react-native-scrollable-tab-view'
const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
export default  class PopularPage extends React.Component{
    constructor(props) {
        super(props);
        this.languageDao=new LanguageDao(FLAG_LANGUAGE.flag_key)
        this.dataRepository=new DataRepository()
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
                alert(result);
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
        this.dataRepository=new DataRepository()
        this.state={
            result:'',
            dataSource:new ListView.DataSource({rowHasChanged:(r1,r2)=>r1==r2}),
            isLoading:false
        }
    }

    componentDidMount() {
        this.loadData()
    }
    loadData(){
        this.setState({isLoading:true});
        let url=URL+this.props.tabLabel+QUERY_STR;
       this.dataRepository.fetchNetRepository(url)
            .then(result=>{
                let items = result && result.items ? result.items : result ? result : [];
              /* alert(JSON.stringify(items));*/
                this.setState({
                    dataSource:this.state.dataSource.cloneWithRows(items),
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
    onSelect(item){
        /*alert('--'+item);*/
        this.props.navigation.navigate('RepositoryDetail',{item:item, ...this.props})
    }
    /*返回每一行的结构内容*/
    renderRow(data){
        return <RepositoryCell
            onSelect={()=>this.onSelect(data)}
               key={data.id}
               data={data} />
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
    tips:{
        fontSize:29
    },
    container:{
        flex:1
    }

})