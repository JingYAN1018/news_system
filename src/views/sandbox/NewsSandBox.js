import React, { useEffect } from 'react'
//引入进度条插件
import NProgress from 'nprogress'
import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'
import './NewsSandBox.css'
import { Layout } from 'antd';
import NewsRouter from '../../components/sandbox/NewsRouter'
const {  Content } = Layout;



export default function NewsSandBox() {
    NProgress.start()
    useEffect(()=>{
        NProgress.done()
    })
  return (
      <div style={{height:'100%'}}>
            <Layout style={{height:'100%'}}>
                <SideMenu></SideMenu>
                <Layout className="site-layout">
                    <TopHeader></TopHeader>
                    <Content
                        className="site-layout-background"
                        style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        overflow:'auto'
                        }}
                    >
                        <NewsRouter></NewsRouter>
                    </Content>
                </Layout>
            </Layout>
      </div>
     
  )
}
