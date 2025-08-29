import { NavLink } from 'react-router-dom'
import './Placeholder.css'

const Placeholder = ({ img, text, buttonText, buttonRoute, style }) => {
  return (
     <div className="container page-component" style={style? style : {}}>
         <img draggable='false' src={img} className="PlaceholderImage" alt="Placeholder"/>
         <div className="TextContainer">
            <h3>{text}</h3>
         </div>
        {buttonText && <div className="button-container">
          <NavLink to={buttonRoute} onDragStart={(e) => e.preventDefault()}
                   className="green-bg light-text placeholder-button">
              {buttonText}
          </NavLink>
          </div>}
     </div>
  )
}

export default Placeholder
