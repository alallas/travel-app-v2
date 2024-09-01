import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

const initialBaseValue = {
  pos: {width: 87, height: 32, left: 336, top: 58, right: 423},
  systemInfo: {}
}
export const useBaseStore = create()(
  immer(() => initialBaseValue)
)

export const setPos = (pos) => {
  useBaseStore.setState(() => ({ pos }))
}

export const setSystemInfo = (systemInfo) => {
  useBaseStore.setState(() => ({ systemInfo }))
}
