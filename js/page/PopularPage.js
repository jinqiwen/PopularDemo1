import React from 'react';


import {View,Text,TextInput,StyleSheet,ListView,RefreshControl} from 'react-native'
import NavigationBar from '../common/NavigationBar'
import DataRepository from '../expand/dao/DataRepository'
import RepositoryCell from '../common/RepositoryCell';
import  ScrollableTabView,{ScrollableTabBar}  from 'react-native-scrollable-tab-view'
const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
export default  class PopularPage extends React.Component{
    constructor(props) {
        super(props);
        this.dataRepository=new DataRepository()
        this.state={
            result:''
        }
    }
   onLoad(){
        let url=this.getUrl(this.text);
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
   getUrl(key){
        return URL+key+QUERY_STR;
   }
    render() {
        return(<View style={styles.container}>
            <NavigationBar
              title="最热"
              statusBar={{
               backgroundColor:'#2196F3'
              }}

             /* style={{backgroundColor:'#6495ED'}}*/
            />
          <ScrollableTabView
              tabBarBackgroundColor="#2196F3"
              tabBarInactiveTextColor="mintcream"
              tabBarActiveTextColor="white"
              tabBarUnderlineStyle={{backgroundColor:"#e7e7e7",height:2}}
             renderTabBar={()=><ScrollableTabBar/>}
          >
              <PopularTab tabLabel={"java"}>java</PopularTab>
              <PopularTab tabLabel={"ios"}>ios</PopularTab>
              <PopularTab tabLabel={"Android"}>Android</PopularTab>
              <PopularTab tabLabel={"JavaScript"}>javaScript</PopularTab>
          </ScrollableTabView>
        </View>)
    }
}
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
               /* alert(result);*/
                this.setState({
                    dataSource :this.state.dataSource.cloneWithRows(result.items),
                     isLoading:false
                })
            })
            .catch(error=>{
                this.setState({
                    result:JSON.stringify(error)
                })
            })

    }
    /*返回每一行的结构内容*/
    renderRow(data){
        return <RepositoryCell data={data}/>
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