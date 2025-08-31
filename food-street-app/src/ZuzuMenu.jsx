import React from 'react'
import Menu from './Menu'
import DebugMenu from './DebugMenu'
import { menuData } from './menuData'

function ZuzuMenu() {
  // Debug mode for troubleshooting Netlify deployment
  const isDebugMode = import.meta.env.MODE === 'production' && window.location.hostname.includes('netlify')
  
  // Temporarily use DebugMenu to test deployment
  if (isDebugMode) {
    console.log('🐛 Debug mode activated for Netlify deployment')
    return <DebugMenu />
  }
  
  // Use normal menu
  console.log('📋 Loading ZUZU menu with data:', menuData.zuzu)
  return <Menu shopData={menuData.zuzu} />
}

export default ZuzuMenu