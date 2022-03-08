import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {Table,Tag,Button, notification} from 'antd'
import { useNavigate } from 'react-router-dom'

export default function AuditList() {
  const {username} =JSON.parse(localStorage.getItem('token'))
  const [dataSource,setDataSource] = useState([])
  const newsCategoryList  =['时事新闻','环球经济','科学技术','军事世界','世界体育','生活理财']
  const navigate = useNavigate()
  // const [refresh,setRefresh] = useState(false)
  useEffect(()=>{
    // 审核状态有（'草稿箱 暂未提交审核','审核中','已通过','未通过'）
    // 发布状态有（'未发布','待发布','已上线','已下线'）
    // 因此，展示审核列表时，需要展示审核状态不等于0的其他状态auditState_ne=0，发布状态小于等于1的状态publishState_lte=1
    axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1`).then(res=>{
      console.log(res.data)
      setDataSource(res.data)
    })
  },[username])
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
        title: "审核状态",
        dataIndex: 'auditState',
        render: (auditState) => {
            const colorList = ["",'orange','green','red']
            const auditList = ["草稿箱","审核中","已通过","未通过"]
            return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
        }
    },
    {
        title: "操作",
        render: (item) => {
            return <div>
                {
                  // 当状态在审核中，可撤销该动作
                    item.auditState===1 &&  <Button  onClick={()=>handleRervert(item)}>撤销</Button>
                }
                {
                  // 当状态是已通过审核，则可以进行发布
                    item.auditState===2 &&  <Button  danger onClick={()=>handlePublish(item)}>发布</Button>
                }
                {
                  //当状态是未通过审核，则可以修改新闻即更新
                    item.auditState===3 &&  <Button type="primary" onClick={()=>handleUpdate(item)}>更新</Button>
                }
            </div>
        }
    }
  ];
  //审核中，可点击撤销功能，将该新闻返回草稿箱auditState=0，再进行后续操作
  const handleRervert=(item)=>{
    setDataSource(dataSource.filter(data=>data.id!==item.id))
    axios.patch(`/news/${item.id}`,{
      auditState:0
    }).then(res=>{
      notification.info({
        message:`通知`,
        description:`您可以到草稿箱中查看您的新闻`,
        placement:'bottomRight'
      })
    })
  }
  //未通过审核，可点击更新功能，使用户跳转到更新新闻的页面
  const handleUpdate=(item)=>{
    navigate(`/news-manage/update/${item.id}`)
  }
  //已通过审核，可点击发布功能
  const handlePublish=(item)=>{
    axios.patch(`/news/${item.id}`,{
      "publishState":2,
      "publishTime":Date.now()
    }).then(res=>{
      navigate('/publish-manage/published')
      notification.info({
        message:'通知',
        description:'您可以到【发布管理/已发布】中查看您的新闻',
        placement:'bottomRight'
      })
    })
  }
  return (

    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{pageSize:5}} rowKey={item=>item.id}/>
    </div>
  )
}
