import Taro from "@tarojs/taro";
import {View, Image, Text} from "@tarojs/components"
import {Button} from "@antmjs/vantui"
import './index.scss'

function UserItemCard(props) {
  const { userInfo } = props

  const toUser = (id)=>{
    Taro.navigateTo({
      url: `/pages/user/user?id=${id}`
    })
  }

  return(
    <View className='usercard-container'>
      <Image
        className='usercard-img'
        src={userInfo.avatar}
      />
      <View className='usercard-info'>
        <Text>{userInfo.nickname}</Text>
      </View>
      <Button
        icon='guide-o'
        size='small'
        color='linear-gradient(to right, #A797F8, #7667C2)'
        className='usercard-btn'
        onClick={()=>toUser(userInfo._id)}
      >
        去访问
      </Button>
    </View>
  )
}

export default UserItemCard
