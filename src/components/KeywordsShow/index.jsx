import React from 'react'
import {Image, Text, View} from "@tarojs/components"
import Taro from "@tarojs/taro"
import './index.scss'

function KeywordsShow(props) {
  const {title, keywords=[]} = props
  return(
    <View className='keywords-container'>
      <View className='keywords-title'>
        <Text>{title}</Text>
      </View>
      <View className='keywords-content'>
        {
          keywords.map((item,index)=>{
            return(
              <View key={index} className='keywords-box'>
                <Text>{item}</Text>
              </View>
            )
          })
        }
      </View>
    </View>
  )
}
export default KeywordsShow
