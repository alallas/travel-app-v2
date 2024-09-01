
import Taro,{ useLoad, useDidShow } from "@tarojs/taro";

import { View, Text, ScrollView, Image } from '@tarojs/components'
import { Button, Tag, Empty, Icon } from '@antmjs/vantui'
import { setCurrentTravelData } from '@/store/travelStore'
import { deleteTravel } from "@/services/travels";
import {getUserTravels, getUserInfo, logout} from "@/services/user"
import { useState } from "react"

import './mine.scss'


export default function Mine() {
  const [userInfoData, setUserInfoData] = useState({})
  const [myTravelsData, setMyTravelsData] = useState([])

  useLoad(() => {
    console.log('Page loaded.')
  })

  useDidShow(() => {
    console.log("page did show")
    getMyUserInfo();
    getMyTravelsList();
  })


  const getMyTravelsList = async ()=>{
    Taro.showLoading({ title: '加载中', mask: true });
    const {data:travels} = await getUserTravels();
    setMyTravelsData(travels.travels);
    Taro.hideLoading();
  }

  const getMyUserInfo = async ()=>{
    const {data:userInfo} = await getUserInfo()
    const {avatar,nickname,username}=userInfo.userInfo;
    setUserInfoData({avatar,nickname,username})
  }

  const handleLogout=async()=>{
    await logout();
    Taro.navigateTo({
      url: '/pages/login/login'
    })
  }

  const handleDeleteMyTravel= (travelId)=>{
    Taro.showModal({
      content: '确定删除吗？',
      success: async (res)=> {
        if (res.confirm) {
          await deleteTravel(travelId);
          getMyTravelsList();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }

  const handleEditMyTravel=async (item)=>{
    const { _id, cover, images, content, title  } = item;
    const currentTravelData = { cover, images, content, title}
    setCurrentTravelData(currentTravelData);

    Taro.navigateTo({
      url: `/pages/edit/edit?id=${_id}`
    })
  }

  const navigateToPublish=()=>{
    Taro.switchTab({
      url: '/pages/publish/publish'
    })
  }


  return (
    <View className='index'>
      <View className='header'>
        <View className='info'>
          <Image className="info-img" src={userInfoData.avatar} mode="aspectFill"/>
          <View className='info-text'>
            <Text className='info-username'>{userInfoData.username}</Text>
            <Text>{userInfoData.nickname}</Text>
          </View>
        </View>
        <View className='operate'>
          <View className='logout' onClick={handleLogout}>
            <Icon name="upgrade" size="20px" color="white" className="logout-icon"/>
            <Text className='logout-text'>登出</Text>
          </View>
          <View className='add' onClick={navigateToPublish}>
            <Text className='add-icon'>+</Text>
            <Text className='add-text'>新增</Text>
          </View>
        </View>
      </View>
      <ScrollView className='list'>
        {
          myTravelsData.length !== 0
          ? myTravelsData.map((item,index)=>{
              const {title,content,cover,status,_id}=item;
              let contentTrim = content.replace(/^\s*\n+/gm, '');
              return (
                <View key={index} className='list-item'>
                  <View className='main-data'>
                    <Image
                      className='img'
                      src={cover}
                      mode="aspectFill"
                    />
                    <View className='text'>
                      <Text className='title'>{title}</Text>
                      <Text className='content'>{contentTrim}</Text>
                    </View>
                  </View>
                  <View className='status-data'>
                    <View className="status">
                      <Tag
                        className='tag'
                        size="large"
                        plain={true}
                        color={
                          status==="1"
                            ? "#FAAE16"
                            : status==="2"
                              ? "#52C41A"
                              : "#FF4D4F"
                        }
                      >
                        {
                          status==="1"
                            ? "待审核"
                            : status==="2"
                              ? "已通过"
                              : "已拒绝"
                        }
                      </Tag>
                      <Text className="reason">{item?.reason}</Text>
                    </View>
                    <View className='btn'>
                      <Button
                        className='delete'
                        type='primary'
                        size='small'
                        round
                        onClick={()=>handleDeleteMyTravel(_id)}
                      >删除</Button>
                      <Button
                        className='edit'
                        type='primary'
                        size='small'
                        round
                        onClick={()=>handleEditMyTravel(item)}
                        disabled={
                          status==="3" ? true: false
                        }
                      >编辑</Button>
                    </View>
                  </View>
                </View>
              )
            })
          : <View>
              <Empty description="暂未发布游记" />
            </View>
        }
      </ScrollView>
    </View>
  )
}




