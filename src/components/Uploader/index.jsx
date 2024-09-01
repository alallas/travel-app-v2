import Taro from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { Icon } from '@antmjs/vantui'
import AddImgBox from "@/components/AddImgBox"

function Uploader(props) {
  const{ createUrlList, removeImage, imageList, isOnlyOne, imageType } = props


  const handleImageUpload = async ()=>{
    Taro.chooseImage({
      count: 1,
      sizeType:['compressed'],
      sourceType:['album', 'camera'],
      success: async(res) => {
        const tempFilePaths = res.tempFilePaths;
        const tempFilePath = tempFilePaths[0];
        await createUrlList(tempFilePath);
      }
    })
  }

  const handleImageDelete=(index)=>{
    return removeImage(index);
  }

  return (
    <View className='uploader'>
      {imageList?.length===0 || (imageList?.length===1 && imageList[0]==="")
        ? (<AddImgBox handleImageUpload={handleImageUpload} imageType={imageType} />)
        : (
          <View className='img-list'>
            {
              imageList?.map((item,index)=>(
                <View className='img-container' key={index}>
                  <Image
                    className='img'
                    src={item}
                    mode={
                      imageType==="cover"
                        ? "widthFix"
                        : "aspectFill"
                    }
                  />
                  <Icon
                    name='cross'
                    size='15px'
                    className='delete-icon'
                    color='#fff'
                    onClick={()=>handleImageDelete(index)}
                  />
                </View>
              ))
            }
            {
              isOnlyOne===false
                ? (<AddImgBox handleImageUpload={handleImageUpload} imageType={imageType} />)
                : undefined
            }
          </View>
        )
      }
    </View>
  )
}

Uploader.propTypes = {

}

export default Uploader

