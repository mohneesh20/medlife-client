import React,{useState,useEffect} from 'react';
import {Row,Col,Form,Card,Button,Carousel,Modal} from 'react-bootstrap';
import '../css/ProfileForm.css';
import '../css/SearchMed.css';
import Navbar2 from './Navbar2';
import {motion} from 'framer-motion';
import BackendApi from './BackendApi.js';
function SearchMed(){
  const [cities,setCities]=useState([]);
  const [cty,setCty]=useState();
  const [medd,setmedd]=useState();
  const [Meds,setMeds]=useState([]);
  const [Medicine,setMedicine]=useState([]);
  const [errCity,setErrCity]=useState('');
  const [errMed,setErrMed]=useState('');
  const [supply,setSupplier]=useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  useEffect(()=>{
    fetchdata();
},[cty,medd]);
async function fetchdata(){
  await BackendApi.get('/fetchCities').then((response)=>{
    setCities(response.data);
  })
  .catch((err)=>{
      console.error(err);
      if(err.name==='Error'){
        window.location.reload();
        window.location.href='/';
    };
  })
}
async function fetchMed(e){
    if(e==='undefined'){
        setErrCity("PLEASE SELECT A VALID CITY");
    }
    else{
    setErrCity('');
    setCty(e);
    document.getElementById('select_medicine').value=undefined;
    setMedicine([]);
    await BackendApi.get('/fetchMed/'+e).then((response)=>{
        setMeds(response.data);
    })
    .catch((err)=>{
        console.error(err);
        if(err.name==='Error'){
            window.location.reload();
            window.location.href='/';
        };
    })
  }
}
async function fetchMedInfo(e){
    if(e==='undefined'){
        setErrMed('PLEASE SELECT A VALID MEDICINE NAME');
    }
    else{
        setErrMed('');
        setmedd(e);
        await BackendApi.get('/fetchMedicine/'+e+'/'+cty).then((response)=>{
        setMedicine(response.data);
        })
        .catch((err)=>{
            console.error(err);
            if(err.status===401){
                window.location.reload();
                window.location.href='/';
            };
        })
    }
}
async function fetchSup(e){
    await BackendApi.get('/fetchSupplier/'+e).then((response)=>{
        setSupplier(response.data[0]);
        handleShow(); 
    })
    .catch((err)=>{
        console.error(err);
        if(err.name==='Error'){
            window.location.reload();
            window.location.href='/';
        };
    })
}
    return(
    <motion.div exit={{opacity:0}} animate={{opacity:1}} initial={{opacity:0}}>
        <Navbar2></Navbar2>
        <div className="container">
            <h1>SEARCH MEDICINES</h1>
            <Row style={{marginTop:'20px'}}>
                <Col md={12}>
                <Row>
                    <Col md={6}>
                    <Form.Group>
                    <Form.Label className="formTitle">SELECT CITY</Form.Label>
                    <Form.Control as="select" className='selectdiv' custom onChange={(e)=>{fetchMed(e.target.value)}}>
                        <option value='undefined'>SELECT CITY</option>
                    {
                        cities.map((city,index)=>{
                            return(
                            <option value={city}key={index}>{city}</option>
                            );

                        })
                    }
                    </Form.Control>
                    <Form.Text className="text-muted">
                    {errCity}
                    </Form.Text>
                    </Form.Group>
                    </Col>
                    <Col md={6}>
                    <Form.Group>
                    <Form.Label className="formTitle">SELECT MEDICINE</Form.Label>
                    <Form.Control as="select"className='selectdiv' id='select_medicine' custom onChange={(e)=>{fetchMedInfo(e.target.value)}}>
                        <option value="undefined">SELECT MEDICINE</option>
                    {
                        Meds.map((med,index)=>{
                            // let medInfo={
                            //     MedName:med.MedName,
                            //     City:med.city
                            // }
                            return(
                            <option value={med.MedName} key={index}>{med.MedName}</option>
                            );

                        })
                    }
                    </Form.Control>
                    <Form.Text className="text-muted">
                    {errMed}
                    </Form.Text>
                    </Form.Group>
                    </Col>
                </Row>
               </Col>
               </Row>
               <Row>
                   {
                       Medicine.map((med,index)=>{
                           return(
                            <Col md={4} key={index}>
                        <center><Card className="card_style">
                        <Carousel style={{padding:'4px',borderBottom:'2px goldenrod solid'}}>
                        <Carousel.Item>
                            <img
                            src={`../uploads/${med.FrontView}`}
                            alt="First slide"
                            width='350px'
                            height="200px"
                            />
                            <Carousel.Caption>
                            <h3>Front View</h3>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                            src={`../uploads/${med.RearView}`}
                            alt="Second slide"
                            width='350px'
                            height="200px"
                            />
                            <Carousel.Caption>
                            <h3>Rear View</h3>
                            </Carousel.Caption>
                        </Carousel.Item>
                        </Carousel>
                        <Card.Body>
                        {/* <Card.Title style={{color:'white'}}>{med.MedName}</Card.Title> */}
                        <Card.Text style={{fontWeight:'bold',textAlign:"left",color:'goldenrod'}}>
                        Company:{med.Company}<br></br>
                        Expiry Date:<span style={{color:'red'}}>{med.ExpiryDate}</span><br></br>
                        Quantity:{med.Quantity}<br></br>
                        Type:{med.MedType}
                        </Card.Text>
                        <Button variant="info" onClick={()=>{fetchSup(med.RegEmail)}}>INFO OF SUPPLIER</Button>
                        </Card.Body>
                        </Card></center>
                   </Col>
                            )
                       })
                   }
               </Row>
        </div>
        <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header style={{backgroundColor:'black',margin:'2px'}}>
          <Modal.Title style={{color:'white'}}>{supply.username}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Row>
                <Col md={12}>
                <Carousel style={{padding:'4px',borderBottom:'2px black solid'}}>
                        <Carousel.Item style={{backgroundColor:'black'}}>
                           <center>
                           <img
                            src={`../uploads/${supply.ProfilePic}`}
                            alt="First slide"
                            width='300px'
                            height="300px"
                            />
                           </center>
                            <Carousel.Caption>
                            <h3>Profile Pic</h3>
                            </Carousel.Caption>            
                        </Carousel.Item>
                        <Carousel.Item style={{backgroundColor:'black'}}>
                            <center>
                            <img
                            src={`../uploads/${supply.AadharPic}`}
                            alt="Second slide"
                            width='300px'
                            height="300px"
                            />
                            </center>
                            <Carousel.Caption>
                            <h3>Aadhar Pic</h3>
                            </Carousel.Caption>                           
                        </Carousel.Item>
                        </Carousel>   
                </Col>
            </Row>
            <Row>
                <Col md={12} style={{alignText:'left',fontWeight:'bolder',fontSize:'larger'}}>
                    EMAIL:{supply.RegEmail}<br></br>
                    MOBILE:{supply.mobile}<br></br>
                    ADDRESS:{supply.address}<br></br>
                    CITY:{supply.city}<br></br>
                    STATE:{supply.homestate}<br></br>
                    BLOOD GRP:{supply.bloodGrp}<br></br>
                </Col>
            </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            C L O S E
          </Button>
        </Modal.Footer>
      </Modal>
        </motion.div>
    );
}
export default SearchMed;