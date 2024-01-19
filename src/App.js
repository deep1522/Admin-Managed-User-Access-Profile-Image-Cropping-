import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import About from './components/About';
import Alert from './components/Alert';
import Home from './components/Home';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Signup from './components/Signup';
// import PhotoState from './context/photos/PhotoState';


function App() {
  return (
    <main>
    {/* <PhotoState> */}
    <BrowserRouter>
    <Navbar/>
    <Alert message=""/>
    <div className="container">
      
      <Routes>
        <Route path='/home' element={<Home/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>

      </Routes>
      </div>
    </BrowserRouter>
    {/* </PhotoState> */}
    </main>
  );
}

export default App;
