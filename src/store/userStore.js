import { create } from "zustand";
import {immer} from "zustand/middleware/immer"
import { createImageUrl } from "@/utils/createImageUrl"

const initialUserValue = {
  avatar: "",
}

export const useUserStore = create()(
  immer(() => initialUserValue)
)


export const removeAvatar = () => {
  useUserStore.setState(() => ({ avatar: ''  }))
}

export const createAvatarUrl = async (filePath) => {
  try {
    const fileUrl = await createImageUrl(filePath)
    if (fileUrl) {
      useUserStore.setState(()=>({ avatar: fileUrl }))
    }
  } catch (err) {
    console.log(err)
  }
}





