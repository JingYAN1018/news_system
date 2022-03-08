export const CollapsedReducer=(prevState ={
    //与SideMenu中控制侧边栏的折叠与展开的控制属性名称一致
    //isCollapsed可以通过store引入，在TopHeader中拿到
    isCollapsed:false
},action)=>{
    // console.log(action)
    let {type} = action
    switch(type){
        case "change_collapsed":
            let newState ={...prevState}
            newState.isCollapsed = !newState.isCollapsed
            return newState
        default:
            return prevState
    }
}