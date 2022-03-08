import React, { forwardRef,useEffect,useState } from 'react'
import {Form,Input,Select} from 'antd'
const {Option}  = Select
const UserForm = forwardRef((props,ref) => {
    const [isDisabled, setisDisabled] = useState(false)
    useEffect(()=>{
        setisDisabled(props.isUpdateDisable)
    },[props.isUpdateDisable])

    const {roleId,region} = JSON.parse(localStorage.getItem('token'))
    const roleObj= {
        "1":"superadmin",
        "2":"admin",
        "3":"editor"
      }
    
    const checkRegionDisabled=(item)=>{
        //如果是更新功能
        if(props.isUpdate){
            if(roleObj[roleId]==="superadmin"){
                return false
            }else{
                return true
            }
        }else{//如果是新增用户功能
            if(roleObj[roleId] === 'superadmin'){
                return false
            }else{
                //即区域管理员只能新增同区域的区域编辑
                //禁用不是同区域的选择框
                return item.value !== region
            }
        }
    }
    //控制表单角色下拉选择框的禁用功能
    const checkRoleDisabled=(item)=>{
        //如果是更新功能
        if(props.isUpdate){
            if(roleObj[roleId]==="superadmin"){
                return false
            }else{
                return true
            }
        }else{//如果是新增用户功能
            if(roleObj[roleId] === 'superadmin'){
                return false
            }else{ 
                //即区域管理员只能选择同区域的区域编辑
                //禁用角色不是区域编辑的选择框
                return roleObj[item.id]!=="editor"
            }
        }
    }
    return (
        <Form
            ref={ref}
            layout="vertical"
        >
            <Form.Item
                name="username"
                label="用户名"
                rules={[{ required: true, message: 'Please input the title of collection!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="password"
                label="密码"
                rules={[{ required: true, message: 'Please input the title of collection!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="region"
                label="区域"
                rules={isDisabled?[]:[{ required: true, message: 'Please input the title of collection!' }]}
            >
                <Select disabled={isDisabled}>
                    {
                        props.regionList.map(item =>
                            <Option value={item.value} key={item.id} disabled={checkRegionDisabled(item)}>{item.title}</Option>
                        )
                    }
                </Select>
            </Form.Item>
            <Form.Item
                name="roleId"
                label="角色"
                rules={[{ required: true, message: 'Please input the title of collection!' }]}
            >
                <Select onChange={(value)=>{
                    // console.log(value)
                    if(value === 1){
                        setisDisabled(true)
                        ref.current.setFieldsValue({
                            region:""
                        })
                    }else{
                        setisDisabled(false)
                    }
                }}>
                    {
                        props.roleList.map(item =>
                            <Option value={item.id} key={item.id} disabled={checkRoleDisabled(item)}>{item.roleName}</Option>
                        )
                    }
                </Select>
            </Form.Item>
        </Form>
    )
})
export default UserForm