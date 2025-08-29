import { useContext } from "react";
import { CurrentUserContext } from "../../App";
import SignUp from "../Signup/Signup"
const AddInstructor = () => {
    const {currentUser} = useContext(CurrentUserContext);
  return (
      <SignUp isInstructor={true} adminId={currentUser.id}/>
  )
}

export default AddInstructor
