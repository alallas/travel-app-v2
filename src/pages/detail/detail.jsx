import { View, Text, ScrollView } from '@tarojs/components'
import Taro, {useLoad, useRouter} from '@tarojs/taro'
import {useEffect, useRef, useState} from "react"
import {useBaseStore} from "@/store/baseStore"
import {getTravelDetail} from "@/services/travels"
import { Swiper, SwiperItem, Image, Icon} from '@antmjs/vantui'
import './detail.scss'

export default function Discover() {
  const pos = useBaseStore((state) => state.pos)
  const systemInfo = useBaseStore((state) => state.systemInfo)
  // console.log(systemInfo)
  const height = systemInfo.screenHeight/2 || 400
  const router = useRouter()
  const [travel, setTravel] = useState()
  const { id} = router.params

  // 返回上一层页面
  const goBack = () => {
    Taro.navigateBack()
  }

  useEffect(() => {
    getDetail()
  }, [])

  const getDetail = async ()=>{
    const {data} = await getTravelDetail(id)
    const {images,cover}=data.travel;
    console.log("detail",data)
    if(cover!==images[0]){
      images.push(cover)
    }
    setTravel(data.travel)
  }
  return(
    <ScrollView
      className='detail-container'
      enableFlex='true'
    >
      <View className='detail-back' style={{top:pos.top}} onClick={goBack}>
        <Icon name='arrow-left' size='24px' color='white' />
      </View>
      <Swiper
        height={height}
        className='detail-swiper'
        paginationColor='#426543'
        autoPlay='3000'
        initPage={1}
        paginationVisible
      >
        {travel && travel.images.map((item, index) => (
          <SwiperItem key={`swiper#demo1${index}`}>
            <Image src={item} width='100%' height='100%' fit='contain' />
          </SwiperItem>
        ))}
      </Swiper>
      {
        travel && (
          <View className='detail-info'>
            <Text className='detail-title'>{travel.title}</Text>
            <View className='detail-user'>
              <Image round src={travel.avatar} className='detail-user-avatar' />
              <View className='detail-user-info'>
                <Text className='detail-user-nickname'>{travel.nickname}</Text>
                <Text className='detail-user-time'>{travel.uploadTime.slice(0,10)}</Text>
              </View>
            </View>
            <View className='detail-content'>
              {travel.content}
            </View>
          </View>
        )
      }
    </ScrollView>
  )
}
