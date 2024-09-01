import { useState } from "react";
import Taro from "@tarojs/taro";
import { Radio, RadioGroup, Form, FormItem, Button, Icon } from "@antmjs/vantui";
import { View, Input,Text, Navigator } from "@tarojs/components"
import CryptoJS from 'crypto-js';
import Uploader from "@/components/Uploader"
import {userSignup} from "@/services/user";
import {useUserStore,createAvatarUrl,removeAvatar} from "@/store/userStore"
import { showErrorToast, showSuccessToast } from "@/utils/toast"

import "./register.scss"

export default function Register(){
  const [genderValue, setGenderValue] = useState("")

  const avatar = useUserStore(state=> state.avatar)
  console.log(avatar)

  const handleSubmit = async (err,values) => {
    if(!avatar){
      return showErrorToast("请上传头像")
    }
    const formData = {...values, avatar: avatar, password: CryptoJS.MD5(values.password).toString()} //加密
    try{
      const res = await userSignup(formData)
      if(res){
        showSuccessToast("注册成功")
        setTimeout(() => {
          Taro.navigateBack({
            delta: 1,
          });
        }, 2000)
      }
    } catch (err){
      console.log('失败原因',err)
      showErrorToast(err.message || "注册失败")
    }
  }

  // 返回上一层页面
  const goBack = () => {
    Taro.navigateBack()
  }

  return(
    <View className='register-bg'>
      <View className='avatar'>
        <Uploader
          removeImage={removeAvatar}
          createUrlList={createAvatarUrl}
          imageList={[avatar]}
          isOnlyOne
          imageType='avatar'
        />
      </View>
      <Form className='form' onFinish={handleSubmit}>
        <FormItem
          name='username'
          label='用户名'
          layout='vertical'
          required
          valueFormat={(e)=>e.detail.value}
          trigger='onInput'
          className='form-item'
        >
          <Input
            type='text'
          />
        </FormItem>
        <FormItem
          name='nickname'
          label='昵称'
          layout='vertical'
          required
          valueFormat={(e)=>e.detail.value}
          trigger='onInput'
          className='form-item'
        >
          <Input
            type='text'
          />
        </FormItem>
        <FormItem
          name='password'
          label='密码'
          layout='vertical'
          required
          valueFormat={(e)=>e.detail.value}
          trigger='onInput'
          className='form-item'
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
        <FormItem
          name='gender'
          label='性别'
          layout='vertical'
          required
          className='form-item form-gender'
        >
          <RadioGroup
            direction='horizontal'
            max={1}
            value={genderValue}
            onChange={(e)=>setGenderValue(e.detail)}
          >
            <Radio
              name='1'
              renderIcon={
                <Icon
                  name='smile'
                  size='25px'
                  color={
                    genderValue === '1'
                      ? '#A797F8'
                      : '#eee'
                  }
                />
              }
            >男</Radio>
            <Radio
              name='2'
              renderIcon={
                <Icon
                  name='smile'
                  size='25px'
                  color={
                    genderValue === '2'
                      ? '#A797F8'
                      : '#eee'
                  }
                />
              }
            >女</Radio>
          </RadioGroup>
        </FormItem>
        <Button type='primary' formType='submit' className='btn'>注 册</Button>
      </Form>
      <View className='transfer'>
        <Text>已有账号？</Text>
        <Text className='transfer-link' onClick={goBack}>去登录</Text>
      </View>
    </View>
  )
}
