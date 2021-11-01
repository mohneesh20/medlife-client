import React,{useState,useEffect} from 'react';
import {useParams} from 'react-router-dom'
import Navbar2 from './Navbar2';
import {Row,Col,Card,Button} from 'react-bootstrap';
import '../css/Dashboard.css';
import {motion} from 'framer-motion';
import BackendApi from './BackendApi.js';
function Dashboard(){
    const [responseObj,setResponseObj]=useState("");
    const {RegEmail}=useParams();
    useEffect(()=>{
        fetchdata(); 
    },[]);
    async function fetchdata(){
        await BackendApi.get('/dashInfo/'+RegEmail).then((response)=>{
            setResponseObj(response.data[0]);
        })
        .catch((err)=>{
            console.error(err);
            if(err.name==='Error'){
                window.location.reload();
                window.location.href='/';
            };
        })
 
    }
    async function doRoutePostMed(){
        const {city,homestate}=responseObj;
        window.location.reload();
        window.location.href="/PostMed/"+RegEmail+"/"+city+"/"+homestate;
    }
    async function doRouteMedicineManager(){
        window.location.reload();
        window.location.href="/Medman/"+RegEmail;
    }
    async function doUpdateProfile(){
        window.location.reload();
        window.location.href="/updateProfile/"+RegEmail;
    }
    async function doRouteSearchMed(){
        window.location.reload();
        window.location.href='/searchMed';
    }
 
    return (
        <motion.div exit={{opacity:0}} animate={{opacity:1}} transition={{delay:0.1}} initial={{opacity:0}}>
        <Navbar2></Navbar2>
        <div className='container-dash'>
        <h1 className='dash_header'>DASHBOARD</h1>
        <div className='main_info'>
            <Row>
                <Col md={6} className='image_dash'>
                <div className="profilePic_dash">
                    <img src={`../uploads/${responseObj.ProfilePic}`} alt="PROFILE PIC" width="100%" height="100%"></img>
                </div>
                <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                    <h6 style={{fontWeight:'bolder',fontSize:'30px',color:'goldenrod'}}>MY PROFILE</h6>
                    <table>
                        <tbody>
                        <tr key={1}>
                            <th>Name:</th>
                            <td>{responseObj.username}</td>
                        </tr>
                        <tr key={2}>
                            <th>Mobile:</th>
                            <td>{responseObj.mobile}</td>
                        </tr>                        
                        <tr key={3}>
                            <th>Address:</th>
                            <td style={{wordWrap:'break-word'}}>{responseObj.address}</td>
                        </tr> 
                        <tr key={4}>
                            <th>State:</th>
                            <td>{responseObj.homestate}</td>
                        </tr>
                        <tr key={5}>
                            <th>City:</th>
                            <td>{responseObj.city}</td>
                        </tr>
                        <tr key={6}>
                            <th>Mail:</th>
                            <td>{responseObj.RegEmail}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <Row style={{marginTop:"10px"}}>
                    <Button variant="info" onClick={doUpdateProfile} style={{width:'100%'}}>UPDATE</Button> 
                </Row>
                </Col>
                <Col md={5}>
                    <Row>
                        <Col md={12}>
                        <Card className="cardd">
                        <Card.Header as="h2" style={{fontWeight:"800",color:'goldenrod'}}>POST MEDICINE</Card.Header>
                        <Card.Body>
                        <Card.Title style={{color:'goldenrod'}}>Post medicine information you want to donate.</Card.Title>    
                        <Button variant="info" onClick={doRoutePostMed} style={{width:'100%'}}>POST</Button>
                        </Card.Body>
                        </Card>
                        </Col>
                        <Col md={12}>
                        <Card className="cardd">
                        <Card.Header as="h2" style={{fontWeight:"800",color:'goldenrod'}}>MEDICINE MANAGER</Card.Header>
                        <Card.Body>
                        <Card.Title style={{color:'goldenrod'}}>View/Delete the postings of your medicines.</Card.Title>
                        <Button variant="info" onClick={doRouteMedicineManager} style={{width:'100%'}}>MANAGE</Button>
                        </Card.Body>
                        </Card>
                        </Col>
                        <Col md={12}>
                        <Card className="cardd">
                        <Card.Header as="h2" style={{fontWeight:"800",color:'goldenrod'}}>SEARCH MEDICINE</Card.Header>
                        <Card.Body>
                        <Card.Title style={{color:'goldenrod'}}>Search the medicine you are looking for.</Card.Title>
                        <Button variant="info" onClick={doRouteSearchMed} style={{width:'100%'}}>SEARCH</Button>
                        </Card.Body>
                        </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
        </div>
        </motion.div>
    )
}
export default Dashboard;