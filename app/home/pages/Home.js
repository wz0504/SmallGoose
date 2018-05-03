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
  Platform,

} from 'react-native'

var width = Dimensions.get('window').width
var height = Dimensions.get('window').height

import ListHeader from '../views/ListHeader'
import HomeItem from '../views/HomeItem'

import Options from './Options'
import NetCreditPage from './NetCreditPage'
import CustomPage from './CustomPage'
import HomeBillItem from "../views/HomeBillItem";


import AddBill from "./AddBill";
import BillDetailList from "./BillDetailList";

import request from './../../common/request'
import config from './../../common/config'

// import {
//   isFirstTime,
//   isRolledBack,
//   packageVersion,
//   currentVersion,
//   checkUpdate,
//   downloadUpdate,
//   switchVersion,
//   switchVersionLater,
//   markSuccess,
// } from 'react-native-update'

import _updateConfig from './../../../update';
const {appKey} = _updateConfig[Platform.OS];


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
      monthlyBill:0,
      totalBill:0,
    }


  }

  /*
  componentWillMount(){
    if (isFirstTime) {
      Alert.alert('提示', '这是当前版本第一次启动,是否要模拟启动失败?失败将回滚到上一版本', [
        {text: '是', onPress: ()=>{throw new Error('模拟启动失败,请重启应用')}},
        {text: '否', onPress: ()=>{markSuccess()}},
      ]);
    } else if (isRolledBack) {
      Alert.alert('提示', '刚刚更新失败了,版本被回滚.');
    }
  }
  doUpdate = info => {
    downloadUpdate(info).then(hash => {
      Alert.alert('提示', '下载完毕,是否重启应用?', [
        {text: '是', onPress: ()=>{switchVersion(hash);}},
        {text: '否',},
        {text: '下次启动时', onPress: ()=>{switchVersionLater(hash);}},
      ]);
    }).catch(err => {
      Alert.alert('提示', '更新失败.');
    });
  };
  checkUpdate = () => {

    checkUpdate(appKey).then(info => {
      if (info.expired) {
        Alert.alert('info.expired');
        info.downloadUrl && Linking.openURL(info.downloadUrl)
      } else if (info.upToDate) {
        Alert.alert('提示', '您的应用版本已是最新.');
      } else {
        Alert.alert('提示', '检查到新的版本'+info.name+',是否下载?\n'+ info.description, [
          {text: '是', onPress: ()=>{this.doUpdate(info)}},
          {text: '否',},
        ]);
      }
    }).catch(err => {
      Alert.alert('提示', '更新失败.');
    });
  };

*/
  componentDidMount() {
    this._getBillList()

    // this.checkUpdate()
  }


  _noData(){
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(items),
      haveBill: false,
      data:[],
      monthlyBill:0,
      totalBill:0,
    })
  }
  _getBillList(){

    /*
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
    */

    var body = {
      uid: '1',
    }
    var url = config.api.base + config.api.home
    var that = this
    request.post(url, body)
      .then((data) => {
        console.log(data)
        if (data && data.code==200) {
          that.setState({
            dataSource: that.state.dataSource.cloneWithRows(data.data.info),
            haveBill: true,
            data:data.data,
            monthlyBill:data.data.monthlybill,
            totalBill:data.data.totalbill,
          })
        } else {
          that.refs.toast.show(data.msg)
          that._noData(items)
        }
      })
      .catch((err) => {
        that.refs.toast.show('获取账单失败，请检测网络是否良好')
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
    var that = this
    that._getBillList()
  }

  _addBill(){
    var that = this
    that.props.navigator.push({
      component:AddBill,
      title:'',
      passProps: {
        tabBar: {
          hide: () => this.props.tabBar.hide(),
          show: () => this.props.tabBar.show()
        },
        callBack:that._updateBillList.bind(this)
      }
    })
  }



  render() {
    var totalMoney = '¥ ' + this.state.totalBill
    var currentMoney = '本月应还' + this.state.monthlyBill + '元'
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
    backgroundColor: 'white',
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
    // color:'red',
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