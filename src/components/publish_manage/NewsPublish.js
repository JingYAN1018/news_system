import React from 'react'
import { Button, Table} from 'antd'

export default function NewsPublish(props) {
    const newsCategoryList  =['时事新闻','环球经济','科学技术','军事世界','世界体育','生活理财']
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
                    {props.button(item.id)}
                </div>
            }
        }
    ];

    return (
        <div>
            <Table dataSource={props.dataSource} columns={columns}
                pagination={{
                    pageSize: 5
                }} 
                rowKey={item=>item.id}
                />
        </div>
    )
}