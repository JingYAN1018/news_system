import {createStore,combineReducers} from 'redux'
import {CollapsedReducer} from './reducers/CollapsedReducer'
import {LoadingReducer} from './reducers/LoadingReducer'
import {persistStore,persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
//状态管理持久化，即重新加载页面时，被store管理的reducer状态值不会被清除
const persistConfig ={
    key:'jira',
    storage,
    //黑名单，名单中的reducer不会被持久化
    blacklist:['LoadingReducer']
}
const reducer = combineReducers({
    CollapsedReducer,
    LoadingReducer
})
const persistedReducer = persistReducer(persistConfig,reducer)
const store = createStore(persistedReducer)
const persistor = persistStore(store)
export  {
    store,
    persistor
}
