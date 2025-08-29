import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import ScrollToTop from './Components/ScrollToTop/ScrollToTop.jsx'
import "@fontsource/roboto";

createRoot(document.getElementById("root")).render(
  <>
    <BrowserRouter>
    {/* component to manage scroll to tog on every route change */}
     <ScrollToTop/>
      <App />
    </BrowserRouter>
  </>
);
