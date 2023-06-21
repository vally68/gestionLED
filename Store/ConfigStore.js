import {legacy_createStore as createStore} from 'redux';
import UserReducer from './Reducer/UserReducer';

export default createStore(UserReducer);