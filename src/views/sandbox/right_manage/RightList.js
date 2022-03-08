import React, { useEffect, useState } from 'react'
import { Button, Table,Tag,Modal,Popover, Switch } from 'antd'
import axios from 'axios'
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
const { confirm } = Modal;
export default function RightList() {
  //设置数据的状态
  const [dataSource,setDataSource] = useState([])
  //设置更新页面状态
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    axios.get("/rights?_embed=children")
    .then((res) => {
      // 通过遍历的方式寻找 children 长度为 0 的元素，将它改为空字串。
      //即没有children的字段，不会显示展开的符号标签
      res.data.forEach((item) => item.children?.length === 0 ? item.children = "" : item.children);
      setDataSource(res.data);
    })
  }, [refresh]);
  const columns=[
    {
      title:'ID',
      dataIndex:'id',
      render(id){
        return <b>{id}</b>
      }
    },{
      title:'权限名称',
      dataIndex:'title'
    },{
      title:"权限路径",
      dataIndex:'key',
      render(key){
        return <Tag color="cyan">{key}</Tag>
      }
    },{
        title:"操作",
        render:(item)=>{
          return <div>
            {/* 删除页面权限按钮 */}
            <Button danger shape='circle' icon={<DeleteOutlined/>} onClick={()=>confirmMethod(item)}></Button>
            &nbsp;&nbsp;&nbsp;
            {/* 修改页面权限按钮 */}
            <Popover content={
                        <div style={{textAlign:'center'}}>
                          <Switch checked={item.pagepermisson} onChange={()=>switchMethod(item)}></Switch>
                        </div>} 
                      title="页面配置项" 
                      trigger={item.pagepermisson === undefined ?'':'click'}
                     >
              <Button type="primary" shape='circle' icon={<EditOutlined/>} disabled={item.pagepermisson===undefined}
              ></Button>
            </Popover>
          </div>
      }
    }
  ]
  const confirmMethod=(item)=>{
    confirm({
      title: '你确定要删除吗?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        deleteMethod(item)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  //实现删除方法
  const deleteMethod =(item)=>{
    console.log(item)
    if(item.grade ===1){
      //页面同步item.id是需要删除的权限，data.id是所有权限列表
      setDataSource(dataSource.filter(data=>data.id!==item.id))
      //后端同步
      axios.delete(`/rights/${item.id}`).then(setRefresh).catch((e)=>console.log(e))
    }else{
      // console.log(item)
      let list = dataSource.filter(data=>data.id === item.rightId)
      console.log(list)
      list[0].children = list[0].children.filter(data=>data.id!==item.id)
      console.log(dataSource)
      setDataSource([...dataSource])
      axios.delete(`/children/${item.id}`).then(setRefresh).catch((e)=>console.log(e))

    }
  }

  const switchMethod=(item)=>{
    item.pagepermisson = item.pagepermisson ===0 ? 1:0 
    // console.log(item)
    setDataSource([...dataSource])
    if(item.grade ===1){
      // 这里不使用put方法，因为put方法会直接替换掉原有数据
      // 而patch方法是在原有数据上，增加修改后的数据
      axios.patch(`/rights/${item.id}`,{pagepermisson:item.pagepermisson}).then(setRefresh).catch((e)=>console.log(e))
    }else{
      axios.patch(`/children/${item.id}`,{pagepermisson:item.pagepermisson}).then(setRefresh).catch((e)=>console.log(e))
    }
  }
  return (
    // 表格支持树形数据的展示，当数据中有 children 字段时会自动展示为树形表格，
    // 如果不需要或配置为其他字段可以用 childrenColumnName 进行配置。
    // 可以通过设置 indentSize 以控制每一层的缩进宽度。
    <div><Table dataSource={dataSource} columns={columns} pagination={{pageSize:5}}/></div>
  )
}
