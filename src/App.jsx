
import './App.css'
import Home from './Components/Home.jsx';
import LogIn from './Components/LogIn.jsx';
import Notes from './Components/Notes.jsx';
import SignUp from './Components/SignUp.jsx';
import ViewNote from './Components/viewNote.jsx';
import EditNote from './Components/EditNote.jsx';
import CreateNote from './Components/CreateNote.jsx';
import ChangePassword from './Components/ChangePassword.jsx';

import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';

function App() {
  

  return (
    <>
       
        <Router>
        <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/signUp">SignUp</Link>
            </li>
            <li>
              <Link to="/login">login</Link>
            </li>
            <li>
              <Link to="/settings">Settings</Link>
            </li>
            <li>
              <Link to="/newNote">Create Note:</Link>
            </li>
            <li>
              <Link to="/notes">View Notes:</Link>
            </li>
          </ul>
          
        </nav>
        </div>

        <Routes>
          <Route exact path='/' Component={Home}/>
          <Route exact path='/SignUp' Component={SignUp}/>
          <Route exact path='/login' Component={LogIn}/>
          <Route  path='/settings' Component={ChangePassword}/>
          <Route  path='/newNote' Component={CreateNote}/>
          <Route  path='/notes' Component={Notes}/>
          <Route  path='/modifynote/:noteId' Component={EditNote}/>
          <Route  path='/note/:noteId' Component={ViewNote}/>
        </Routes>
        </Router>
        
    </>
  )
}

export default App
