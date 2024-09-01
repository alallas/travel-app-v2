import {View, Text, ScrollView} from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
// import {useUserStore} from "@/store/userStore"
// import {getUserTravels, getUserInfo} from "@/services/user"
import React, {useEffect, useState} from "react"
import {DropdownItem, DropdownMenu, Empty, Search, Tab, Tabs} from '@antmjs/vantui'
import KeywordsShow from "../../components/KeywordsShow"
import {showTextToast} from "@/utils/toast"
import {searchUsersByKeyword,searchTravelsByKeyword} from "@/services/user"
import UserItemCard from "@/components/UserItemCard"
import OverlayLoading from "@/components/OverlayLoading"
import WaterfallCard from "@/components/WaterfallCard"
import {vibrateShort} from "@/utils/taroUtils";
import './search.scss'


export default function MySearch() {
  const [isSearch, setIsSearch] = useState(false)
  const [isloading, setIsloading] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [sort, setSort] = useState('1')

  const [userList, setUserList] = useState([])
  const [travelsList, setTravelsList] = useState([])
  const [travelsTotal, setTravelsTotal] = useState(0)

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

  const getColumnWidth =()=>{
    const query = Taro.createSelectorQuery()
    query.select('#water-container').boundingClientRect(rec=>{
      const padding = 40 * rec.width / 750
      setColumnWidth((rec.width-gap-2*padding)/2)
    }).exec()
  }

  const fetchData = async (restart= false)=> {
    console.log('sousuo',bottomStatus,restart)
    if(bottomStatus === 0 || (bottomStatus === 2 && restart === false) ){
      return
    }
    setBottomStatus(0)
    vibrateShort()

    const {data} = await searchTravelsByKeyword(searchValue, page)
    console.log('dwd',data)

    // 对现在的列表进行操作
    let leftHeightCur = 0
    let rightHeightCur = 0
    let left = []
    let right = []
    if(!restart){
      leftHeightCur = leftHeight  // 左边列表的高度
      rightHeightCur = rightHeight
      left = leftShowList  // 左边列表的数组
      right = rightShowList
    }
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
  }

  const onSearch = (e) => {
    console.log(`search: ${e.detail}`)
  }

  const searchAction = async () => {
    if(searchValue === ''){
      showTextToast('请输入关键字')
    }else{
      setIsloading(true)
      setIsSearch(true)

      setLeftShowList([])
      setRightShowList([])
      setLeftHeight(0)
      setRightHeight(0)
      setPage(1)
      try {
        const res = await searchUsersByKeyword(searchValue)
        const res_t = await searchTravelsByKeyword(searchValue)
        setUserList(res.data.users)
        setTravelsList(res_t.data.travels)
        setTravelsTotal(res_t.data.total)
        fetchData(true)
      }catch (err){
        console.log(err)
      }
      setIsloading(false)
    }
  }

  const onClick = (e) => {
    console.log(e)
  }

  const sortChoose = (e)=>{
    setSort(e)
  }

  let history = [];
  if(searchValue !== ''){
    history.push(searchValue);
  }


  return (
    <View className='search-container' id='water-container'>
      <OverlayLoading isloading={isloading} />
      <View className='search-part'>
        {/*<SearchBar onSearch={onSearch} />*/}
        <Search
          onChange={(e) => setSearchValue(e.detail)}
          placeholder='请输入搜索关键词'
          onSearch={onSearch}
          renderAction={<View onClick={searchAction}>搜索</View>}
        />
      </View>
      {
        isSearch?(
          // <ScrollView
          //   className='search-result'
          // >
          // </ScrollView>
          <Tabs onClick={onClick} color='#7667C2' animated>
            <Tab title='全部'>
              <View className='drop-menu'>
                <View>
                  <Text>
                    共 {travelsTotal} 篇游记
                  </Text>
                </View>
              </View>
              <View className='search-content-travels'>
                {
                  travelsList.length === 0 ?(
                    <Empty image='search' description='搜索为空' />
                  ):(
                    <ScrollView
                      className='water-container'
                      id='water-container'
                      scrollY
                      scrollWithAnimation
                      style={{height:'calc( 100vh - 200px )'}}
                      padding={[0,40,0,40]}
                      enhanced
                      showScrollbar={false}
                      lowerThreshold={100}
                      onScrollToLower={()=>fetchData(false)}
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
                  )
                }
              </View>
            </Tab>
            <Tab title='用户'>
              {
                userList.length === 0 ? (
                  <Empty image='search' description='搜索为空' />
                ):(
                  <View className='usercard-part'>
                    {
                      userList.map((item)=>{
                        return(
                          <UserItemCard userInfo={item} key={item._id} />
                        )
                      })
                    }
                  </View>
                )
              }
            </Tab>
          </Tabs>
        ):(
          <View className='search-keywords'>
            <KeywordsShow title='历史记录' keywords={history} />
            <KeywordsShow title='热门记录' keywords={['吃','玩']} />
          </View>
        )
      }
    </View>
  )
}
