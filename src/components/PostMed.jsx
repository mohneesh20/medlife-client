import React,{useState,useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {Row,Col,Form,Button} from 'react-bootstrap';
import '../css/ProfileForm.css';
import '../css/SearchMed.css';
import Navbar2 from './Navbar2';
import fropic from '../photos/download (1)p.png';
import reapic from '../photos/download.png';
import {motion} from 'framer-motion';
import BackendApi from './BackendApi.js';
function PostMed(){
    const [chk,setChk]=useState(true);
    const {RegEmail,city,homestate}=useParams();
    const [selectedFile, setSelectedFile] = useState();
    const [selectedFileRear, setSelectedFileRear] = useState();
    const [preview, setPreview] = useState({fropic});
    const [previewAadhar, setPreviewRear] = useState({reapic});
    const [MedInfo,setMedInfo]=useState({
    MedName:"",
    Company:"",
    Quantity:"",
    ExpiryDate:"",
    MedType:"",
    FrontView:null,
    RearView:null,
    city:"",
    homestate:"",
    RegEmail:""
    });
    useEffect(() => {
        if(chk){
            BackendApi.get('/ChkLogin').then((response)=>{
                console.log(response.data.msg);
            })
            .catch(e=>{
                console.error(e);
                if(e.name==='Error'){
                    window.location.reload();
                    window.location.href='/';
                }
            })
            setChk(false);
        }
        if (!selectedFile) {
            setPreview(fropic);
        }
        else{
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);
        }
        if (!selectedFileRear) {
            setPreviewRear(reapic);
        }
        else{
        const objectUrl = URL.createObjectURL(selectedFileRear);
        setPreviewRear(objectUrl);
        }

    }, [selectedFile,selectedFileRear,chk]);
    const [errMob,setMobErr]=useState("");
    function UpdateMedInfo(event){
        setMobErr("");
        const {name,value}=event.target;
        setMedInfo({
            ...MedInfo,[name]:value,
        });

    }
    
    async function submitRec(){
        let formData=new FormData();
        MedInfo.RegEmail=RegEmail;
        MedInfo.city=city;
        MedInfo.homestate=homestate;
        for(let key in MedInfo){
            formData.append(key,MedInfo[key]);
        }
        if(MedInfo.MedType==="none" ||MedInfo.MedType===""){
            setMobErr("PLEASE SELECT MEDICINE TYPE")
        }
        else{
            setMobErr("");
            await BackendApi.post('/MedInfo',formData,{headers:{'Content-Type':'multipart/form-data'}}).then(()=>{
            alert('ROUTING YOU TO DASHBOARD');
            window.location.href="/Dashboard/"+RegEmail;
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
    function UpdateFrontView(e){
        setMedInfo({...MedInfo,[e.target.name]:e.target.files[0]});
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined);
            return
        }
        setSelectedFile(e.target.files[0])
    }
    function UpdateRearView(e){
        setMedInfo({...MedInfo,[e.target.name]:e.target.files[0]});
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFileRear(undefined);
            return
        }
        setSelectedFileRear(e.target.files[0]);
    }
    return(
    <motion.div exit={{opacity:0}} animate={{opacity:1}} initial={{opacity:0}}>
        <Navbar2></Navbar2>
        <div className="container">
            <h1 style={{fontFamily:'Roboto Mono',color:'goldenrod'}}>MEDICINE DETAILS</h1>
            <Row>
                <Col md={7}>
                <Row>
                    <Col md={12}>
                    <Form.Group>
                    <Form.Label className="formTitle">MEDICINE NAME</Form.Label>
                    <Form.Control type="text" name="MedName" className='formInput' placeholder="Enter Medicine Name" onChange={UpdateMedInfo}/>
                    </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={4}>
                    <Form.Group>
                    <Form.Label className="formTitle">COMPANY NAME</Form.Label>
                    <Form.Control type="text" name="Company" onChange={UpdateMedInfo} className='formInput' placeholder="Enter Company Name"/>
                    </Form.Group> 
                    </Col>
                    <Col md={4}>
                    <Form.Group>
                    <Form.Label className="formTitle">QUANTITY</Form.Label>
                    <Form.Control type="text" name="Quantity" onChange={UpdateMedInfo} className='formInput' placeholder="Enter "/>
                    <Form.Text className="text-muted">
                    </Form.Text>
                    </Form.Group> 
                    </Col>
                    <Col md={4}>
                    <Form.Group>
                    <Form.Label className="formTitle">EXPIRY DATE</Form.Label>
                    <Form.Control type="Date" name="ExpiryDate" onChange={UpdateMedInfo} className='formInput' placeholder="Enter Expiry Date"/>
                    <Form.Text className="text-muted">
                    </Form.Text>
                    </Form.Group> 
                    </Col>
                </Row>
                <Row>
                </Row>
                <Row>
                    <Col md={6}>
                    <Form.Group>
                    <Form.Label className="formTitle">MEDICINE TYPE</Form.Label>
                    <Form.Text className="text-muted">
                    <select name="MedType" id="MedType" className="MedType" onChange={UpdateMedInfo}>
                        <option value="none">SELECT TYPE</option>
                        <option value="BOTTLE">BOTTLE</option>
                        <option value="INJECTION">INJECTION</option>
                        <option value="TABLETS">TABLETS</option>
                        <option value="TUBE">TUBE</option>
                    </select>
                    </Form.Text>
                    <Form.Text className="text-muted">
                    {errMob}
                    </Form.Text>
                    </Form.Group> 
                    </Col>
                    
                </Row>
                <Row>
                    <Col md={6}>
                    <Form.Group>
                    <Form.Label className="formTitle">CHOOSE FRONT VIEW</Form.Label>
                    <Form.Control type="file" name="FrontView" onChange={UpdateFrontView} className='formInput2'/>
                    </Form.Group> 
                    </Col>
                    <Col md={6}>
                    <Form.Group>
                    <Form.Label className="formTitle">CHOOSE REAR VIEW</Form.Label>
                    <Form.Control type="file" name="RearView" onChange={UpdateRearView}  className='formInput2'/>
                    </Form.Group> 
                    </Col>
                </Row> 
                <Row id='desktop_button'>   
                        <Col md={12}>
                        <Button className="btn34"variant="outline-light" onClick={submitRec}>S U B M I T</Button>
                        </Col>
                
                </Row>
                </Col>
                <Col md={5}>
                   <center> <Row>
                        <Col md={12}>
                        <center><span style={{color:"goldenrod"}}>FRONT VIEW</span></center>
                            <div className="profilePic">
                                <img src={preview} alt="PROFILE PIC" width="100%" height="100%"  style={{borderRadius:'10px'}}></img>
                            </div>
                        </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                            <center><span style={{color:"goldenrod"}}>REAR VIEW</span></center>
                            <div className="aadharPic">
                            <img src={previewAadhar} alt="AADHAR PIC" width="100%" height="100%" style={{borderRadius:'10px'}}></img>
                            </div>
                        </Col>
                        </Row></center>
                </Col>
            </Row>
            <Row id='mobile_button'>   
                        <Col md={6}>
                        <Button className="btn34"variant="outline-light" onClick={submitRec}>S U B M I T</Button>
                        </Col>
                
                </Row>
        </div>
        </motion.div>
    );
}
export default PostMed;