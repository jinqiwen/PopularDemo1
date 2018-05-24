import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Navigator,
    Image,
    View,
    DeviceEventEmitter,
    ScrollView,
    Alert,
TouchableOpacity
} from 'react-native';
import ViewUtils from '../../util/ViewUtils'
import NavigationBar from "../../common/NavigationBar";
import LanguageDao,{FLAG_LANGUAGE} from '../../expand/dao/LanguageDao'
import ArrayUtils from '../../util/ArrayUtils'
import CheckBox from 'react-native-check-box'
export default  class  CustormKeyPage extends  React.Component{
    constructor(props){
        super(props);
        // 初始化LangurageDao
        this.LanguageDao=new LanguageDao(FLAG_LANGUAGE.flag_key);
        this.chanageValues=[];//保存用户的修改
        this.state={
            dataArray:[]
        }
    }
    onSave(){
        if(this.chanageValues.length===0){
            //说明用户从来没有勾选过
            this.props.navigation.goBack();
            return ;
        }else{
            //用户修改了，就将修改的数据传入到数据库中去
            this.LanguageDao.save(this.state.dataArray);
            this.props.navigation.goBack();
        }
        /*this.props.navigation.goBack();*/

    }
    renderView(){
        if(!this.state.dataArray||this.state.dataArray.length===0)return null;
            let len=this.state.dataArray.length;
            let views=[];
            for(let i=0,l=len-2;i<l;i+=2) {
               views.push(
                   <View key={i}>
                       <View style={styles.item}>
                           {this.renderCheckBox(this.state.dataArray[i])}
                           {this.renderCheckBox(this.state.dataArray[i+1])}
                       </View>
                   <View style={styles.line}></View>
                   </View>
               )
            }
            views.push(
                <View key={len-1}>
                    <View style={styles.item}>
                        {len%2===0?this.renderCheckBox(this.state.dataArray[len-2]):null}
                        {this.renderCheckBox(this.state.dataArray[len-1])}
                    </View>
                    <View style={styles.line}></View>
                </View>
            )
            return views;
     }

    componentDidMount() {
        this.loadData()
    }
    loadData(){
      this.LanguageDao.fetch()
          .then(result=>{
             /* alert(result);*/
              this.setState({
                  dataArray:result
              })
          })
          .catch(error=>{
              console.log(error);
          })

    }
    onClick(data){
        /*取反，点击一次*/
    data.checked=!data.checked;
        ArrayUtils.updateArray(this.chanageValues,data);
    }
    renderCheckBox(data){
        let leftText=data.name;
        return <CheckBox style={{flex:1, padding:10}}
                         isChecked={data.checked}
                          onClick={()=>this.onClick(data)}
                         leftText={leftText}
                        checkedImage={<Image style={{tintColor:'#6495ED'}} source={require('./images/ic_check_box.png')} />}
                        unCheckedImage={<Image style={{tintColor:'#6495ED'}} source={require('./images/ic_check_box_outline_blank.png')}/>}
                          />
    }
    onBack(){
        if(this.chanageValues.length===0){
            this.props.navigation.goBack();
            return;
        }
        Alert.alert(
            '提示',
            '要保存修改吗?',
            [
                {text:'不保存',onPress:()=>{this.props.navigation.goBack();},style:'cancel'},
                    {text:'保存',onPress:()=>{this.onSave()}}
                ]
        )
    }
    render(){
        let rightButton=<TouchableOpacity
            onPress={()=>{
                this.onSave();
            }}
         >
            <View>
                <Text style={styles.title}>保存</Text>
            </View>
        </TouchableOpacity>
        return (<View>
           <NavigationBar
                title='自定义标签'
                leftButton={ViewUtils.getLeftButton(()=>this.onBack())}
                style={{backgroundColor:'#6495ED'}}
                rightButton={rightButton}
            />
            <ScrollView>
                {this.renderView()}
            </ScrollView>

        </View>);
    }
}
const styles =StyleSheet.create({
    container: {
        flex:1
    },
    tips:{
      fontSize:29
    },
    title:{
        fontSize:20,
        color:'white',
        flexDirection:'row',
        alignItems:'flex-end',
        justifyContent:'center',
        marginRight:10
    },
    line:{
        height:0.3,
        backgroundColor:'darkgray'

    },
    item:{
        flexDirection:'row',
        alignItems:'center'
    }

})