import {useContext, useEffect, useState} from 'react';
import { useParams, useNavigate } from 'react-router';
import UserCard from '../UserCard/UserCard';
import Placeholder from '../Placeholder/Placeholder.jsx';
import NoInstructorsImg from '../../assets/Instructor.svg';
import { CurrentUserContext } from "../../App.jsx";
import {useLocation} from "react-router-dom";
import Front_ENV from "../../../Front_ENV.jsx";
import {getCookie} from "../Cookie/Cookie.jsx";

const InstructorsList = () => {
    const { showMessage } = useContext(CurrentUserContext);
    const [ instructorsList, setInstructorsList ] = useState([]);
    const [ updateList, setUpdateList ] = useState(false);
    const {id,CourseId} = useParams();
    const navigate = useNavigate();
    const route = useLocation();

    const fetchInstructors = async () => {
        const params = new URLSearchParams({
            courseId: id,
            type: 'instructors'
        });
        if (route.state.isAdmin) {

            const response = await fetch(`${Front_ENV.Back_Origin}/getUsers?role=Instructor`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': getCookie('token') || '',
                }
            })
                .then(response => response.json());
            if (response.error) {
                showMessage(response.error, true);
                return
            }
            setInstructorsList(response.data);
            route.state = {instructorsList: response.data, isAdmin: true};

        } else if(!route.state.assignInstructor) {
            const response = await fetch(`${Front_ENV.Back_Origin}/getCourseUsersList?${params}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': getCookie('token') || '',
                }
            })
                .then(response => response.json());
            if (response.error) {
                showMessage(response.error, true);
                return
            }
            setInstructorsList(response.data);
            route.state = {instructorsList: response.data};
        }
        else{
                const response = await fetch(`${Front_ENV.Back_Origin}/getUsers?role=Instructor&courseID=${CourseId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': getCookie('token') || '',
                    }
                })
                    .then(response => response.json());
                    setInstructorsList(response.data);
                    route.state =  {instructorsList: response.data, assignInstructor: true}
        
        }
    }

    useEffect(() => {
        if (!route.state) {
            setInstructorsList([]);
            showMessage("Access Denied", true);
            navigate(`/CourseDetails/${id}`);
        } else {
            fetchInstructors();
        }
    }, [updateList]);

    return (
        <>
            <button className="goBackBtn" style={{top: "35px", left: "85px"}}
                    onClick={() => {
                        route.pathname.includes("AssignInstructor") ?
                            navigate(`/CourseDetails/${CourseId}`)
                        :
                            (
                                route.state.isAdmin ?
                                    navigate('/InstructorsPage')
                                :
                                    navigate(`/CourseDetails/${id}`)
                            )
            
                    }}>
                <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024">
                    <path
                        d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path>
                </svg>
                <span>Back</span>
            </button>
            <div className="d-flex flex-column mt-5">
                <h5 className="sub-title">{route.state.assignInstructor? "":instructorsList.length} {route.state.isAdmin?"Instructors" : route.state.assignInstructor? "Assign Instructors":"Course Instructors"} </h5>
                {!instructorsList.length && <Placeholder text="No Instructors Added" img={NoInstructorsImg}/>}
                {instructorsList.map(instructor => (
                    <UserCard setUpdateList={setUpdateList} updateList={updateList}
                              isStudent={false} instructor={instructor} key={instructor.id}
                              student={false} isAdmin={route.state.isAdmin} isAssigned={instructor.isAssigned}
                              assignInstructor={route.state.assignInstructor} courseId ={CourseId}/>
                ))}
            </div>
        </>
    )
}

export default InstructorsList