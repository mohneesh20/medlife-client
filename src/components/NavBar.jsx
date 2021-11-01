import React,{useState}from 'react';
import logo from '../photos/medlife-logo-2D38B846E5-seeklogo.com.png'
import '../css/NavBar.css';
import {Navbar,Nav,Form,Button,Modal} from 'react-bootstrap';
import BackendApi from './BackendApi.js';
function NavBar(){
  const [show, setShow] = useState(false);
  const [LoginObj,setLoginInfo]=useState({
    RegEmail:'',
    password:'',
  });
  const [Newpsswrd,setNewpasswrdInfo]=useState({
    NewPassword:'',
    ConfirmNewPassword:'',
  });
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [errPassword,setPassword]=useState('Enter your Password correctly.');
  const [errRegEmail,setRegEmail]=useState('Enter your Email linked with your account.');
  const [userOTP,setUserOTP]=useState('Enter your sent OTP now.');
  const [OTP,setOTP]=useState('');
  const [responseObj,setResponse]=useState('');
  const [isForgtPasswrd,setForgetPasswrd]=useState(false);
  const [isForgtPasswrd2,setForgetPasswrd2]=useState(false);
  const [isChangePasswrd,setChangePasswrd]=useState(false);
  async function UpdateLoginInfo(e){
    setLoginInfo({...LoginObj,[e.target.name]:e.target.value});
    if(e.target.name==='password'){
      setResponse('');
        setPassword(e.target.value);
    }
    if(e.target.name==='OTP'){
      setUserOTP(e.target.value);
    }
    if(e.target.name==='NewPassword'||e.target.name==='ConfirmNewPassword'){
      setNewpasswrdInfo({...Newpsswrd,[e.target.name]:e.target.value});
    }
  }
  function doForgotPassword(e){
    if(e==='ForgotPassword'){
      setForgetPasswrd(true);
    }
    else{
      if(e==='Login'){
        setForgetPasswrd(false);
      }
    }
  }
  async function subLoginInfo(){
    let EmailChk=true;
        let PasswordChk=true;
        let regEx_Email=/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
        let regEx_Password=/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
        PasswordChk=regEx_Password.test(LoginObj.password);
        EmailChk=regEx_Email.test(LoginObj.RegEmail);
        if(EmailChk&&PasswordChk){
        await BackendApi.get('/login/'+LoginObj.RegEmail+'/'+LoginObj.password).then((response)=>{
          if(response.data.login===true){
            setResponse(response.data.msg);
            window.location.href='/Dashboard/'+LoginObj.RegEmail;  
          }
          else{
            setResponse(response.data.msg);
          }
        })
        .catch((err)=>{
          console.error(err);
          if(err.name==='Error'){
            window.location.reload();
            window.location.href='/';
        };
        })    
      }
        else{
          if(EmailChk===false){
            setRegEmail('PLEASE ENTER CORRECT FORMAT OF EMAIL.');
          }
          if(PasswordChk===false){
            setPassword('PLEASE ENTER PASSWORD WITH CORRECT FORMAT.');
          }
        }
  }
  async function nodemailer(){
    setRegEmail('');
    let EmailChk=true;
    let regEx_Email=/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    EmailChk=regEx_Email.test(LoginObj.RegEmail);
    if(EmailChk){
      await BackendApi.get('/nodemailer/'+LoginObj.RegEmail).then((response)=>{
        alert(response.data.msg);
        setRegEmail(response.data.msg);
        setForgetPasswrd2(true)
        document.getElementById('OTP').value='';
        setOTP(response.data.chkcode);
        setRegEmail('');
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
  async function doCheckOtp(){
    if(userOTP===OTP){
        setRegEmail('OTP CORRECT');
        setChangePasswrd(true);
        setRegEmail('');
    }
    else{
      setRegEmail('INCORRECT OTP');
    }
  }
  async function Changepassword(){
    let PasswordChk=true;
    let regEx_Password=/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
    PasswordChk=regEx_Password.test(Newpsswrd.NewPassword);
    if(PasswordChk){
      if(Newpsswrd.NewPassword===Newpsswrd.ConfirmNewPassword){
        await BackendApi.get('/updatePassword/'+LoginObj.RegEmail+'/'+Newpsswrd.NewPassword).then((response)=>{
          if(response.data.msg==="UPDATED"){
            alert("UPDATED")
          setForgetPasswrd(false);
          }
          else{
            alert(response.data.msg);
          }
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
  }
    return(
        <>
        <Navbar className="NavbarBg" expand="lg" id='Navbar'>
        <Navbar.Brand>
      <img
        src={logo}
        width="60px"
        height="30px"
        className="d-inline-block align-top"
        alt=""
        style={{borderRadius:'5px'}}
      />
    </Navbar.Brand>
    <Navbar.Brand href="/" style={{color:'green'}}>MedLife</Navbar.Brand>
  <Navbar.Toggle aria-controls="basic-navbar-nav" />
  <Navbar.Collapse id="basic-navbar-nav">
    <Nav className="mr-auto">
      <Nav.Link href="/" className='Links_Nav' style={{color:'green'}}>Home</Nav.Link>
      <Nav.Link href="#contact_us" style={{color:'green'}} className='Links_Nav'>Contact Us</Nav.Link>
    </Nav>
    <Form inline>
      <Button variant="outline-success" style={{borderRadius:'50px',borderWidth:'3px'}} onClick={handleShow}>L O G I N</Button>
    </Form>
  </Navbar.Collapse>
</Navbar>
<Modal show={show} onHide={handleClose}>
{
  !isForgtPasswrd ?
  <div>
          <Modal.Header style={{color:'white',backgroundColor:"black",margin:'2px'}}>
<Modal.Title >LOGIN</Modal.Title>
</Modal.Header>
<Modal.Body>
<Form>
<Form.Group>
<Form.Label>EMAIL ADDRESS</Form.Label>
<Form.Control type="email" placeholder="ENTER EMAIL" name="RegEmail" style={{border:'2px black solid'}} onChange={UpdateLoginInfo}/>
<Form.Text className="text-muted">
{errRegEmail}
</Form.Text>
</Form.Group>

<Form.Group>
<Form.Label>PASSWORD</Form.Label>
<Form.Control type="password" placeholder="PASSWORD" name="password" style={{border:'2px black solid'}} onChange={UpdateLoginInfo}/><Form.Text style={{fontWeight:'bold',color:'white',backgroundColor:'black',padding:"3px",borderRadius:'2px',marginTop:'10px',fontFamily:'Train One,cursive'}}>
{errPassword}
</Form.Text>
</Form.Group>
<center><span style={{fontWeight:'bolder',color:'red',fontSize:'20px'}}>{responseObj}</span></center>    
</Form>
</Modal.Body>
<Modal.Footer>
<Button variant="dark" onClick={()=>{doForgotPassword('ForgotPassword')}}>
    FORGET PASSWORD
  </Button>
  <Button variant="secondary" onClick={handleClose}>
    CLOSE
  </Button>
  <Button variant="info" onClick={subLoginInfo}>
    LOGIN
  </Button>
</Modal.Footer></div>:
  !isForgtPasswrd2?
  <div>       
<Modal.Header style={{color:'white',backgroundColor:"black",margin:'2px'}}>
<Modal.Title >FORGOT PASSWORD</Modal.Title>
</Modal.Header>
<Modal.Body>
<Form>
<Form.Group>
<Form.Label>EMAIL ADDRESS</Form.Label>
<Form.Control type="email" placeholder="ENTER EMAIL" name="RegEmail" style={{border:'2px black solid'}} onChange={UpdateLoginInfo}/>
<Form.Text className="text-muted">
{errRegEmail}
</Form.Text>
</Form.Group>
</Form>
</Modal.Body>
<Modal.Footer>
<Button variant="dark" onClick={()=>{doForgotPassword('Login')}}>
    LOGIN
  </Button>
  <Button variant="secondary" onClick={handleClose}>
    CLOSE
  </Button>
  <Button variant="info" onClick={nodemailer}>
    SUBMIT
  </Button>
</Modal.Footer></div>:
!isChangePasswrd?<div>        
<Modal.Header style={{color:'white',backgroundColor:"black",margin:'2px'}}>
<Modal.Title >ENTER OTP</Modal.Title>
</Modal.Header>
<Modal.Body>
<Form>
<Form.Group>
<Form.Label>ENTER OTP</Form.Label>
<Form.Control type="text" placeholder="ENTER OTP" name="OTP" id='OTP' style={{border:'2px black solid'}} onChange={UpdateLoginInfo}/>
<Form.Text className="text-muted">
{errRegEmail}
</Form.Text>
</Form.Group>
</Form>
</Modal.Body>
<Modal.Footer>
<Button variant="warning" onClick={nodemailer}>
    RESEND OTP
  </Button>
  <Button variant="secondary" onClick={handleClose}>
    CLOSE
  </Button>
  <Button variant="info" onClick={doCheckOtp}>
    CHECK
  </Button>
</Modal.Footer></div>:<div>        
        <Modal.Header style={{color:'white',backgroundColor:"black",margin:'2px'}}>
        <Modal.Title >CHANGE PASSWORD</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
  <Form.Group>
    <Form.Label>NEW PASSWORD</Form.Label>
    <Form.Control type="text" placeholder="ENTER NEW PASSWORD" id='NewPassword' name='NewPassword' style={{border:'2px black solid'}} onChange={UpdateLoginInfo}/>
    <Form.Text className="text-muted">
      {errPassword}
    </Form.Text>
  </Form.Group>
  <Form.Group>
    <Form.Label>CONFIRM PASSWORD</Form.Label>
    <Form.Control type="text" placeholder="CONFIRM NEW PASSWORD" id='ConfirmNewPassword' name='ConfirmNewPassword' style={{border:'2px black solid'}} onChange={UpdateLoginInfo}/>
    <Form.Text className="text-muted">
    </Form.Text>
  </Form.Group>
  <Form.Text style={{fontWeight:'bolder',color:'red',marginTop:'20px'}}>
      <ul>
        <li>Min length 8 and Max length 16</li>
        <li>Min 1 special charachter</li>
        <li>Min 1 number</li>
      </ul>
  </Form.Text>
</Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            CLOSE
          </Button>
          <Button variant="info" onClick={Changepassword}>
            CHANGE PASSWORD
          </Button>
        </Modal.Footer></div>

}
      </Modal>
      </>
    );
}
export default NavBar;