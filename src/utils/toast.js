import Taro from '@tarojs/taro'

export const showErrorToast = (msg) => {
  Taro.showToast({
    title: msg,
    icon: 'error',
  })
}


export const showSuccessToast = (msg) => {
  Taro.showToast({
    title: msg,
    icon: 'success',
  })
}

export const showTextToast = (msg) => {
  Taro.showToast({
    title: msg,
    icon: 'none',
  })
}
