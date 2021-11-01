import React,{useState,useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {Row,Col,Form,Table,Button} from 'react-bootstrap';
import '../css/ProfileForm.css';
import Navbar2 from './Navbar2';
import {motion} from 'framer-motion';
import BackendApi from './BackendApi.js';
function MedManager(){
    const {RegEmail}=useParams();
    const [InfoArray,setInfoArray]=useState([{}]);
    useEffect(()=>{
      doFetchInfo();
  },[]);
  const [isRecord,setRecord]=useState(false);
async function doFetchInfo(){
    await BackendApi.get('/FetchInfo/'+RegEmail).then(response=>{
      if(response.data.length===0){
        setRecord(true);
      }
      else{
        setRecord(false);
        document.getElementById('TableInfo').hidden=false;
        setInfoArray(response.data);
      }
    })
    .catch((error)=>{
        console.error(error);
        if(error.name==='Error'){
          window.location.reload();
          window.location.href='/';
      };
    })
    
}
async function doDeleteRecord(id){
  await BackendApi.delete('/DeleteRecord/'+id).then(()=>{
  doFetchInfo();
  })
  .catch((error)=>{
    console.error(error);
    if(error.name==='Error'){
      window.location.reload();
      window.location.href='/';
  };
  })
}
    return(
    <motion.div exit={{opacity:0}} animate={{opacity:1}} transition={{delay:0.1}} initial={{opacity:0}}>
        <Navbar2></Navbar2>
        <div className="container">
            <h1 style={{fontFamily:'Roboto Mono',color:'goldenrod'}}>YOUR UPLOADED MEDICINES</h1>
          
                <Row>
                    <Col md={12}>
                    <Form.Group>
                    <Form.Label className="formTitle">REGISTERED EMAIL</Form.Label>
                    <Form.Control type="text" name="MedName" className='formInput' value={RegEmail} disabled style={{color:'black'}}/>
                    </Form.Group>
                    </Col>
                </Row>
        {
          !isRecord?<Row>
          <Col md={12}>
              <Table striped bordered hover variant="dark" id="TableInfo" hidden responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>MED NAME</th>
                  <th>COMPANY</th>
                  <th>EXPIRY DATE</th>
                  <th>MED TYPE</th>
                  <th>DELETE RECORD</th>
                </tr>
              </thead>
              <tbody>
                {
                  InfoArray.map((obj,index)=>{
                    return(
                     <tr key={index+1}>
                     <td key={index+2}>{index+1}</td>
                     <td key={index+3}>{obj.MedName}</td>
                     <td key={index+4}>{obj.Company}</td>
                     <td key={index+5}>{obj.ExpiryDate}</td>
                     <td key={index+6}>{obj.MedType}</td>
                     <td key={index+7}><Button variant="danger" style={{width:"100%",margin:"0px"}} onClick={()=>doDeleteRecord(obj._id)}>Delete</Button> </td>
                   </tr>
                    );
                  })
                }
              </tbody>
            </Table>
          </Col>
      </Row>:<h1 style={{marginTop:'10px',textAlign:'center',color:'red'}}>NO RECORDS FOUND</h1>
        }
        </div>
        </motion.div>
    );
}
export default MedManager;