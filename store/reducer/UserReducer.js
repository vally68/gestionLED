const initialState = {users: [], isLoggedIn: false, ide:0};

function UserReducer(state=initialState,action){
    let nextState;
    switch(action.type){

        case 'ADD_USER':
            nextState =
                {
                    ...state,
                    users: [...state.users, action.value]
                };
            return nextState;

        case 'LOGIN_SUCCESS':
            nextState =
                {
                    ...state,
                    isLoggedIn: action.value
                };
            return nextState;

        case 'LOGOUT_SUCCESS':
            nextState = {
                ...state,
                isLoggedIn: false
            };
            return nextState;


        case 'ADD_ID':
            nextState =
                {
                    ...state,
                    ide: state.ide + 1
                };
            return nextState;

        default:
            return state;
    }
}

export default UserReducer;

export class LoginSuccess {
    constructor(value) {
        this.value = value;
    }
}

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';

export class ADD_USER {
}

export const logoutSuccess = (value) => {
    return {
        type: 'LOGOUT_SUCCESS',
        value: value,
    };
};
