import React, {useEffect, useState} from 'react'
import {ScrollView, Text, View} from "@tarojs/components"
import {Icon, Image } from "@antmjs/vantui"
import {useBaseStore} from "@/store/baseStore"
import Taro, {useRouter} from "@tarojs/taro"
import {getUserInfoById} from "@/services/user"
import {searchTravelsByUserId} from "@/services/user";
import WaterfallCard from "@/components/WaterfallCard"
import './user.scss'

function User(props) {
  const router = useRouter()
  const { id } = router.params
  console.log(id)
  const pos = useBaseStore((state) => state.pos)
  const [userInfo, setUserInfo] = useState({})

  const gap = 16 //左右间距
  const [page,setPage] = useState(1)
  const [leftShowList, setLeftShowList] = useState([])
  const [rightShowList, setRightShowList] = useState([])
  const [leftHeight, setLeftHeight] = useState(0)
  const [rightHeight, setRightHeight] = useState(0)
  const [columnWidth, setColumnWidth] = useState(0)
  const [bottomStatus, setBottomStatus] = useState(1) //0加载中 1加载成功 2已经到底

  // 返回上一层页面
  const goBack = () => {
    Taro.navigateBack()
  }

  useEffect(() => {
    if(id){
      getUserInfo(id)
    }
  }, [id])

  useEffect(()=>{
    getColumnWidth()
  },[])

  useEffect(()=>{
    if(columnWidth!==0){
      fetchData()
    }
  },[columnWidth])

  const getColumnWidth =()=>{
    const query = Taro.createSelectorQuery()
    query.select('#water-container').boundingClientRect(rec=>{
      const padding = 40 * rec.width / 750
      setColumnWidth((rec.width-gap-2*padding)/2)
    }).exec()
  }

  const getUserInfo = async (id)=>{
    try {
      const res = await getUserInfoById(id)
      setUserInfo(res.data.user)
    }catch (err){
      console.log(err)
    }
  }

  const fetchData = async ()=> {
    if(bottomStatus === 0 || bottomStatus === 2){
      return
    }
    setBottomStatus(0)

    const {data} = await searchTravelsByUserId(id,page)
    console.log(data)

    // 对现在的列表进行操作
    let leftHeightCur = leftHeight;  // 左边列表的高度
    let rightHeightCur = rightHeight;
    const left = leftShowList  // 左边列表的数组
    const right = rightShowList
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
    console.log(left,right)
  }

  return (
    <View className='user-container'>
      <View className='user-header' style={{backgroundImage: `url(${userInfo.avatar})`}} >
        <View className='user-back' style={{top:pos.top}} onClick={goBack}>
          <Icon name='arrow-left' size='24px' color='white' />
        </View>
        <View className='user-show' style={{top: pos.top+80}}>
          <Image
            round
            className='user-avatar'
            fit='cover'
            src={userInfo.avatar}
          />
          <View className='user-name'>
            <View className='line-one'>
              <Text className='nick'>{userInfo.nickname}</Text>
              {userInfo.gender === '1'?(
                <Image
                  className='gender'
                  src='https://tarvels-images.oss-cn-shanghai.aliyuncs.com/default/man.svg'
                />
              ):(
                <Image
                  className='gender'
                  src='https://tarvels-images.oss-cn-shanghai.aliyuncs.com/default/woman.svg'
                />
              )}
            </View>
            <Text className='user'>用户名：{userInfo.username}</Text>
          </View>

        </View>
      </View>
      <ScrollView
        className='user-water-container'
        id='water-container'
        scrollY
        scrollWithAnimation
        style={{height:'60%'}}
        padding={[0,40,0,40]}
        enhanced
        showScrollbar={false}
        lowerThreshold={100}
        onScrollToLower={fetchData}
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

          <View className='water-item' style={{width:columnWidth}}>
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
    </View>
  );
}

export default User;
