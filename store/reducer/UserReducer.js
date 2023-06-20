const initialState = {users: []};

function UserReducer(state=initialState,action){
    let nextState;
    switch(action.type){

        case'ADD_USER':
            nextState = {...state,
                users: [...state.users, action.value] 
        };
        return nextState;

        default:
             return state;
    }
}

export default UserReducer;

