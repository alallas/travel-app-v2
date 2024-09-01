import React from 'react'
import {Image, Text, View} from "@tarojs/components"
import Taro from "@tarojs/taro"
import './index.scss'

function WaterfallCard(props) {
  const { item, width, height, marginTop } = props

  // 跳转到详情页面
  const goToPage = () => {
    Taro.navigateTo({
      url: `/pages/detail/detail?id=${item._id}`
    })
  }

  return (
    <View
      className='waterfall-card'
      onClick={goToPage}
      style={{
        // width,height,
        marginTop,
        marginBottom: 5
      }}
    >
      <Image
        style={{width,height}}
        src={item.cover}
      >
      </Image>
      <View className='waterfall-info' style={{height:60}}>
        <Text
          className='waterfall-content'
        >
          {item.title}
        </Text>
        <View className='waterfall-user'>
          <Image className='waterfall-avatar' src={item.avatar}></Image>
          <Text className='waterfall-nickname'>{item.nickname}</Text>
        </View>
      </View>
    </View>
  );
}

export default React.memo(WaterfallCard)
