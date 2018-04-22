import React, {
  Component
} from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,

} from 'react-native'

var width = Dimensions.get('window').width

import Button from 'react-native-button'

//自定义
import NavigationBar from './../../common/NavigationBar'
import TextInputWidget from '../views/TextInputWidget'
import TextTipsWidget from '../views/TextTipsWidget'
import AV from 'leancloud-storage'
class Bill extends AV.Object {}

import Toast, {
  DURATION
} from 'react-native-easy-toast'
export default class CustomPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      bill_name:'',
      bill_desc:'',
      bill_money:'',
      repay_date:''
    }
  }

  // 渲染组件时隐藏tabbar
  componentWillMount() {
    this.props.tabBar.hide();
  }

  // 销毁组件时显示tabbar
  componentWillUnmount() {
    if(this.props.backShowTabbar){
      this.props.tabBar.show();
    }
  }

  _back(){
    this.props.navigator.pop()
    if(this.props.backShowTabbar){
      this.props.callBack()
    }

  }

  _renderNavBarButton(image) {
    return (
      <TouchableOpacity onPress={this._back.bind(this)}>
        <Image
          style={{width:9,height:15,margin:9}}
          source={image}
        />
      </TouchableOpacity>
    )
  }

  _submit() {
    var that = this

    if(that.state.bill_name === ''){
      that.refs.toast.show('账单备注不能为空')
      return
    }


    if(that.state.repay_date === ''){
      that.refs.toast.show('还款日不能为空')
      return
    }

    if(that.state.bill_money === ''){
      that.refs.toast.show('账单金额不能为空')
      return
    }

    // var Bill = AV.Object.extend('Bill');
    // 新建对象
    var bill = new Bill();
    // 设置类型
    bill.set('type','16');
    // 设置贷款方
    bill.set('bill_name',this.state.bill_name);
    bill.set('bill_desc','');
    // 设置还款日
    bill.set('repay_date',this.state.repay_date);
    // 设置账单金额
    bill.set('bill_money',this.state.bill_money);
    var date = this.state.repay_date.split('-')
    //设置年
    bill.set('year',date[0]);
    //设置月
    bill.set('month',date[1]);

    // console.log(bill)

    bill.save().then(function (todo) {
      that.refs.toast.show('保存成功')
      that.props.navigator.pop()
      // console.log('objectId is ' + todo.id);
      // Alert.alert('保存成功')
    }, function (error) {
      console.error(error);
    });

  }


  _selectType(type, value) {
    this.setState({repay_date:value})
  }

  _getInputFieldData(type, content) {
    if (type == 1) {
      this.setState({
        bill_name: content
      })
    } else if (type == 2) {
      this.setState({
        bill_money: content
      })
    }
  }

  render() {
    let tabBarHeight = 0;

    return (
      <View style={styles.container}>
        <NavigationBar
          title='手动记账'
          statusBar={{
            barStyle:'default'
          }}
          leftButton={
            this._renderNavBarButton(require('./../../../scr/images/back_icon.png'))
          }
        />


        <TextInputWidget keyBoardType='default' title='账单备注' placeholder='如：购买衣服'  inputType={1} callBackInputContent={this._getInputFieldData.bind(this)}/>
        <TextInputWidget keyBoardType='numeric' style={{marginTop:10}} title='记账金额' placeholder='如：1000' inputType={2} callBackInputContent={this._getInputFieldData.bind(this)} />
        <TextTipsWidget title='还款日' tips='请选择' type={1} selectType={this._selectType.bind(this)}/>

        <View style={styles.buttonBox}>
          <Button style={styles.btn} onPress={this._submit.bind(this)}>提交</Button>
        </View>

        <Toast ref="toast" positionValue={400}/>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f2f3',

  },

  buttonBox:{
    marginTop:100,
    marginLeft:15,
    width:width-30,
    height:40,
    backgroundColor:'#337df6',
    borderRadius:6,
    alignItems:'center'
  },
  btn:{
    height:36,
    width:width-40,
    color:'#fff',
    fontSize:15,
    paddingTop:12,
  },

})