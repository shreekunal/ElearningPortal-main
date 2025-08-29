import { useContext } from "react";
import { useNavigate } from "react-router";
import 'bootstrap/dist/css/bootstrap.min.css';
import Instructor from '../../assets/Instructor.svg';
import Teachers from '../../assets/Teachers.svg';
import { CurrentUserContext } from "../../App";
import Front_ENV from "../../../Front_ENV.jsx";
import {getCookie} from "../Cookie/Cookie.jsx";

const InstructorsPage = () => {
    const navigate = useNavigate();
    const {currentUser} = useContext(CurrentUserContext);

    const InstructorsList = async () => {
        const response = await fetch(`${Front_ENV.Back_Origin}/getUsers?role=Instructor`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': getCookie('token') || '',
            }
        })
            .then(response => response.json());
        navigate(`/CurrentInstructors`, {state: {instructorsList: response.data, isAdmin: true}})
    }

    const AddInstructor = () => {
        navigate('/AddInstructor');
    }

    return (
        <>
            <div className="add-material-component">
                <div className="card add-material-card" onClick={InstructorsList}>
                    <div className="add-material-header card-header green-bg light-text">
                        <h4>Current Instructors</h4>
                    </div>
                    <div className="card-body add-material-body ">
                        <img src={Teachers} alt="Assignment"/>
                    </div>
                </div>
                <div className="card add-material-card" onClick={AddInstructor}>
                    <div className="add-material-header card-header green-bg light-text">
                        <h4>New Instructor</h4>
                    </div>
                    <div className="card-body add-material-body">
                        <img src={Instructor} alt="Exam"/>
                    </div>
                </div>
            </div>
        </>

    )
}

export default InstructorsPage
