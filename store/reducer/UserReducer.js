const initialState = {
    users: [],
    isLoggedIn: false
};

export const addUser = (user) => ({
    type: 'ADD_USER',
    value: user
});

export const loginSuccess = (isLoggedIn) => ({
    type: 'LOGIN_SUCCESS',
    value: isLoggedIn
});

export const logoutSuccess = (isLoggedIn) => ({
    type: 'LOGOUT_SUCCESS',
    value: isLoggedIn
});

function UserReducer(state = initialState, action) {
    let nextState;
    switch (action.type) {
        case 'ADD_USER':
            nextState = {
                ...state,
                users: [...state.users, action.value]
            };
            return nextState;

        case 'LOGIN_SUCCESS':
            nextState = {
                ...state,
                isLoggedIn: action.value
            };
            return nextState;

        case 'LOGOUT_SUCCESS':
            nextState = {
                ...state,
                isLoggedIn: action.value
            };
            return nextState;

        default:
            return state;
    }
}

export default UserReducer;
