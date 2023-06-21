import React, { useContext } from 'react';
import { Text, Button } from 'react-native';
import { connect } from 'react-redux';
import { AuthContext } from './AuthContext';
import { logoutSuccess } from '../store/reducer/UserReducer';

function Dashboard({ dispatch, isLoggedIn }) {
    const { setIsLoggedin } = useContext(AuthContext);

    const handleLogout = () => {
        setIsLoggedin(false);
        dispatch(logoutSuccess(false));
    };

    return (
        <>
            <Text>Contenu de Dashboard</Text>
            <Button title="Déconnexion" onPress={handleLogout} />
            {isLoggedIn && <Button title="Déconnexion" onPress={handleLogout} />}
        </>
    );
}

const mapStateToProps = (state) => ({
    isLoggedIn: state.isLoggedIn,
});

export default connect(mapStateToProps)(Dashboard);