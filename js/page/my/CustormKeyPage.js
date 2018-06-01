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
        this.chanageValues=[];//保存用户的修改
       /* alert(this.props.navigation.getParam('flag'));*/
        this.LanguageDao=new LanguageDao(this.props.navigation.getParam('flag'));
        this.isRemoveKey=this.props.navigation.getParam('isRemoveKey')?true:false;
        this.state={
            dataArray:[]
        }
    }

    componentDidMount() {
        this.loadData()
    }
    onSave(){
        if(this.chanageValues.length===0){
            //说明用户从来没有勾选过
            this.props.navigation.goBack();
            return ;
        }
            if(this.isRemoveKey) {
             for(let i= 0,l=this.chanageValues.length;i<l;i++){
                 ArrayUtils.remove(this.state.dataArray,this.chanageValues[i])
            }
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
                   <View style={styles.line} />
                   </View>
               )
            }
            views.push(
                <View key={len-1}>
                    <View style={styles.item}>
                        {len%2===0?this.renderCheckBox(this.state.dataArray[len-2]):null}
                        {this.renderCheckBox(this.state.dataArray[len-1])}
                    </View>
                </View>
            )
            return views;
     }
    loadData(){
      this.LanguageDao.fetch()
          .then(result=>{
              this.setState({
                  dataArray:result
              })
          })
          .catch(error=>{
              console.log(error);
          })

    }
    onClick(data){
        if(!this.isRemoveKey)/*取反，点击一次*/data.checked=!data.checked;
        ArrayUtils.updateArray(this.chanageValues,data);
    }
    renderCheckBox(data){
        let leftText=data.name;
        let isChecked=this.isRemoveKey?false:data.checked;
        return <CheckBox style={{flex:1, padding:10}}
                         isChecked={data.checked}
                          onClick={()=>this.onClick(data)}
                         isChecked={isChecked}
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
        let rightButtonTitle=this.isRemoveKey?'移除':'保存';
        let title=this.isRemoveKey? '标签移除':'自定义标签';
        title=this.props.navigation.getParam('flag')===FLAG_LANGUAGE.flag_language?'自定义语言':title;
        let rightButton=<TouchableOpacity
            onPress={()=>{
                this.onSave();
            }}
         >
            <View>
                <Text style={styles.title}>{rightButtonTitle}</Text>
            </View>
        </TouchableOpacity>
        return (<View>
           <NavigationBar
                title={title}
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