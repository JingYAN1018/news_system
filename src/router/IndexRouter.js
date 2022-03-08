import React from 'react'
import {HashRouter,Routes,Route,Navigate} from 'react-router-dom'
import Login from '../views/login/Login'
import Detail from '../views/news/Detail'
import News from '../views/news/News'
import NewsSandBox from '../views/sandbox/NewsSandBox'
export default function IndexRouter() {
  return (
      <HashRouter>
          {/* HashRouter 里面包 Switch 会出错，请改为包 Routes (Routes 和 Switch 的功用是一样的，都能做到精准匹配) */}
          {/* Route 的 component 属性改为 element，并且 element 中请使用 <> 包裹组件名称 */}
        <Routes>
            <Route path='/login' element={<Login/>}></Route>
            <Route path='/news' element={<News/>}></Route>
            <Route path='/detail/:id' element={<Detail/>}></Route>
            {/* <Route path='/' element={<NewsSandBox/>}></Route> */}

            {/* For react-router-dom v6, simply replace Redirect with Navigate */}
            {/* 所以我们需要将 Redirect 改为 Navigate，并且一样使用的是 element 而不是 render */}
            <Route path="/*" element={
                localStorage.getItem('token')?
                <NewsSandBox></NewsSandBox>:
                <Navigate to="/login"></Navigate>
            }></Route>
        </Routes>  
      </HashRouter>
  )
}
