import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore.jsx";
import PropTypes from 'prop-types'
import { useRecipientStore } from "../store/useRecipientStore.jsx";
const ToggleButton = ({Available,Id}) => {  
  const [isToggled, setIsToggled] = useState(Available);
  const {updateProfile} = useAuthStore()
  
  const isOtherUserProfile = Id ? true : false

  const handleChange = async()=>{
    const newState = !isToggled
    setIsToggled(newState)
    console.log("available = "+ newState)
    await updateProfile({available:newState})
  }   
  
  return (
    <label className={`flex items-center ${isOtherUserProfile ? '': 'cursor-pointer'}`}>
      <input
        type="checkbox"
        className="sr-only"
        // checked={available}
        checked={Available || ""}
        disabled={isOtherUserProfile ? true : false}
        onChange={() => !isOtherUserProfile ? handleChange() : ""}
      />
      <div
        className={`w-11 h-6 rounded-full transition-all duration-300 relative ${
          isToggled ? "bg-red-600" : "bg-gray-300"
        }`}
      >
        <div
          className={`w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-all duration-300 transform ${
            isToggled ? "translate-x-5" : ""
          }`}
        ></div>
      </div>
    </label>
  );
};

ToggleButton.propTypes = {
  Available:PropTypes.bool,
  Id:PropTypes.string
}

export default ToggleButton;
