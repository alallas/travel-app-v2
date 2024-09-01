import request from '@/utils/request.js'

// 登陆
export function userLogin(userInfo) {
  return request.post(
    `/user/login`,
    {
      username: userInfo.username,
      password: userInfo.password
    }
  )
}

// 注册
export function userSignup(userInfo) {
  return request.post(
    `/user/signup`,
    {
      username: userInfo.username,
      nickname: userInfo.nickname,
      password: userInfo.password,
      avatar: userInfo.avatar,
      gender: userInfo.gender,
    }
  )
}

// 验证登陆状态
export function checkLogin() {
  return request.get(
    `/user/checkLogin`,
  )
}

// 获取用户发布的所有游记
export function getUserTravels() {
  return request.get(
    `/user/auditTravels`,
  )
}

// 获取用户的信息
export function getUserInfo() {
  return request.get(
    `/user/getUserInfo`,
  )
}

// 用户搜索游记
export function searchTravelsByKeyword(keyword, page= 1) {
  return request.get(
    `/user/searchTravels`,
    {
      keyword,
      page,
    },
  )
}

// 用户搜索游记by userId
export function searchTravelsByUserId(userId, page= 1) {
  return request.get(
    `/user/searchTravelsByuserId`,
    {
      userId,
      page,
    },
  )
}

// 用户搜索用户
export function searchUsersByKeyword(keyword, page) {
  return request.get(
    `/user/searchUsers`,
    {
      keyword,
      page
    },
  )
}

// 登出
export function logout() {
  return request.get(
    `/user/logout`,
  )
}
export function getUserInfoById(id) {
  return request.get(
    `/user/getUserInfoById?id=${id}`,
  )
}
