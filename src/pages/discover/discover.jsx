import {View, Text, ScrollView, Input} from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import React, {useEffect, useRef, useState} from "react"
import { vibrateShort } from "@/utils/taroUtils"
import { useBaseStore } from '@/store/baseStore.js'
import SearchBar from "@/components/SearchBar"
import WaterfallCard from "@/components/WaterfallCard"
import {getWaterFallList} from "@/services/travels"
import {Icon} from "@antmjs/vantui"
import './discover.scss'


export default function Discover() {
  const containerRef = useRef()
  const pos = useBaseStore((state) => state.pos)

  const gap = 16 //左右间距
  const [page,setPage] = useState(1)
  const [leftShowList, setLeftShowList] = useState([])
  const [rightShowList, setRightShowList] = useState([])
  const [leftHeight, setLeftHeight] = useState(0)
  const [rightHeight, setRightHeight] = useState(0)
  const [columnWidth, setColumnWidth] = useState(0)
  const [bottomStatus, setBottomStatus] = useState(1) //0加载中 1加载成功 2已经到底

  useLoad(() => {
    console.log('Page loaded.')
  })

  // 可以简化为一个useEffect
  useEffect(()=>{
    getColumnWidth()
  },[])

  useEffect(()=>{
    if(columnWidth!==0){
      fetchData()
    }
  },[columnWidth])

  const showTip = () => {
    Taro.showToast({
      title: '为你推荐10条游记',
      icon: 'none',
      duration: 2000
    })
  }
  const getColumnWidth =()=>{
    const query = Taro.createSelectorQuery()
    query.select('#container').boundingClientRect(rec=>{
      setColumnWidth((rec.width-gap)/2)
    }).exec()
  }

  const fetchData = async ()=> {
    if(bottomStatus === 0 || bottomStatus === 2){
      return
    }
    setBottomStatus(0)
    vibrateShort()
    const {data} = await getWaterFallList(page,'')
    console.log(data)

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

  const handleSearch = ()=>{
    Taro.navigateTo({
      url: '/pages/search/search'
    })
  }

  const onScroll = (e) => {
    console.log(e,Math.max(leftHeight,rightHeight))
    // const largerThreshold = viewHeight * 3 / 4; // 距离底部距离 视图高度的 3/4
    // if (
    //   scrollTop + viewHeight + props.threshold < scrollHeight // onScrollToLower 不触发
    //   && scrollTop + viewHeight + props.threshold >= scrollHeight
    // ) {
    //   fetchData() // 手动触发 onScrollToLower
    // }
  }

  return (
    <ScrollView
      className='discover-container'
      scrollY
      scrollWithAnimation
      style={{height:'100vh'}}
      // onScroll={onScroll}
      // scrollTop={scrollTop}
      // style={scrollStyle}
      lowerThreshold={100}
      // upperThreshold={Threshold}
      onScrollToLower={fetchData}
      // onScrollToUpper={scrollTop} // 使用箭头函数的时候 可以这样写 `onScrollToUpper={this.onScrollToUpper}`
    >
      <View className='discover-header'>
        <Text className='title' style={{top:pos.top}}>Discover</Text>
      </View>
      <View className='discover-search'>
        {/*<SearchBar onSearch={onSearch} />*/}
        <View className='search-part' onClick={handleSearch}>
          <Text>搜索游记</Text>
          <Icon name='search' size='24px' color='#969696' className='search-icon'/>
        </View>
      </View>
      <View className='discover-waterfall'>
        <View
          className='container'
          ref={containerRef}
          id='container'
          // style={{height: positionList[positionList.length - 1].columnHeight + 32 + 'px'}}
        >
          <View className='leftShow' style={{width:columnWidth}}>
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

          <View className='rightShow' style={{width:columnWidth}}>
            {
              rightShowList.map((item,index) => (
                // <View key={login.jsx} style={{
                //   height: item.h*columnWidth/item.w,
                //   width:columnWidth,
                //   background:'pink',
                //   marginTop:16,
                //   fontSize: 20
                // }}
                // >
                <WaterfallCard
                  item={item}
                  height={item.coverHeight*columnWidth/item.coverWidth}
                  width={columnWidth}
                  marginTop={10}
                />
                // </View>
              ))
            }
          </View>
        </View>
      </View>
      <View className='discover-bottom'>
        {
          bottomStatus === 0 && <View className='discover-loading' />
        }
        {
          bottomStatus === 1 && <View className='discover-loading' />
        }
        {
          bottomStatus === 2 && <Text className='discover-all'>-- The end --</Text>
        }
      </View>
    </ScrollView>
  )
}
