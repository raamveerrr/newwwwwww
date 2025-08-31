import React from 'react'
import Menu from './Menu'
import { menuData } from './menuData'

function ZuzuMenu() {
  // Load ZUZU menu with data from menuData
  console.log('📋 Loading ZUZU menu with data:', menuData.zuzu)
  return <Menu shopData={menuData.zuzu} />
}

export default ZuzuMenu