import React from 'react'
import { Layout,Dropdown,Menu,Avatar} from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import { useNavigate } from "react-router"
//发布者
import {connect} from 'react-redux'
const { Header} = Layout;
function TopHeader(props) {
  console.log(props)
    let navigate = useNavigate();
    const changeCollapsed=()=>{
      //改变state的isCollapsed
      // console.log(props)
      props.changeCollapsed()
    }
    const {role:{roleName},username}=JSON.parse(localStorage.getItem("token"))
    const menu=(<Menu>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
        {roleName}
      </a>
    </Menu.Item>
    <Menu.Item danger onClick={()=>{
      localStorage.removeItem('token')
      navigate("/login")
    }}>退出</Menu.Item>
  </Menu>)

  return (
    <Header className="site-layout-background" style={{ padding: '0 16px' }}>
      {
        props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed}/>
        : 
        <MenuFoldOutlined onClick={changeCollapsed}/>
      }
      <div style={{float:'right'}}> 
        <span>欢迎</span>
        <span style={{color:'#1890ff'}}>{username}</span>
          回来！
        <span/>
        <Dropdown overlay={menu}>
            <Avatar src="https://joeschmoe.io/api/v1/random" />
        </Dropdown>
      </div>
  </Header>
  )
}
// connect(
//   //mapStateToProps
//   //mapDispatchToProps
// )(被包装的组件)

const mapStateToProps =({CollapsedReducer:{isCollapsed}})=>{
  //在方法里填入（state）打印state可以看到CollapsedReducer.isCollapsed=false
  // console.log(state)
  return {
    isCollapsed
  }
}
//action
const mapDispatchToProps ={
  changeCollapsed(){
    return{
      type:"change_collapsed"
    }
  }
}

//作为发布者，包装组件
export default connect(mapStateToProps,mapDispatchToProps)(TopHeader)