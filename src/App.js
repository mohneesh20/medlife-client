import React,{useLocation} from 'react';
import {Switch,Route} from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import Homepage from './components/Homepage';
import ProfileForm from './components/ProfileForm';
import Dashboard from './components/Dashboard';
import PostMed from './components/PostMed';
import MedManager from './components/MedManager';
import SearchMed from './components/SearchMed';
import UpdateProfile from './components/UpdateProfile';
import {AnimatePresence} from 'framer-motion';
import Admin from './components/Admin';
import './index.css';
import BackendApi from './components/BackendApi';
function App(){
    const location=useLocation;
    BackendApi.defaults.withCredentials=true;
    if(!!window.performance && window.performance.navigation.type === 2)
    {
    console.log('Reloading');
    window.location.reload();
    }
return(
<AnimatePresence exitBeforeEnter>
<Switch location={location}>
    <Route exact path='/' component={Homepage}></Route>
    <Route exact path='/Admin' component={Admin}></Route>
    <Route exact path='/profileform:RegEmail' component={ProfileForm}></Route> 
    <Route exact path='/Dashboard/:RegEmail' component={Dashboard}></Route> 
    <Route exact path='/updateProfile/:RegEmail' component={UpdateProfile}></Route>
    <Route exact path='/PostMed/:RegEmail/:city/:homestate' component={PostMed}></Route>
    <Route exact path='/MedMan/:RegEmail' component={MedManager}></Route>  
    <Route exact path='/searchMed' component={SearchMed}></Route>  
</Switch>
</AnimatePresence>
);
}
export default App;