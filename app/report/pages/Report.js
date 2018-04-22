import React, {
  Component
} from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native'

var width = Dimensions.get('window').width

import Echarts from 'native-echarts'
import Query from "../../common/Query";
import moment from 'moment'

export default class Report extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data:{
        credit:{money:0},
        netCredit:{money:0},
        life:{money:0},
        custom:{money:0},
      }
    }

  }
  componentWillMount(){
    console.log('componentWillMount')
  }
  componentWillReceiveProps(){
    this._getCurrentMonthBill()
    console.log('componentWillReceiveProps')
  }
  componentDidMount(){
    console.log('componentDidMount')
    this._getCurrentMonthBill()
  }

  shouldComponentUpdate(){
    return true
  }

  _getCurrentMonthBill(){
    var that = this
    Query.queryCurrentMonthAll().then((data)=>{
      if(data){
        that.setState({
          data:data
        })
      }else {
        that.setState({
          data:{
            credit:{money:0},
            netCredit:{money:0},
            life:{money:0},
            custom:{money:0},
          }
        })
      }
    }).catch((err)=>{
      console.log(err)
      that.setState({
        data:{
          credit:{money:0},
          netCredit:{money:0},
          life:{money:0},
          custom:{money:0},
        }
      })
    })
  }

  render() {

    var date = moment().format('YYYY-MM')
    var month = parseInt(date.split('-')[1])
    var title = month + '月份账单统计'
    const option = {
      title : {
        text: title,
        subtext: '小鹅账单',
        x:'center'
      },
      tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['信用卡账单','网贷账单','生活账单','手动记账']
      },
      series : [
        {
          name: '账单明细',
          type: 'pie',
          radius : '55%',
          center: ['50%', '60%'],
          data:[
            {value:this.state.data.credit.money, name:'信用卡账单'},
            {value:this.state.data.netCredit.money, name:'网贷账单'},
            {value:this.state.data.life.money, name:'生活账单'},
            {value:this.state.data.custom.money, name:'手动记账'},
          ],
          color: ['#FF3030', '#337df6', '#EEB422', '#CD661D',],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    return (
      <View style={styles.container}>
        <StatusBar barStyle="default"/>
        <Echarts option={option} height={500} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop:30,
    flex: 1,
    backgroundColor: '#fff',
  },

})