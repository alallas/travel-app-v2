import { useLaunch } from '@tarojs/taro'
import { setPos } from '@/store/baseStore.js'
import { getMenuRect, getSystemInfo } from "@/utils/taroUtils"
import {setSystemInfo} from "./store/baseStore";
import '@/assets/global/index.scss'

function App({ children }) {
  setPos(getMenuRect())
  setSystemInfo(getSystemInfo())

  useLaunch(() => {
    console.log('App launched.')
  })

  // children 是将要会渲染的页面
  return children
}

export default App
