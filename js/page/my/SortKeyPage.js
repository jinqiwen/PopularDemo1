import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Navigator,
    Image,
    View,
    TouchableHighlight,
    DeviceEventEmitter,
    Alert
} from 'react-native';
import  LanguageDao,{FLAG_LANGUAGE} from '../../expand/dao/LanguageDao'
import SortableListView  from 'react-native-sortable-listview'
import ArrayUtils from "../../util/ArrayUtils";
import NavigationBar from "../../common/NavigationBar";
import ViewUtils from "../../util/ViewUtils";
export default  class SortKeyPage  extends React.Component{
    constructor(props){
        super(props);
       this.dataArray=[];//从数据库中读取的所有数组
       this.sotResultArray=[];//排序之后新生成的数组
       this.originalCheckedArray=[];//记录上一次排序的顺序
       this.state={
           checkedArray: [] //已订阅的标签删选出来
       }
    }

    componentDidMount() {
      this.languageDao=new LanguageDao(FLAG_LANGUAGE.flag_key);
      this.loadData();
    }

    /**
     * 加载数据库初始化数组，然后找出用户勾选的数组
     */
    loadData(){
         this.languageDao.fetch().then((data)=>{
             this.getCheckedItems(data);
         }).catch((error)=>{
             console.log(error);
         })
    }


    /**
     *从数据库原始数组中遍历出用户勾选的数组内容
     * @param 数据库原始数组
     */
    getCheckedItems(dataArray){
        //保存一份，便于后面更改
        this.dataArray=dataArray;
        let checkedArray=[];//保存用户已经订阅的标签
        for (let i =0,j=dataArray.length;i<j;i++){
              let data=dataArray[i];
              if(data.checked)checkedArray.push(data);
        }
        this.setState({
            checkedArray:checkedArray
        })
        this.originalCheckedArray=ArrayUtils.clone(checkedArray);
    }
   onBack(){
       if(ArrayUtils.isEqual(this.originalCheckedArray,this.state.checkedArray)){
           this.props.navigation.goBack();
           return;
       }
        Alert.alert(
            '提示',
            '是否保存修改吗?',
            [
                {text:'否',onPress:()=>{this.props.navigation.goBack();},style:'cancel'},
                {text:'是',onPress:()=>{this.onSave(true)}}
            ]
        )
    }
    getSortResult(){
        this.sortResultArray=ArrayUtils.clone(this.dataArray);
        for(let i=0,l=this.originalCheckedArray.length;i<l;i++){
            let item= this.originalCheckedArray[i];
            let index= this.dataArray.indexOf(item);
            this.sortResultArray.splice (index,1,this.state.checkedArray[i]);
        }
    }
    onSave(haChecked){
        if(!haChecked) {
            //用户之前勾选的选项数组和现在勾选的选项数组之间的比较
            if (ArrayUtils.isEqual(this.originalCheckedArray, this.state.checkedArray)) {
                this.props.navigation.goBack();
                return;
            }
        }
            this.getSortResult();
            this.languageDao.save(this.sortResultArray);
            this.props.navigation.goBack();


    }
    render(){
        let navigator= <NavigationBar
            title='排序'
            leftButton={ViewUtils.getLeftButton(()=>this.onBack())}
            style={{backgroundColor:'#6495ED'}}
            rightButton={ViewUtils.getRightButton('保存',()=>this.onSave())}
        />
        return (<View style={styles.container}>
            {navigator}
            <SortableListView
            style={{flex:1}}
            data={this.state.checkedArray}
            order={Object.keys(this.state.checkedArray)}
            onRowMoved={(e) => {
                this.state.checkedArray.splice(e.to, 0, this.state.checkedArray.splice(e.from, 1)[0]);
                this.forceUpdate();
            }}
            renderRow={row=><SortCell data={row}  /> }
        />
        </View>);
    }
}

/**
 * 排序的每一行
 */
class SortCell extends Component{
    render(){
        return <TouchableHighlight
            underlayColor={'#eee'}
            style={this.props.data.checked? styles.item:styles.hidden}
            {...this.props.sortHandlers}>
             <View style={{marginLeft:10, flexDirection:'row'}} >
                 <Image source={require('./images/ic_sort.png')} style={{
                     opacity: 1,
                     width: 16,
                     marginRight: 10,
                     tintColor:'#2196F3'
                 }} />
               <Text>{this.props.data.name}</Text>
             </View>

        </TouchableHighlight>
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f2f2'
    },
    hidden: {
        height: 0
    },
    item: {
        backgroundColor: "#F8F8F8",
        borderBottomWidth: 1,
        borderColor: '#eee',
        height: 50,
        justifyContent: 'center'
    },
    line: {
        flex: 1,
        height: 0.3,
        backgroundColor: 'darkgray',
    },
})

