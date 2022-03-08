import React,{useEffect,useState} from 'react'
import { Layout, Menu } from 'antd';
import './index.css'
import {
  UserOutlined,
  VideoCameraOutlined,
  TeamOutlined,
  StarTwoTone,
  StarOutlined,
  SmileOutlined,
  EyeInvisibleOutlined,
  GlobalOutlined,
  HomeOutlined,
  LaptopOutlined,
  SendOutlined,
  EditOutlined,
  FormOutlined,
  ClearOutlined,
  FolderOpenOutlined,
  VerifiedOutlined,
  WifiOutlined,
  SaveOutlined
} from '@ant-design/icons';
import SubMenu from 'antd/lib/menu/SubMenu';
import { useNavigate,useLocation } from "react-router";
import axios from 'axios';
import {connect} from 'react-redux'

const {  Sider} = Layout;
//模拟列表数据，不通过接口调用的方式
// const menuList=[
//   {
//     key:'/home',
//     title:'首页',
//     icon:<UserOutlined/>
//   },{
//     key:'/user_manage',
//     title:'用户管理',
//     icon:<UserOutlined/>,
//     children:[
//       {
//         key:'/user_manage/list',
//         title:'用户列表',
//         icon:<UserOutlined/>
//       }
//     ]
//   },{
//     key:"/right_manage",
//     title:"权限管理",
//     icon:<VideoCameraOutlined />,
//     children:[
//       {
//         key:"/right_manage/role/list",
//         title:"角色列表",
//         icon:<UserOutlined />
//       },
//       {
//         key:"/right_manage/right/list",
//         title:"权限列表",
//         icon:<UserOutlined />
//       }
//     ]
//   }
// ]
const iconList={
  "/home":<HomeOutlined />,
  "/user-manage":<TeamOutlined style={{"fontSize":"17px"}} />,
  "/user-manage/list":<StarTwoTone twoToneColor="#eb2f96" />,
  "/right-manage":<StarOutlined />,
  "/right-manage/role/list":<SmileOutlined />,
  "/right-manage/right/list":<EyeInvisibleOutlined />,
  "/news-manage":<GlobalOutlined />,
  "/news-manage/add":<EditOutlined />,
  "/news-manage/update/:id":<VideoCameraOutlined/>,
  "/news-manage/preview/:id":<VideoCameraOutlined/>,
  "/news-manage/draft":<FormOutlined />,
  "/news-manage/category":<FolderOpenOutlined />,
  "/audit-manage":<LaptopOutlined />,
  "/audit-manage/audit":<UserOutlined/>,
  "/audit-manage/list":<VerifiedOutlined />,
  "/publish-manage":<SendOutlined />,
  "/publish-manage/unpublished":<SaveOutlined />,
  "/publish-manage/published":<WifiOutlined />,
  "/publish-manage/sunset":<ClearOutlined />,
} 
 function SideMenu(props) {
  const [menu,setMenu] = useState([])
  useEffect(()=>{
    axios.get("/rights?_embed=children").then(res=>{
      // console.log(res.data)
      setMenu(res.data)
    })
  },[])
  // console.log(JSON.parse(localStorage.getItem("token")))
  const {role:{rights}} =JSON.parse(localStorage.getItem("token"))
  const checkPermission = (item) =>{
    // console.log(item)
    return item.pagepermisson ===1 && rights.includes(item.key)
  }
  let location = useLocation();
  const selectKeys = [location.pathname]; // ex: ['/home']
  const openKeys = ["/" + location.pathname.split("/")[1]];
  let navigate = useNavigate();
  const renderMenu =(menuList)=>{
    return menuList.map(item=>{
      // item.children?.length>0，判断标签是否有子标签，例如首页没有子标签则不渲染右边的下拉符号
      if(item.children?.length>0 && checkPermission(item)){
        return <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
          {renderMenu(item.children)}
        </SubMenu>
      }
      return checkPermission(item) && <Menu.Item key={item.key} icon={iconList[item.key]} onClick={()=>{navigate(item.key)}}>{item.title}</Menu.Item>
    })
  }
  return (
        <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
          <div style={{display:'flex',height:"100%","flexDirection":"column"}}>
            <div className="logo" >全球新闻发布管理系统</div>
            <div style={{flex:'1',overflow:"auto"}}>
              <Menu theme="dark" mode="inline" selectedKeys={selectKeys} defaultOpenKeys={openKeys}>
                {/* <Menu.Item key="1" icon={<UserOutlined />}>
                  首页
                </Menu.Item>
                <Menu.Item key="2" icon={<VideoCameraOutlined />}>
                  用户管理
                </Menu.Item>
                <Menu.Item key="3" icon={<UploadOutlined />}>
                  权限管理
                </Menu.Item>
                <Menu.Item key="4" icon={<UploadOutlined />}>
                  新闻管理
                </Menu.Item>
                <Menu.Item key="5" icon={<UploadOutlined />}>
                  审核管理
                </Menu.Item>
                <Menu.Item key="6" icon={<UploadOutlined />}>
                  发布管理
                </Menu.Item> */}
                {renderMenu(menu)}
              </Menu>
            </div>
           
          </div>
        </Sider>
  )
}
const mapStateToProps =({CollapsedReducer:{isCollapsed}})=>({
  //在方法里填入（state）打印state可以看到CollapsedReducer.isCollapsed=false
  // console.log(state)
    isCollapsed
})
export default connect(mapStateToProps)(SideMenu)