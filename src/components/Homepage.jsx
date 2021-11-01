import React,{useState} from 'react';
import NavBar from './NavBar';
import {Row,Col,Button,Modal,Form} from 'react-bootstrap';
import '../css/Homepage.css';
import HomePic from '../photos/home2.png';
import {motion} from 'framer-motion';
import BackendApi from './BackendApi.js';
function Homepage(){
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [register,setRegister]=useState(false);
    const [Otp,setOTP]=useState('');
    const [ResOtp,setResOTP]=useState('');
    const [errRegEmail,setRegEmail]=useState('We will never share your email with anyone else.');
    const [errOTP,setErrOTP]=useState('Enter OTP carefully.');
    const [userInfo,setuserInfo]=useState({
        RegEmail:"",
        password:"",
    });
    const [errPassword,setPassword]=useState('Please keep a strong password.');
    async function UpdateUserInfo(e){
        setuserInfo({...userInfo,[e.target.name]:e.target.value});
        if(e.target.name==='password'){
            setPassword(e.target.value);
        }
        if(e.target.name==='OTP'){
          setOTP(e.target.value);
      }
    }
    async function OtpUserInfo(){
        let EmailChk=true;
        let PasswordChk=true;
        let regEx_Email=/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
        let regEx_Password=/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
        PasswordChk=regEx_Password.test(userInfo.password);
        EmailChk=regEx_Email.test(userInfo.RegEmail);
        if(EmailChk&&PasswordChk){
          setRegister(true);
          await BackendApi.get('/nodemailer/'+userInfo.RegEmail).then((response)=>{
            console.log(response.data.chkcode);
            alert(response.data.msg);
            setResOTP(response.data.chkcode);
          })
          .catch((err)=>{
            console.error(err);
          })
        }
        else{
          if(EmailChk===false){
            setRegEmail('PLEASE ENTER CORRECT FORMAT OF EMAIL.');
          }
          if(PasswordChk===false){
            setPassword('PLEASE ENTER PASSWORD WITH FORMAT GIVEN BELOW.');
          }
        }
      }
      async function subUserInfo(){
        let formData=new FormData();
        for(let key in userInfo){
          formData.append(key,userInfo[key]);
        }
        if(Otp===ResOtp){
          await BackendApi.post('/user',formData,{headers:{'Content-Type': 'multipart/form-data'}}).then((response)=>{
            if(response.data.code===11000){
              alert("DUPLICATE ENTRY\nACCOUNT ALREADY EXISTS")
              }
              else{
                alert("ACCOUNT CREATED");
                handleClose();
                window.location.href='/profileform'+userInfo.RegEmail;
              }
          })
          .catch((err)=>{
            console.error(err);
          })
        }
        else{
          setErrOTP('OTP DID NOT MATCH');
        }
      }
    
    return(
        <motion.div exit={{opacity:0,}} animate={{opacity:1}} initial={{opacity:0}}>
        <NavBar></NavBar>
        <div className='container'>
        <Row>
            <Col md={8} className="image-container">
                    <img src={HomePic} alt="HOMEPAGE PIC" width="100%" height="100%">
                    </img>
                
            </Col>
            <Col md={3} className="quote_conatiner">
                <span className="word_1">MEDICINE</span><br></br>
                <span className="sentence">is a science of</span><br></br>
                <span  className="word">UNCERTAINITY</span><br></br>
                <span className="sentence">and an art of</span><br></br>
                <span  className="word">PROBABILITY</span><br></br>
                <Button variant="outline-success" style={{borderRadius:'50px',borderWidth:'3px'}} className='btn45' onClick={handleShow}>R E G I S T E R</Button>
                </Col>
        </Row>
        </div>
        <Modal show={show} onHide={handleClose}>
{
  !register?
  <div>        
  <Modal.Header style={{color:'white',backgroundColor:"black",margin:'2px'}}>
  <Modal.Title >REGISTER</Modal.Title>
  </Modal.Header>
  <Modal.Body>
  <Form>
  <Form.Group>
  <Form.Label>EMAIL ADDRESS</Form.Label>
  <Form.Control type="email" placeholder="ENTER EMAIL" name="RegEmail" onChange={UpdateUserInfo} style={{border:'2px black solid'}} />
  <Form.Text className="text-muted">
  {errRegEmail}
  </Form.Text>
  </Form.Group>

<Form.Group>
<Form.Label>PASSWORD</Form.Label>
<Form.Control type="password" placeholder="PASSWORD" name="password" onChange={UpdateUserInfo} style={{border:'2px black solid'}}/>  <Form.Text style={{fontWeight:'bold',color:'white',backgroundColor:'black',padding:"3px",borderRadius:'2px',marginTop:'10px',fontFamily:'Train One,cursive'}}>
{errPassword}
</Form.Text>
<Form.Text style={{fontWeight:'bolder',color:'red',marginTop:'20px'}}>
<ul>
<li>Min length 8 and Max length 16</li>
<li>Min 1 special charachter</li>
<li>Min 1 number</li>
</ul>
</Form.Text>
</Form.Group>
</Form>
</Modal.Body>
<Modal.Footer>
  <Button variant="secondary" onClick={handleClose}>
    CLOSE
  </Button>
  <Button variant="info" onClick={OtpUserInfo}>
    REGISTER
  </Button>
</Modal.Footer>
</div>:
    <div>  
        <Modal.Header style={{color:'white',backgroundColor:"black",margin:'2px'}}>
        <Modal.Title >VERIFICATION</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
  <Form.Group>
    <Form.Label>ENTER OTP</Form.Label>
    <Form.Control type="text" placeholder="ENTER OTP" name="OTP" id="OTP" onChange={UpdateUserInfo} style={{border:'2px black solid'}} />
    <Form.Text className="text-muted">
      {errOTP}
    </Form.Text>
  </Form.Group>
</Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="warning" onClick={OtpUserInfo}>
            RESEND OTP
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            CLOSE
          </Button>
          <Button variant="info" onClick={subUserInfo}>
            CHECK
          </Button>
        </Modal.Footer></div>
}
      </Modal>
        </motion.div> 
    );
}
export default Homepage;