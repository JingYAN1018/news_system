import { Table,Button,Modal,Switch} from 'antd'
import axios from 'axios'
import React, { useEffect, useState,useRef } from 'react'
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
} from '@ant-design/icons';
import UserForm from '../../../components/user_manage/UserForm';
const { confirm } = Modal;

export default function UserList() {
  const [dataSource, setDataSource] = useState([])
  const [refresh, setRefresh] = useState(false);
  //新增用户信息中，超级管理员的区域列表禁用
  const [isAddVisible,setIsAddVisible]=useState(false)
  const [isUpdateVisible,setIsUpdateVisible]=useState(false)
  //修改用户信息中，超级管理员的区域列表禁用
  const [isUpdateDisable,setIsUpdateDisable] =useState(false)
  //保存更新后的表单信息
  const [currentForm,setCurrentForm] =useState(null)
  const [roleList,setRoleList]=useState([])
  const [regionList,setRegionList]=useState([])
  const addForm = useRef(null)
  const updateForm = useRef(null)

  const {roleId,region,username} = JSON.parse(localStorage.getItem('token'))
  useEffect(()=>{
    const roleObj= {
      "1":"superadmin",
      "2":"admin",
      "3":"editor"
    }
    axios.get("/users?_expand=role").then(res=>{
      const list = res.data
      setDataSource(roleObj[roleId]==="superadmin"?list:[
        //对于区域管理员，只能看到自己，和自己区域的区域编辑
          ...list.filter(item=>item.username===username),
          ...list.filter(item=>item.region ===region &&roleObj[item.roleId]==="eidtor")
      ])
    })
  },[roleId,region,username])
  useEffect(()=>{
    axios.get("/regions").then(res=>{
      setRegionList(res.data)
    })
  },[refresh])
  useEffect(()=>{
    axios.get("/roles").then(res=>{
      setRoleList(res.data)
    })
  },[refresh])
  const columns=[
    {
      title:'管理区域',
      dataIndex:'region',
      filters:[
        ...regionList.map(item=>({
          text:item.title,
          value:item.value
        })),
        {
          text:'全球',
          value:'全球'
        }
      ],
      onFilter:(value,item)=>{
        if(value ==="全球"){
          return item.region===''
        }
        return item.region===value
      },
      render:(region)=>{
        return <b>{region===''?'全球':region}</b>
      }
    },{
      title:'角色名称',
      dataIndex:'role',
      render:(role)=>{
        return role.roleName
      }
    },{
      title:'用户名',
      dataIndex:'username'
    },{ 
      title:'用户状态',
      dataIndex:'roleState',
      render:(roleState,item)=>{
        return <Switch checked={roleState} disabled={item.default} onChange={()=>{handleChange(item)}}></Switch>
      }
    },{
      title:'操作',
      render:(item)=>{
        return <div>
          <Button danger shape='circle' icon={<DeleteOutlined/>} onClick={()=>confirmMethod(item)} disabled={item.default}></Button>
          &nbsp;&nbsp;&nbsp;
          <Button type="primary" shape='circle' icon={<EditOutlined />} onClick={()=>handleUpdate(item)} disabled={item.default}> 
          </Button>
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
    setDataSource(dataSource.filter(data=>data.id!==item.id))
    axios.delete(`/users/${item.id}`).then(setRefresh).catch((e)=> console.log(e))
  }
  //点击添加用户 确定按钮调用的方法
  const addFormOK=()=>{
    // console.log("add",addForm)
    addForm.current.validateFields().then(value => {
      // console.log(value)

      setIsAddVisible(false)
      addForm.current.resetFields()
      //post到后端，生成id，再设置 datasource, 方便后面的删除和更新
      axios.post(`/users`, {
          ...value,
          "roleState": true,
          "default": false,
      }).then((res)=>{
          console.log(res.data)
          // 新增用户，刷新页面时，会有连表查询的role表中的角色名称显示不出来的问题，因此需要匹配新增的roleID
          setDataSource([...dataSource,
                        {...res.data,
                          role:roleList.filter(item=>item.id===value.roleId)[0]}
                        ])
                      })
       }).catch(err => {
      console.log(err)
      })
  }
  // 用户状态switch改变
  const handleChange=(item)=>{
    console.log(item)
    item.roleState = !item.roleState
    setDataSource([...dataSource])
    axios.patch(`/users/${item.id}`,{
      roleState:item.roleState
    })
  }
// 用户信息的修改
  const handleUpdate=(item)=>{
    setTimeout(()=>{
      setIsUpdateVisible(true)
      if(item.roleId === 1){
        //超级管理员区域禁用
        setIsUpdateDisable(true)
      }else{
        //取消禁用
        setIsUpdateDisable(false)
      }
      updateForm.current.setFieldsValue(item)
    },0)
    //保存现在的用户表单信息
   setCurrentForm(item)
  }
  const updateFormOK=()=>{
    updateForm.current.validateFields().then(value => {
      setIsUpdateVisible(false)
      setDataSource(dataSource.map(item=>{
        if(item.id === currentForm.id){
          return {
            //控制管理区域
            ...item,//也可以是currentForm
            //控制角色名称
            ...value,
            //role是连表查询的数据
            role:roleList.filter(data=>data.id===value.roleId)[0]
          }
        }
        return item
      }))
      setIsUpdateDisable(!isUpdateDisable)
      axios.patch(`/users/${currentForm.id}`,value)
    })
  }
  return (
    <div>
      <Button type='primary' onClick={()=>{setIsAddVisible(true)}} style={{'marginBottom':'30px'}}>添加用户</Button>
      <Table dataSource={dataSource} columns={columns} rowKey={item=>item.id} pagination={{pageSize:5}}>
      </Table>
      {/* 添加用户弹框 */}
      <Modal
      visible={isAddVisible}
      title="添加用户"
      okText="确定"
      cancelText="取消"
      onCancel={()=>{setIsAddVisible(false);addForm.current.resetFields()}}
      onOk={() => addFormOK()}
    >
       <UserForm regionList={regionList} roleList={roleList} ref={addForm}></UserForm>
    </Modal>
    {/* 更新用户信息弹框 */}
    <Modal
      visible={isUpdateVisible}
      title="修改用户"
      okText="确定"
      cancelText="取消"
      onCancel={()=>{setIsUpdateVisible(false);updateForm.current.resetFields();setIsUpdateDisable(!isUpdateDisable)}}
      onOk={() => updateFormOK()}
    >
       <UserForm regionList={regionList} roleList={roleList} ref={updateForm} isUpdateDisable={isUpdateDisable} isUpdate={true}></UserForm>
    </Modal>
    </div>
  )
}
