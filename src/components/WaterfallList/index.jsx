/* eslint-disable */
import react, {useEffect, useState} from 'react'
import {View, ScrollView, Text} from '@tarojs/components'
import {vibrateShort} from "@/utils/taroUtils";
import Taro from "@tarojs/taro"
import React from "react"
import WaterfallCard from "../WaterfallCard"
import {searchTravelsByKeyword} from "@/services/user"
import './index.scss'

export default function WaterfallList(props) {
  const gap = 16 //左右间距
  const [page,setPage] = useState(1)
  const [leftShowList, setLeftShowList] = useState([])
  const [rightShowList, setRightShowList] = useState([])
  const [leftHeight, setLeftHeight] = useState(0)
  const [rightHeight, setRightHeight] = useState(0)
  const [columnWidth, setColumnWidth] = useState(0)
  const [bottomStatus, setBottomStatus] = useState(1) //0加载中 1加载成功 2已经到底

  useEffect(()=>{
    getColumnWidth()
  },[])

  useEffect(()=>{
    if(columnWidth!==0 && props.searchValue!== ''){
      fetchData()
    }
  },[columnWidth,props.shouldUpdate])

  const getColumnWidth =()=>{
    const query = Taro.createSelectorQuery()
    query.select('#water-container').boundingClientRect(rec=>{
      const padding = 40 * rec.width / 750
      setColumnWidth((rec.width-gap-2*padding)/2)
    }).exec()
  }

  const fetchData = async ()=> {
    if(bottomStatus === 0 || bottomStatus === 2){
      return
    }
    setBottomStatus(0)
    vibrateShort()

    const {data} = await searchTravelsByKeyword(props.searchValue, page)
    console.log('dwd',data)

    // 对现在的列表进行操作
    let leftHeightCur = page % 5 === 0 ? 0 : leftHeight;  // 左边列表的高度
    let rightHeightCur = page % 5 === 0 ? 0 : rightHeight;
    const left = page % 5 === 0 ? [] : leftShowList  // 左边列表的数组
    const right = page % 5 === 0 ? [] : rightShowList
    // 遍历数组
    for (let i = 0; i < data.travels.length; i++) {
      if (leftHeightCur <= rightHeightCur) {
        data.travels[i].leftHeightCur = leftHeightCur
        left.push(data.travels[i])
        leftHeightCur = leftHeightCur + data.travels[i].coverHeight *columnWidth/data.travels[i].coverWidth + 10 + 60 + 5
      } else {
        data.travels[i].rightHeightCur = rightHeightCur
        right.push(data.travels[i])
        rightHeightCur = rightHeightCur + data.travels[i].coverHeight *columnWidth/data.travels[i].coverWidth + 10 + 60 + 5
      }
    }
    if(page%5 === 0){
      showTip()
      console.log('tip')
    }
    if(data.isall === true){
      setBottomStatus(2)
    }else{
      setPage(page+1)
      setBottomStatus(1)
    }
    setLeftShowList(left)
    setRightShowList(right)
    setLeftHeight(leftHeightCur)
    setRightHeight(rightHeightCur)
  }


  return (
    <ScrollView
      className='water-container'
      id='water-container'
      scrollY
      scrollWithAnimation
      style={{height:props.height}}
      padding={[0,40,0,40]}
      enhanced
      showScrollbar={false}
      // onScroll={onScroll}
      // scrollTop={scrollTop}
      // style={scrollStyle}
      lowerThreshold={100}
      // upperThreshold={Threshold}
      onScrollToLower={fetchData}
      // onScrollToUpper={scrollTop} // 使用箭头函数的时候 可以这样写 `onScrollToUpper={this.onScrollToUpper}`
    >
      <View className='water-part'>
        <View className='water-item' style={{width:columnWidth}}>
          {
            leftShowList.map((item,index) => (
              <WaterfallCard
                item={item}
                height={item.coverHeight*columnWidth/item.coverWidth}
                width={columnWidth}
                marginTop={10}
              />
            ))
          }
        </View>

        <View className='water-item water-item-right' style={{width:columnWidth}}>
          {
            rightShowList.map((item,index) => (
              <WaterfallCard
                item={item}
                height={item.coverHeight*columnWidth/item.coverWidth}
                width={columnWidth}
                marginTop={10}
              />
            ))
          }
        </View>
      </View>
      <View className='water-bottom'>
        {
          bottomStatus === 0 && <View className='water-loading' />
        }
        {
          bottomStatus === 1 && <View className='water-loading' />
        }
        {
          bottomStatus === 2 && <Text className='water-all'>-- The end --</Text>
        }
      </View>
    </ScrollView>
  )
}

