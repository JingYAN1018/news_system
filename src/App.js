import './App.css'
import {Provider} from 'react-redux'
import 'antd/dist/antd.css';
import IndexRouter from './router/IndexRouter';
import {store,persistor} from './components/redux/store';
import {PersistGate} from 'redux-persist/integration/react'
//引入Provider，为整个根组件包装一个react-redux，并将store传递给App.js
function App(){
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <IndexRouter></IndexRouter>
      </PersistGate>
    </Provider>
      
  );
}

export default App;
