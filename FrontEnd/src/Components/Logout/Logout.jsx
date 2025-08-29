import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router';
import {deleteCookie, getCookie} from "../Cookie/Cookie.jsx";
import { CurrentUserContext } from "../../App.jsx";
import {Back_Origin} from '../../../Front_ENV.jsx';
import axios from "axios";

const Logout = () => {
    const navigate = useNavigate();
    const { setCurrentUser, setIsAuthenticated, showMessage } = useContext(CurrentUserContext);

    useEffect(() => {
        const asyncFunc = async () => {
            try {
                if (getCookie('token')) {
                    await axios.post(`${Back_Origin}/logout`);
                    deleteCookie('token');
                    showMessage("You Logged Out Successfully", null);
                    setCurrentUser({});
                    setIsAuthenticated(false);
                    navigate('/');
                }
            } catch (error) {
                showMessage("An error occurred", "error");
            }
        }
        asyncFunc();
    }, []);

    return null;
}

export default Logout
