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
  ListView,

} from 'react-native'

var width = Dimensions.get('window').width


//自定义
import NavigationBar from './../../common/NavigationBar'

import AV from 'leancloud-storage'
class Bill extends AV.Object {}

import Toast, {
  DURATION
} from 'react-native-easy-toast'
import DetailListItem from "../views/DetailListItem";
import Query from "../../common/Query";


export default class BillDetailList extends Component {
  constructor(props) {
    super(props)
    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })
    this.state = {
      dataSource: ds.cloneWithRows([]),
    }
  }

  // 渲染组件时隐藏tabbar
  componentWillMount() {
    this.props.tabBar.hide();
  }

  // 销毁组件时显示tabbar
  componentWillUnmount() {
    this.props.tabBar.show();
  }

  _back(){
    this.props.navigator.pop()
    this.props.callBack()
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

  componentDidMount() {
    this._getBillList()
  }

  _getBillList(){

    var  that = this
    Query.queryBillWithType(that.props.data.type)
      .then((data)=>{
        console.log(data)
        if(data){
          that.setState({
            dataSource: that.state.dataSource.cloneWithRows(data),
          })
        }
      })
      .catch((err)=>{
        console.log(err)
        that.setState({
          dataSource: that.state.dataSource.cloneWithRows([]),
        })
      })

  }

  _deleteItemSuccess(success){
    var that = this
    if (success === 'success'){
      that.refs.toast.show('删除成功')
      this._getBillList()
    }else {
      that.refs.toast.show('删除失败')
    }
  }

  _renderRow(rowData, sectionId, rowId) {
    return (
      <DetailListItem item={rowData} delete={this._deleteItemSuccess.bind(this)}/>
    )
  }


  render() {

    return (
      <View style={styles.container}>
        <NavigationBar
          title={this.props.data.name}
          statusBar={{
            barStyle:'default'
          }}
          leftButton={
            this._renderNavBarButton(require('./../../../scr/images/back_icon.png'))
          }
        />


        <ListView
          automaticallyAdjustContentInsets = {false}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          enableEmptySections={true}
          showsVerticalScrollIndicator={false}

        />



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



})