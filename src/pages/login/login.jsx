import Taro from "@tarojs/taro";
import { Input, Text, View, Navigator } from "@tarojs/components"
import {Button, Form, FormItem } from '@antmjs/vantui'
import {useEffect} from "react"
import { setLoginData } from "@/store/userStore"
import { showSuccessToast, showErrorToast} from "@/utils/toast"
import {userLogin,checkLogin} from "@/services/user"
import CryptoJS from "crypto-js"
import "./login.scss"

export default function Login(){
  const handleLogin = async (err,value) => {
    try{
      const res = await userLogin({...value,password:CryptoJS.MD5(value.password).toString()}) //加密
      if(res){
        showSuccessToast("登陆成功")
        Taro.switchTab({
          url: '/pages/discover/discover'
        })
      }
    } catch (e){
      console.log('失败原因',e)
      showErrorToast(e.message || "登陆失败")
    }
  }

  const isLogin = async ()=>{
    const res = await checkLogin()

    await Taro.switchTab({ url: '/pages/discover/discover' })
  }

  useEffect(() => {
    isLogin()
  }, [])

  return(
    <View className='login-bg'>
      <View className='title'>
        <Text className='title-up'>Share your</Text>
        <Text className='title-down'>Travels!</Text>
      </View>
      <Form onFinish={handleLogin} className='form'>
        <FormItem
          name='username'
          label='用户名'
          className='form-item'
          layout='vertical'
          required
          valueFormat={(e)=>e.detail.value}
          trigger='onInput'
        >
          <Input
            type='text'
          />
        </FormItem>
        <FormItem
          name='password'
          label='密码'
          className='form-item'
          layout='vertical'
          required
          valueFormat={(e)=>e.detail.value}
          trigger='onInput'
          rules={[
            {
              rule: (value, call) => {
                if (value.length < 6) {
                  call('密码长度不能少于6位');
                }
              },
              message: '密码不符合要求',
            },
            {
              rule: /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/,
              message: '密码必须由至少6位数字或字母组成',
            },
          ]}
        >
          <Input
            type='password'
          />
        </FormItem>
        <Button type='primary' formType='submit' className='btn'>登 录</Button>
      </Form>
      <View className='transfer'>
        <Text>没有账号？</Text>
        <Navigator
          url='/pages/register/register'
          openType='navigate'
        >
          <Text className='transfer-link'>去注册</Text>
        </Navigator>
      </View>
    </View>
  )
}
