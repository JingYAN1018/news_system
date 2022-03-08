
import NewsPublish from '../../../components/publish_manage/NewsPublish'
import usePublish from '../../../components/publish_manage/usePublish'
import { Button } from 'antd'
export default function Unpublished() {
  const {dataSource,handlePublish}=usePublish(1)
  return (
    <div>
      <NewsPublish dataSource={dataSource} button={(id)=><Button type='primary' onClick={()=>handlePublish(id)}>发布</Button>} ></NewsPublish>
    </div>
  )
}
