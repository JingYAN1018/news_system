import { Table,Button,Modal ,Tree} from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
  UnorderedListOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
const { confirm } = Modal;


export default function RoleList() {
  const [dataSource, setDataSource] = useState([])
  const [refresh, setRefresh] = useState(false);
  const [rightList, setRightList] = useState([])
  const [currentRights, setcurrentRights] = useState([])
  const [currentId, setcurrentId] = useState(0)
  const [isModalVisible,setIsModalVisible]= useState(false)
  const columns=[
    {
      title:'ID',
      dataIndex:'id',
      render:(id)=>{
        return <b>{id}</b>
      }
    },{
      title:'角色名称',
      dataIndex:'roleName'
    },{
      title:'操作',
      render:(item)=>{
        return <div>
          <Button danger shape='circle' icon={<DeleteOutlined/>} onClick={()=>confirmMethod(item)}></Button>
          &nbsp;&nbsp;&nbsp;
          <Button type="primary" shape='circle' icon={<UnorderedListOutlined />} 
                  onClick={()=>{
                    setIsModalVisible(true) ;setcurrentRights(item.rights);setcurrentId(item.id)
                  }}> 
          </Button>
        </div>
    }
    }
  ]
  useEffect(()=>{
    axios.get("/roles").then(res=>{
      setDataSource(res.data)
    })
  },[refresh])
  useEffect(() => {
    axios.get("/rights?_embed=children").then(res => {
        // console.log(res.data)
        setRightList(res.data)
    })
  }, [refresh])

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
   setDataSource(dataSource.filter(data=>data.id!==item.id))
   axios.delete(`/roles/${item.id}`).then(setRefresh).catch((e)=> console.log(e))
  }
  // 修改展示角色列表按钮
  const handleOk=()=>{
    console.log(currentRights)
    setIsModalVisible(false)
    setDataSource(dataSource.map(item =>{
      if(item.id === currentId){
        return{
          ...item,
          rights:currentRights
        }
      }
      return item
    }))
    axios.patch(`/roles/${currentId}`,{
      rights:currentRights
    }).then(setRefresh).catch((e)=> console.log(e))
  }
  // 取消展示角色列表按钮
  const handleCancel=()=>{
    setIsModalVisible(false)
  }
  // 勾选各个角色对应的权限分配按钮
  const onCheck = (checkKeys)=>{
    // console.log(checkKeys)
    setcurrentRights(checkKeys.checked)
}
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={item=>item.id} pagination={{pageSize:5}}>
      </Table>
      <Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            <Tree
                checkable
                checkedKeys = {currentRights}
                onCheck={onCheck}
                //checkStrictly代表 checkable状态下节点选择完全受控（父子节点选中状态不再关联）
                // 即勾选父节点不代表把其节点下的所有节点勾选上
                checkStrictly = {true}
                treeData={rightList}
            />
      </Modal>
    </div>
  )
}
