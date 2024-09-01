import React, {useState} from 'react'
import {Button, Icon, Input, View} from "@tarojs/components"
import './index.scss'

function SearchBar(props) {
  const { onSearch } = props

  const [searchValue,setSearchValue] = useState('')
  const handleSearch = () => {
    // 执行搜索操作，传递搜索关键字给父组件
    onSearch && onSearch()
  }
  const onInput = e=> {
    setSearchValue(e.detail.value)
  }
  const handClear = (e)=>{
    e.stopPropagation()
    setSearchValue('')
  }
  return (
    <View className='search-bar-container'>
      <Input
        holdKeyboard='true'
        className='search-input'
        placeholder='搜索游记'
        confirmType='search'
        onConfirm={onSearch}
        value={searchValue}
        onInput={onInput}
      />
      {
        searchValue.length !== 0 && (
          <Icon
            size='20'
            type='clear'
            color='#555555'
            className='search-clear'
            onClick={handClear}
          />
        )
      }
      {/*<Button className='search-btn' onClick={handleSearch}>搜索</Button>*/}
    </View>
  )
}

export default SearchBar
