import React,{useState,useEffect} from 'react'
import axios from 'axios'
import {Table,Button,notification} from 'antd'

export default function Audit() {
    const [dataSource, setdataSource] = useState([])
    const {roleId,region,username}  = JSON.parse(localStorage.getItem("token"))
    const newsCategoryList  =['时事新闻','环球经济','科学技术','军事世界','世界体育','生活理财']

    useEffect(()=>{
        const roleObj = {
            "1":"superadmin",
            "2":"admin",
            "3":"editor"
        }
        // 显示审核中的新闻列表
        axios.get(`/news?auditState=1`).then(res => {
            const list = res.data
            // 筛选
            setdataSource(roleObj[roleId]==="superadmin"?list:[
              // 这里是为区域管理员筛选对应需要其审核的新闻
              // 匹配区域管理员的名字、所属区域及该所属区域下的区域编辑员
                ...list.filter(item=>item.author===username),
                ...list.filter(item=>item.region===region&& roleObj[item.roleId]==="editor"&&item.username !== username)
            ])
        })
    },[roleId,region,username])

    const columns = [
        {
            title: '新闻标题',
            dataIndex: 'title',
            render: (title,item) => {
                return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
            }
        },
        {
            title: '作者',
            dataIndex: 'author'
        },
        {
            title: "新闻分类",
            dataIndex: 'categoryId',
            render: (categoryId) => {
                return <div>{newsCategoryList[categoryId]}</div>
            }
        },
        {
            title: "操作",
            render: (item) => {
                return <div>
                  {/* 若审核通过，则把审核状态变更为已通过，发布状态变更为待发布 */}
                   <Button type="primary" onClick={()=>handleAudit(item,2,1)}>通过</Button>
                   {/* 若审核被驳回，则把审核状态变更为未通过，发布状态变更为未发布 */}
                   <Button danger onClick={()=>handleAudit(item,3,0)}>驳回</Button>
                </div>
            }
        }
    ];

    const handleAudit = (item,auditState,publishState)=>{
        setdataSource(dataSource.filter(data=>data.id!==item.id))

        axios.patch(`/news/${item.id}`,{
            auditState,
            publishState
        }).then(res=>{
            notification.info({
                message: `通知`,
                description:
                  `您可以到[审核管理/审核列表]中查看您的新闻的审核状态`,
                placement:"bottomRight"
            });
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