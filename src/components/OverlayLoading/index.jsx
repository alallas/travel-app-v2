import React from 'react'
import {Overlay} from "@antmjs/vantui"
import {View} from "@tarojs/components"
import './index.scss'

function OverlayLoading(props) {
  return(
    <Overlay show={props.isloading}>
      <View className='overlay-wrapper'>
        <View className='overlay-loading' />
      </View>
    </Overlay>
  )
}
export default OverlayLoading
