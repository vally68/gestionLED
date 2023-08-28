class UserAction {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}

export class AddUserAction extends UserAction {
    constructor(user) {
        super('ADD_USER', user);
    }
}

export class LoginSuccessAction extends UserAction {
    constructor(isLoggedIn) {
        super('LOGIN_SUCCESS', isLoggedIn);
    }
}

export class LogoutSuccessAction extends UserAction {
    constructor() {
        super('LOGOUT_SUCCESS');
    }
}

class UserReducerState {
    constructor(users = [], isLoggedIn = false, ide = 0) {
        this.users = users;
        this.isLoggedIn = isLoggedIn;
        this.ide = ide;
    }
}

function UserReducer(state = new UserReducerState(), action) {
    switch (action.type) {
        case 'ADD_USER':
            return new UserReducerState(
                [...state.users, action.value],
                state.isLoggedIn,
                state.ide
            );

        case 'LOGIN_SUCCESS':
            return new UserReducerState(
                state.users,
                action.value,
                state.ide
            );

        case 'LOGOUT_SUCCESS':
            return new UserReducerState(
                state.users,
                false,
                state.ide
            );

        case 'ADD_ID':
            return new UserReducerState(
                state.users,
                state.isLoggedIn,
                state.ide + 1
            );

        default:
            return state;
    }
}

export default UserReducer;
