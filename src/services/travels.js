import request from '@/utils/request.js'

// 获取瀑布流数据
export function getWaterFallList(page, keyword='') {
  return request.get(
    `/travels/getTravels`,
    {
      page,
      keyword
    }
  )
}

// 获取游记详情
export function getTravelDetail(id) {
  return request.get(
    `/travels/detail/${id}`,
  )
}

// 发布游记
export function publishTravel(travelsData) {
  return request.post(
    `/travels/publish`,
    {
      title: travelsData.title,
      content: travelsData.content,
      images: travelsData.images,
      cover: travelsData.cover,
      coverWidth: travelsData.coverWidth,
      coverHeight: travelsData.coverHeight,
    }
  )
}

// 删除游记
export function deleteTravel(travelId) {
  return request.post(
    `/travels/deleteTravel/${travelId}`,
  )
}


// 编辑我的游记
export function editMyTravel(id, myEditedTravel) {
  return request.post(
    `/travels/edit/${id}`,
    {...myEditedTravel}
  )
}
