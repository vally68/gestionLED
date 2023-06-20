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
            nextState =
            {
                ...state,
                isLoggedIn: action.value
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

