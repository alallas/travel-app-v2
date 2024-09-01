import { create } from "zustand";
import { immer } from "zustand/middleware/immer"
import { createImageUrl } from "@/utils/createImageUrl"

const initialTravelValue = {
  images: [],
  cover: "",
  title: "",
  content: "",
}

export const useTravelStore = create()(
  immer(() => initialTravelValue)
)

// 封面新增
export const createCoverUrl = async (filePath) => {
  try {
    const fileUrl = await createImageUrl(filePath)
    if (fileUrl) {
      useTravelStore.setState({ cover: fileUrl })
    }
  } catch (err) {
    console.log(err)
  }
}

// 封面修改
export const changeCover = (cover) => {
  useTravelStore.setState(() => ({ cover }))
}

// 游记新增
export const createTravelUrlList = async (filePath) => {
  try {
    const fileUrl = await createImageUrl(filePath)

    if (fileUrl) {
      useTravelStore.setState((state) => (
        { images: [...state.images, fileUrl] }
      ))
    }
  } catch (err) {
    console.log(err)
  }
}

// 游记移除
export const removeTravelUrlList = (index) => {
  useTravelStore.setState((state) => (
    { images: [...state.images.slice(0, index), ...state.images.slice(index + 1)] }
  ))
}

// 保存指定游记数据
export const setCurrentTravelData = async (currentTravel) => {
  if(!currentTravel){
    return useTravelStore.setState(initialTravelValue);
  }
  useTravelStore.setState(() => ({
    title: currentTravel.title || "",
    content: currentTravel.content || "",
    cover: currentTravel.cover || "",
    images: currentTravel.images || [],
  }))
}


