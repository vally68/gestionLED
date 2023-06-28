import {legacy_createStore as createStore} from 'redux';
import UserReducer from '../reducer/UserReducer';

export default createStore(UserReducer)