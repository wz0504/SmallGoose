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
AV.Object.register(Bill)

import Toast, {
  DURATION
} from 'react-native-easy-toast'

export default class CreditCardPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      card_number:'',
      carder_name:'',
      repay_date:'',
      bill_money:'',
    }
  }

  // 渲染组件时隐藏tabbar
  componentWillMount() {
    this.props.tabBar.hide();
  }



  _renderNavBarButton(image) {
    return (
      <TouchableOpacity onPress={()=>{this.props.navigator.pop()}}>
        <Image
          style={{width:9,height:15,margin:9}}
          source={image}
        />
      </TouchableOpacity>
    )
  }

  _submit() {
    console.log('submit')

    var that = this

    if(that.state.card_number === ''){
      that.refs.toast.show('银行卡后四位不能为空')
      return
    }

    if(that.state.card_number.length !== 4){
      that.refs.toast.show('请输入正确银行卡号')
      return
    }

    if(that.state.carder_name === ''){
      that.refs.toast.show('持卡人不能为空')
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
    bill.set('type',this.props.item.type.toString());
    // 设置银行卡后4位
    bill.set('bill_name',this.state.card_number);
    // 设置银行卡持卡人
    bill.set('bill_desc',this.state.carder_name);
    // 设置还款日
    bill.set('repay_date',this.state.repay_date);
    // 设置账单金额
    bill.set('bill_money',this.state.bill_money);

    var date = this.state.repay_date.split('-')

    //设置年
    bill.set('year',date[0]);
    //设置月
    bill.set('month',date[1]);

    console.log(bill)

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
    // var t = '点击了' + type + value
    this.setState({repay_date:value})

  }

  _getInputFieldData(type, content) {
    // console.log(type, content)
    if (type == 1) {
      this.setState({
        card_number: content
      })
    } else if (type == 2) {
      this.setState({
        carder_name: content
      })
    } else if (type == 3) {
      this.setState({
        bill_money: content
      })
    }

  }

  render() {

    return (
      <View style={styles.container}>
        <NavigationBar
          title={this.props.item.title}
          statusBar={{
            barStyle:'default'
          }}
          leftButton={
            this._renderNavBarButton(require('./../../../scr/images/back_icon.png'))
          }
        />

        <TextInputWidget keyBoardType='number-pad' title='信用卡后四位' placeholder='如：1287' inputType={1} callBackInputContent={this._getInputFieldData.bind(this)}/>
        <TextInputWidget keyBoardType='default' title='持卡人姓名' placeholder='如：张三'  inputType={2} callBackInputContent={this._getInputFieldData.bind(this)}/>
        <TextTipsWidget style={{marginTop:10}} title='还款日' tips='请选择' type={1} selectType={this._selectType.bind(this)}/>
        <TextInputWidget keyBoardType='numeric' style={{marginTop:10}} title='账单金额' placeholder='如：1000' inputType={3} callBackInputContent={this._getInputFieldData.bind(this)} />

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
    marginTop:50,
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