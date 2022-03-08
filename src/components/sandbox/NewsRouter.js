import React, { useEffect, useState } from 'react'
import Home from '../../views/sandbox/home/Home'
import RightList from '../../views/sandbox/right_manage/RightList'
import RoleList from '../../views/sandbox/right_manage/RoleList'
import UserList from '../../views/sandbox/user_manage/UserList'
import NewsAdd from '../../views/sandbox/news_manage/NewsAdd'
import NewsDraft from '../../views/sandbox/news_manage/NewsDraft'
import NewsCategory from '../../views/sandbox/news_manage/NewsCategory'
import Audit from '../../views/sandbox/audit_manage/Audit'
import AuditList from '../../views/sandbox/audit_manage/AuditList'
import Unpublished from '../../views/sandbox/publish_manage/Unpublished'
import Published from '../../views/sandbox/publish_manage/Published'
import Sunset from '../../views/sandbox/publish_manage/Sunset'
import axios from 'axios'
import {Spin} from 'antd'
import { Routes, Route, Navigate  } from 'react-router-dom'
import NoPermission from '../../views/sandbox/nopermission/NoPermission'
import NewsPreview from '../../views/sandbox/news_manage/NewsPreview'
import NewsUpdate from '../news_manage/NewsUpdate'
import {connect} from 'react-redux'
//侧边栏的列表显示
const LocalRouterMap = {
    "/home":<Home/>,
    "/user-manage/list":<UserList/>,
    "/right-manage/role/list":<RoleList/>,
    "/right-manage/right/list":<RightList/>,
    "/news-manage/add":<NewsAdd/>,
    "/news-manage/draft":<NewsDraft/>,
    "/news-manage/category":<NewsCategory/>,
    "/news-manage/preview/:id":<NewsPreview/>,
    "/news-manage/update/:id":<NewsUpdate/>,
    "/audit-manage/audit":<Audit/>,
    "/audit-manage/list":<AuditList/>,
    "/publish-manage/unpublished":<Unpublished/>,
    "/publish-manage/published":<Published/>,
    "/publish-manage/sunset":<Sunset/>
}

function NewsRouter(props) {

    const [BackRouteList, setBackRouteList] = useState([])
    useEffect(()=>{
        Promise.all([
            axios.get("/rights"),
            axios.get("/children"),
        ]).then(res=>{
            // console.log(res)
            setBackRouteList([...res[0].data,...res[1].data])
            // console.log(BackRouteList)
        })
    },[])

    const {role:{rights}} = JSON.parse(localStorage.getItem("token"))
//校验是否存在该路径
    const checkRoute = (item)=>{
        return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
    }
//校验是否包含该路径权限
    const checkUserPermission = (item)=>{
        return rights.includes(item.key)
    }

    return (
        //通过redux控制spin’加载中‘组件
        <Spin size="large" spinning={props.isLoading}>
             <Routes>
                {
                    // eslint-disable-next-line array-callback-return
                    BackRouteList.map(item=>{
                    if(checkRoute(item) && checkUserPermission(item)){
                        return <Route path={item.key} key={item.key} element={LocalRouterMap[item.key]} /> 
                    }
                    <Route  element={<NoPermission/>}/>
                    })
                }

                <Route path="/" element={<Navigate replace from="/" to="/home" />}  />
                {
                    BackRouteList.length>0 && <Route path="*" element={<NoPermission/>} />
                }
            </Routes>
        </Spin>
       
    )
}
const mapStateToProps =({LoadingReducer:{isLoading}})=>({
    isLoading
})
export default connect(mapStateToProps)(NewsRouter)