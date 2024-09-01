import Taro from "@tarojs/taro";

export function getMenuRect() {
    let jn = Taro.getMenuButtonBoundingClientRect()
    return jn
}

export function vibrateShort() {
  Taro.vibrateShort()
}

export function getSystemInfo(){
  let info = Taro.getSystemInfoSync()
  return info
}

export const getImageWH = async (imgUrl)=>{
  try {
    const res = await Taro.getImageInfo({src:imgUrl})
    return {
      width:res.width,
      height:res.height
    }
  } catch (err) {
    console.log(err)
    throw(err)
  }
}

