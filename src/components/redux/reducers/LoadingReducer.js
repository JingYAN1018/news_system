export const LoadingReducer=(prevState ={
    //与SideMenu中控制侧边栏的折叠与展开的控制属性名称一致
    //isCollapsed可以通过store引入，在TopHeader中拿到
    isLoading:false
},action)=>{
    // console.log(action)
    let {type,payload} = action
    switch(type){
        case "change_loading":
            let newState ={...prevState}
            newState.isLoading = payload
            return newState
        default:
            return prevState
    }
}