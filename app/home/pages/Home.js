import React, {
  Component
} from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  ListView,
  Dimensions,
  StatusBar,
  TouchableOpacity,
} from 'react-native'

var width = Dimensions.get('window').width
var height = Dimensions.get('window').height

import ListHeader from '../views/ListHeader'
import HomeItem from '../views/HomeItem'

import Options from './Options'
import NetCreditPage from './NetCreditPage'
import CustomPage from './CustomPage'
import HomeBillItem from "../views/HomeBillItem";

import Query from "../../common/Query";
import AddBill from "./AddBill";
import BillDetailList from "./BillDetailList";


var items = [
  {
    style:{backgroundColor:'#FF3030'},
    icon:require('./../../../scr/images/home_card.png'),
    title:'信用卡账单',
    subtitle:'信用卡记账，及时还款'
  },
  {
    style:{backgroundColor:'#337df6'},
    icon:require('./../../../scr/images/home_money.png'),
    title:'网贷账单',
    subtitle:'及时还款，安心放心'
  },
  {
    style:{backgroundColor:'#EEB422'},
    icon:require('./../../../scr/images/home_coffee.png'),
    title:'生活账单',
    subtitle:'生活常用，缴费明了'
  },{
    style:{backgroundColor:'#CD661D'},
    icon:require('./../../../scr/images/home_pen.png'),
    title:'手动记账',
    subtitle:'手动输入，方便快捷'
  },
]


export default class Home extends Component {
  constructor(props) {
    super(props)
    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })
    this.state = {
      dataSource: ds.cloneWithRows([]),
      haveBill: false,
      data:[],
      currentMoney:0,
    }


  }

  componentDidMount() {
    this._getBillList()
    this._getCurrentMoney()
  }

  // componentWillReceiveProps() {
  //
  //   return true
  // }

  _noData(){
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(items),
      haveBill: false,
      data:[]
    })
  }
  _getBillList(){

    var  that = this
    Query.queryAll()
      .then((data)=>{
        console.log(data)
        if(data && data.length>0){
          that.setState({
            dataSource: that.state.dataSource.cloneWithRows(data),
            haveBill: true,
            data:data
          })
        }else {
          that._noData(items)
        }
      })
      .catch((err)=>{
        console.log(err)
        that._noData(items)
      })

  }

  _renderHeader() {
    return (
      !this.state.haveBill ?
        <ListHeader /> : null
    )


  }


  _didSelectedRow(rowId){
    // Alert.alert(rowId.toString())
    if (rowId == 0){
      this.props.navigator.push({
        component:Options,
        title:'',
        passProps: {
          tabBar: {
            hide: () => this.props.tabBar.hide(),
            show: () => this.props.tabBar.show()
          },
          type:0, //标记 0是信用卡账单 1生活账单
          backShowTabbar:true,
          callBack:this._updateBillList.bind(this)
        }
      })
    }else if (rowId==2){
      this.props.navigator.push({
        component:Options,
        title:'',
        passProps: {
          tabBar: {
            hide: () => this.props.tabBar.hide(),
            show: () => this.props.tabBar.show()
          },
          type:1, //标记 0是信用卡账单 1生活账单
          backShowTabbar:true,
          callBack:this._updateBillList.bind(this)
        }
      })
    }else if (rowId==1){
      this.props.navigator.push({
        component:NetCreditPage,
        title:'',
        passProps: {
          tabBar: {
            hide: () => this.props.tabBar.hide(),
            show: () => this.props.tabBar.show()
          },
          backShowTabbar:true,
          callBack:this._updateBillList.bind(this)
        }
      })
    }else if (rowId==3){
      this.props.navigator.push({
        component:CustomPage,
        title:'',
        passProps: {
          tabBar: {
            hide: () => this.props.tabBar.hide(),
            show: () => this.props.tabBar.show()
          },
          backShowTabbar:true,
          callBack:this._updateBillList.bind(this)
        }
      })
    }
  }

  _lookBillDetailList(data){
    console.log(data)
    this.props.navigator.push({
      component:BillDetailList,
      title:'',
      passProps: {
        tabBar: {
          hide: () => this.props.tabBar.hide(),
          show: () => this.props.tabBar.show()
        },
        data:data,
        callBack:this._updateBillList.bind(this)
      }
    })

  }

  _renderRow(rowData, sectionId, rowId) {
    return (
      this.state.haveBill?
      <HomeBillItem item={rowData} callBack={this._lookBillDetailList.bind(this)}/>
      :
      <HomeItem item={rowData} rowId={rowId} callBack={this._didSelectedRow.bind(this)}/>
    )
  }

  _updateBillList(){
    console.log('back')
    this._getBillList()
    this._getCurrentMoney()
  }

  _addBill(){
    this.props.navigator.push({
      component:AddBill,
      title:'',
      passProps: {
        tabBar: {
          hide: () => this.props.tabBar.hide(),
          show: () => this.props.tabBar.show()
        },
        callBack:this._updateBillList.bind(this)
      }
    })
  }

  _getTotalMoney(){
    var that = this
    if(that.state.haveBill){

      var  dataArray = that.state.data
      var totalMoney = 0
      dataArray.forEach((item)=>{
        totalMoney = totalMoney+item.money
      })
      return '¥'+totalMoney
    }else {
      return '¥ 0'
    }
  }

  _getCurrentMoney(){
    var that = this
    Query.queryCurrentMonthMoney().then((money)=>{
      console.log(money)
      that.setState({
        currentMoney:money,
      })
    }).catch((err)=>{
      console.log(err)
      that.setState({
        currentMoney:0,
      })
    })

  }

  render() {
    console.log('render')
    var totalMoney = this._getTotalMoney()
    var currentMoney = '本月应还' + this.state.currentMoney + '元'

    return (
      <View style={styles.contanier}>
        <StatusBar backgroundColor="#fff"  barStyle="light-content" />

        <Image source={require('./../../../scr/images/home_top.png')} style={styles.top}>
          <Text style={styles.title}>小鹅账单</Text>
          <Text style={styles.totalMoney}>{totalMoney}</Text>
          <Text style={[styles.currentMoney,this.state.haveBill?styles.currentMoneyBottom2:styles.currentMoneyBottom1]}>{currentMoney}</Text>

          {
            this.state.haveBill?
            <View style={styles.addBox}>
              <TouchableOpacity onPress={this._addBill.bind(this)}>
                <Image source={require('./../../../scr/images/home_add.png')} style={styles.add_bill} />
              </TouchableOpacity>
            </View>

            :null
          }

        </Image>


        <ListView
          automaticallyAdjustContentInsets = {false}
          dataSource={this.state.dataSource}
          renderHeader = {this._renderHeader.bind(this)}
          renderRow={this._renderRow.bind(this)}
          enableEmptySections={true}
          showsVerticalScrollIndicator={false}
          style={{height:height-160-49}}
        />
      </View>

    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
  },
  top:{
    width:width,
    height:160,
    justifyContent:'space-between',
    alignItems:'center',
  },

  title:{
    marginTop:30,
    fontSize:15,
    fontWeight:'600',
    backgroundColor:'transparent',
    color:'#fff',
  },
  totalMoney:{
    fontSize:30,
    fontWeight:'600',
    color:'#fff',
    backgroundColor:'transparent',

  },

  currentMoney:{
    fontSize:15,
    backgroundColor:'transparent',
    color:'#fff',
    marginBottom:16,
  },
  currentMoneyBottom1:{
    marginBottom:16,
  },
  currentMoneyBottom2:{
    marginBottom:0,
  },

  addBox:{
    width:width,
  },
  add_bill:{
    width:30,
    height:30,
    position:'absolute',
    bottom:12,
    right:12,
  },


})