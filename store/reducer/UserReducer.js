const initialState = {users: [],
    currentUser:null}

function userReducer(state = initialState, action) {

    let nextState
    switch (action.type) {
        case 'ADD_USER':
            nextState = {
                ...state,
                users:[...state.users, action.value]
            }
            return nextState
        case'ADD_CURRENT_USER':
            nextState={
                ...state,
                currentUser:action.value
            }
            return nextState
        case 'DECONNEXION':
            nextState ={
                ...state,
                currentUser: null
            }
            return nextState
        default:
            return state
    }
}
export default userReducer