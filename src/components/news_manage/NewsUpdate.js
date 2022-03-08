import React, { useEffect, useState,useRef } from 'react'
import { Button, PageHeader,Steps,Form,Input, Select, message,notification } from 'antd';
import axios from 'axios'
import { useNavigate, useParams } from "react-router-dom";
import NewsEditor from '../news_manage/NewsEditor';
const { Step } = Steps;
const {Option} = Select
export default function NewsUpdate() {
  const navigate = useNavigate();
  const params = useParams();
  //当前是第几步
  const [current,setCurrent] = useState(0)
  //获取新闻分类列表
  const [categoryList,setCategoryList] = useState([])
  // 存储新增的新闻信息
  const [formInfo,setFormInfo] = useState({})
  //存储新闻内容
  const [content,setContent] = useState("")
  //校验新闻标题和新闻分类的填写与否
  const NewsForm = useRef(null)
 
  useEffect(()=>{
    axios.get("/categorys").then(res=>{
      // console.log(res.data)
      setCategoryList(res.data)
    })
  },[])
  useEffect(()=>{
      axios.get(`/news/${params.id}?_expand=category&_expand=role`).then(res=>{
        let {title,categoryId,content} = res.data
        NewsForm.current.setFieldsValue({
            title,
            categoryId,
        })
        setContent(content)
      })
  },[params.id])

  const handleNext=()=>{
    if(current === 0){
      NewsForm.current.validateFields().then(res=>{
        // console.log(res)
        setFormInfo(res)
        // console.log(res)
        setCurrent(current+1)
      }).catch(err=>{
        console.log(err)
      })
    }else if(current===1){
      console.log(content,formInfo)
      if(content==="" || content.trim==="<p></p>"){
        message.error("新闻内容不能为空")
        setCurrent(current-1)
      }else{
        setCurrent(current+1)
      }
    }
  }
  const handlePrevious=()=>{
    setCurrent(current-1)
  }
  //提交审核,传递的参数为0表示保存在草稿箱，传1表示正在审核
  const handleSave=(auditState)=>{
    axios.patch(`/news/${params.id}`, {
      ...formInfo,
      // "title":formInfo.title,
      // "categoryId":formInfo.category,
      "content": content,
      "auditState": auditState,
      // "publishTime": 0
    }).then(res=>{
      navigate(auditState===0?'/news-manage/draft':'/audit-manage/list')
      notification.info({
          message: `通知`,
          description:
            `您可以到${auditState===0?'草稿箱':'审核列表'}中查看您的新闻`,
          placement:"bottomRight",
      });
  })
  }
  return (
    <div>
      <PageHeader
        className="site-page-header"
        onBack={()=>navigate(-1)}
        title="更新新闻"
        subTitle="This is a subtitle"
      />
      <Steps current={1}>
        <Step title="基本信息" description="新闻标题，新闻分类" />
        <Step title="新闻内容" description="新闻主体" />
        <Step title="新闻提交" description="保存草稿或提交审核" />
      </Steps>
      {/* 编辑内容的主体区 */}
     <div style={{marginTop:"50px"}}>
       {/* 第一步：编辑新闻标题和新闻分类 */}
       <div style={{ display: current === 0 ? "" : "none" }}>
          <Form
              name="basic"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              ref={NewsForm}
            >
              <Form.Item
                label="新闻标题"
                name="title"
                rules={[{ required: true, message: 'Please input your title!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="新闻分类"
                name="categoryId"
                rules={[{ required: true, message: 'Please input your category!' }]}
              >
                <Select >
                  {
                    categoryList.map(item=>
                      <Option value={item.id} key={item.id}>{item.title}</Option>
                    )
                  }
                  
                </Select>
              </Form.Item>
          </Form>
       </div>
       {/* 第二步：编辑新闻内容 */}
       <div style={{ display: current === 1 ? "" : "none" }}>
         {/* 接收从子组件传递过来的值 */}
            <NewsEditor getContent={(value)=>{
              // console.log(value)
              setContent(value)
            }} content={content}></NewsEditor>
       </div>
       {/* 第三步：提交审核或保存草稿 */}
       <div style={{ display: current === 2 ? "" : "none" }}>
       </div>
     </div>

      <div style={{marginTop:"50px"}}>
        {
          current>0 && <Button onClick={handlePrevious}>上一步</Button>
        }
        &nbsp;&nbsp;&nbsp;
        {
          current<2 && <Button type='primary' onClick={handleNext} >下一步</Button>
        }
        &nbsp;&nbsp;&nbsp;
        {
          current ===2 &&<span>
            <Button type='primary'onClick={()=>handleSave(0)}>保存草稿箱</Button>&nbsp;&nbsp;&nbsp;
            <Button type='danger' onClick={()=>handleSave(1)}>提交审核</Button>
          </span>
        }
      </div>
    </div>
  )
}
