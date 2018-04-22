import React, {
  Component
} from 'react'
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
} from 'react-native'

import moment from 'moment'

import Swipeout from 'react-native-swipeout'

var width = Dimensions.get('window').width

import AV from 'leancloud-storage'

export default class DetailListItem extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  _deleteItem(){
    var that = this
    console.log('删除')
    var bill = this.props.item
    var id = bill.id


    var todo = AV.Object.createWithoutData('Bill', id);
    todo.destroy().then(function (success) {
      console.log('删除成功')
      that.props.delete('success')
    }, function (error) {
      // 删除失败
      console.log('删除失败')
      that.props.delete('failed')
    });

  }

  _getBillStatus(){
    console.log('_getBillStatus')
    var bill = this.props.item
    var currentDate = moment().format('YYYY-MM-DD')
    var currentYear = parseInt(currentDate.split('-')[0])
    var currentMonth = parseInt(currentDate.split('-')[1])
    var currentDay = parseInt(currentDate.split('-')[2])

    var date = bill.get('repay_date')
    var year = parseInt(date.split('-')[0])
    var month = parseInt(date.split('-')[1])
    var day = parseInt(date.split('-')[2])

    var status = ''
    console.log(currentDate,currentYear,currentMonth,currentDay,year,month,day)
    if(currentYear>year){
      status = '已逾期'
    }else if(currentYear<year){
      status = '未还款'
    }else {
      if(currentMonth>month){
        status = '已逾期'
      }else if(currentMonth<month){
        status = '未还款'
      }else {
        if(currentDay>day){
          status = '已逾期'
        }else if(currentDay<=day){
          status = '未还款'
        }
      }
    }

    return status

  }
  render() {
    var swipeoutBtns = [
      {
        backgroundColor:'red',
        color:'white',
        text:'删除',
        onPress:()=>{this._deleteItem()}
      }
    ]

    var bill = this.props.item

    var name = bill.get('bill_name')
    var desc = bill.get('bill_desc')
    var title = name + '    ' + desc
    var date = bill.get('repay_date')
    var money = '¥' + bill.get('bill_money')

    //账单单状态
    var status = this._getBillStatus()

    return (
      <View style={styles.container}>

        <Swipeout right={swipeoutBtns} autoClose={true}>
          <View style={styles.contentContainer}>
            <View style={styles.leftContainer}>
              <Text style={styles.titleView}>{title}</Text>
              <Text style={styles.date}>{date}</Text>
            </View>
            <View style={styles.rightContainer}>
              <Text style={styles.money}>{money}</Text>
              <Text style={styles.status}>{status}</Text>
            </View>
          </View>
        </Swipeout>

      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    paddingLeft:13,
    backgroundColor:'#fff',
  },

  contentContainer:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    backgroundColor:'#fff',

    borderBottomColor:'#f1f2f3',
    borderBottomWidth:1,
  },
  leftContainer:{
    paddingTop:8,
    paddingBottom:8,
  },

  titleView:{
    color:'#337df6'
  },
  date:{
    paddingTop:8,
    color:'#4d4d4d',
    fontSize:14,
  },

  rightContainer:{
    marginRight:13,
  },
  money:{
    color:'#337df6'
  },
  status:{
    paddingTop:8,
    fontSize:12,
    color:'#FF9900',
    textAlign:'right',
  },




})