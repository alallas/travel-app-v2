import { View,Text } from "@tarojs/components";
import { Icon } from '@antmjs/vantui';

const AddImgBox=(props)=>{
  const {imageType, handleImageUpload}=props

  return(
    <View
      className='add'
      onClick={handleImageUpload}
    >
      <View className='add-container'>
        <Icon
          name={
            imageType==="avatar"
              ? "plus"
              : "photo"
          }
          size={
            imageType==="avatar"
              ? "45px"
              : "30px"
          }
          className='add-icon'
          color='#E0D7FD'
        />
        <Text className='add-text'>
          {
            imageType==="avatar"
              ? "上传头像"
              : imageType==="cover"
                ? "上传封面"
                : "上传照片"
          }
        </Text>
      </View>
    </View>
  )

}

export default AddImgBox;

