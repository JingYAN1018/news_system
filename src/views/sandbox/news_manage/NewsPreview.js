import React, { useEffect, useState } from 'react'
import { PageHeader, Descriptions } from 'antd'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import moment from 'moment'
export default function NewsPreview(props) {
  const params = useParams() 
  const [newsInfo,setNewsInfo] = useState(null)
   //定义新闻分类变量
   let category = '时事新闻'
   const auditList=['未审核','审核中','已通过','未通过'] 
   const publishList =['未发布','待发布','已上线','已下线']
   const colorList=['black','orange','green','red']
    useEffect(()=>{
    //   console.log(params.id)
        axios.get(`/news/${params.id}?_expand=role?_expand=category`).then(res=>{
            setNewsInfo(res.data)
            // console.log(res.data)
            if (res.data.categoryId === 2) {
                category= '环球经济';
            }else if(res.data.categoryId===3){
            category= '科学技术';
            }else if(res.data.categoryId===4){
            category= '军事世界';
            }else if(res.data.categoryId===5){
            category= '世界体育';
            }else{
            category= '生活理财';
            }
        })
    // console.log(newsInfo)
    },[params.id])
    return (
    <div>
        {
            newsInfo && <div>
                <PageHeader
                    // ghost代笔pageHeader 的类型，将会改变背景颜色
                    ghost={true}
                    onBack={() => window.history.back()}
                    title={newsInfo.title}
                    subTitle={category}
                    >
                    <Descriptions size="small" column={3}>
                        <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                        <Descriptions.Item label="创建时间">{moment(newsInfo.createTime).format("YYYY/MM/DD HH:mm:ss")}</Descriptions.Item>
                        <Descriptions.Item label="发布时间">{newsInfo.publishTime?moment(newsInfo.createTime).format("YYYY/MM/DD HH:mm:ss"):'-'}</Descriptions.Item>
                        <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                        <Descriptions.Item label="审核状态"><span style={{color:colorList[newsInfo.auditState]}}>
                        {auditList[newsInfo.auditState]}
                        </span>
                        </Descriptions.Item>
                        <Descriptions.Item label="发布状态"><span style={{color:colorList[newsInfo.auditState]}}>
                        {publishList[newsInfo.publishState]}
                        </span>
                        </Descriptions.Item>
                        <Descriptions.Item label="访问数据">{newsInfo.view}</Descriptions.Item>
                        <Descriptions.Item label="点赞数量">{newsInfo.star}</Descriptions.Item>
                        <Descriptions.Item label="评论数量">0</Descriptions.Item>

                    </Descriptions>
                </PageHeader>
                <div dangerouslySetInnerHTML={{__html:newsInfo.content}} style={{border:"1px solid gray",margin:"0 24px"}}>
                </div>
            </div>
        }
    </div>
  )
}
