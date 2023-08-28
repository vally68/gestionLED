import React, { createContext, useState } from 'react';

class AuthContextValue {
    constructor(isLoggedIn, setLoggedIn) {
        this.isLoggedIn = isLoggedIn;
        this.setLoggedIn = setLoggedIn;
    }
}

export const AuthContext = createContext();

export class AuthProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedin: false,
            setLoggedin: this.setLoggedin.bind(this),
        };
    }

    setLoggedin(value) {
        this.setState({ isLoggedin: value });
    }

    render() {
        return (
            <AuthContext.Provider value={new AuthContextValue(this.state.isLoggedin, this.setLoggedin)}>
                {this.props.children}
            </AuthContext.Provider>
        );
    }
}
