import React, { useState, useEffect } from 'react'
import { Button, Table, Modal, notification} from 'antd'
import axios from 'axios'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined,UploadOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
const { confirm } = Modal
export default function NewsDraft() {
    const [dataSource, setdataSource] = useState([])
    const {username}  = JSON.parse(localStorage.getItem("token"))
    //定义新闻分类变量
    let category = '时事新闻'
    const navigate = useNavigate()
    //auditState=0代表存入草稿箱
    useEffect(() => {
        axios.get(`/news?author=${username}&auditState=0`).then(res => {
            const list = res.data
            setdataSource(list)
        })
    }, [username])
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '新闻标题',
            dataIndex: 'title',
            render:(title,item)=>{
              return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
          }
        },
        {
            title: '作者',
            dataIndex: 'author'
        },
        {
            title: '分类',
            dataIndex: 'categoryId',
            render:(categoryId)=> {
                  if (categoryId === 2) {
                    category= '环球经济';
                }else if(categoryId===3){
                  category= '科学技术';
                }else if(categoryId===4){
                  category= '军事世界';
                }else if(categoryId===5){
                  category= '世界体育';
                }else{
                  category= '生活理财';
                }
                return (
                  <span>
                    {category}
                  </span>
                );
            }
        },
        {
            title: "操作",
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />
                    &nbsp;&nbsp;&nbsp;
                    <Button shape="circle" icon={<EditOutlined />} onClick={()=>{
                      navigate(`/news-manage/update/${item.id}`)
                    }}/>
                    &nbsp;&nbsp;&nbsp;
                    <Button type="primary" shape="circle" icon={<UploadOutlined />} onClick={()=>handleCheck(item.id)}/>
                </div>
            }
        }
    ];


    const confirmMethod = (item) => {
        confirm({
            title: '你确定要删除?',
            icon: <ExclamationCircleOutlined />,
            // content: 'Some descriptions',
            onOk() {
                //   console.log('OK');
                deleteMethod(item)
            },
            onCancel() {
                //   console.log('Cancel');
            },
        });

    }
    //删除
    const deleteMethod = (item) => {
        // console.log(item)
        // 当前页面同步状态 + 后端同步
        setdataSource(dataSource.filter(data => data.id !== item.id))
        axios.delete(`/news/${item.id}`)
    }
    //提交审核 auditState=1正在审核状态
    const handleCheck=(id)=>{
        axios.patch(`/news/${id}`,{
            auditState:1
        }).then(res=>{
            navigate ('/audit-manage/list')
            notification.info({
                message:'通知',
                description:`您可以到审核列表中查看您的新闻`,
                placement:"bottomRight"
            })
        })
    }
    return (
        <div>
            <Table dataSource={dataSource} columns={columns}
                pagination={{
                    pageSize: 5
                }} 
                rowKey={item=>item.id}
                />
        </div>
    )
}