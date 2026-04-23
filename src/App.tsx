
import { Routes, Route, BrowserRouter } from 'react-router-dom';
export const BASE_NAME = import.meta.env.VITE_BASE_NAME_SITE;
export const CONF_NAME = import.meta.env.VITE_CONF_NAME_SITE;
import TestMain from './mainTest';
import RoomTest from './roomTest';
import AboutSite from './about';

function App() {
  return (

    <BrowserRouter basename={BASE_NAME}>
      <Routes>
        <Route path="/" element={<TestMain />} />
        <Route path="/room/:roomId" element={<RoomTest />} />
         <Route path="/about" element={<AboutSite />} />
      </Routes>
      {/* <button onClick={()=>{console.log(BASE_NAME,CONF_NAME)}}>check</button> */}
    </BrowserRouter>
  );
}

export default App;
