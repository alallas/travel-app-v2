import { View, Text } from '@tarojs/components'
import {useEffect, useRef} from 'react'
import { useLoad } from '@tarojs/taro'
import './index.scss'

export default function Index() {

  const myref = useRef()
  useLoad(() => {
    console.log('Page loaded.')
  })

  useEffect(()=>{
    console.log(myref.current)
  },[])

  return (
    <View className='index-container'>
      <Text className='title'>Hello world!</Text>
    </View>
  )
}
