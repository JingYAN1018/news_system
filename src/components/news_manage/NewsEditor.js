import React,{useEffect, useState} from 'react'
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function NewsEditor(props) {
    
    const [editorState, setEditorState] = useState("")
    //这里接收从父组件编辑新闻中传递过来的content，将content从html转换为文本，再渲染到修改内容的markdown插件中
    useEffect(()=>{
        // console.log(props.content)
        // html-===> draft, 
        const html = props.content
        if(html===undefined) return 
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
          const editorState = EditorState.createWithContent(contentState);
          setEditorState(editorState)
        }
    },[props.content])

    return (
        <div>
            <Editor
                editorState={editorState}
                // 类名称
                toolbarClassName="aaaaa" 
                wrapperClassName="bbbbb"
                editorClassName="ccccc"
                // 随时保存编辑状态的改变
                onEditorStateChange={(editorState)=>setEditorState(editorState)}
                // 失去焦点时，会保存现有编辑内容，并将内容转换为html格式
                onBlur={()=>{
                    // console.log()
                    //将输入在对话框中的内容转换为html
                    props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
                }}
                rules
            />
        </div>
    )
}