import React,{useState,useEffect} from 'react';
import {Table,Button,Row,Col,FormControl} from 'react-bootstrap';
import BackendApi from './BackendApi.js';
function Admin(){
  const [users,setUsres]=useState([]);
  const [mail_msg,setMail_msg]=useState('');
    useEffect(()=>{
        console.log('RENDERED');
        fetchUser();
    },[]);
    async function fetchUser(){
      await BackendApi.get('/Admin').then((response)=>{
        setUsres(response.data);
      })
      .catch((error)=>{
        console.error(error);
      })
    }
    // async function sendSMS(){
    //   const url="http://localhost:3003/user/sendSMS/"+mail_msg;
    //   await axios.get(url).then((response)=>{
    //     console.log(response.data.msg);
    //   })
    //   .catch((error)=>{
    //     console.log(error);
    //   })
    // }
    async function sendEMAIL(){
      let source=document.getElementById('selectAll');
      if(source.checked){
      let emailArray=[];
        for(let i in users){
          emailArray.push(users[i].RegEmail)
        }
        if(mail_msg!==''&&emailArray.length!==0){
          await BackendApi.get('/Multinodemailer/'+emailArray+'/'+mail_msg).then((response)=>{
            console.log(response.data.msg);
            alert(response.data.msg);
          })
          .catch((err)=>{
            console.error(err);
          })
        }
        else{
          if(mail_msg===''){
            alert('PLEASE ENTER A MSG FIRST');
          }
          else{
            alert('PLEASE SELECT A MAIL');
          }
        }
      }
      else{
        let emailArray=[];
        let checkboxes = document.getElementsByName('checkboxes');
        for(var i=0, n=checkboxes.length;i<n;i++) {
          if(checkboxes[i].checked===true){
            emailArray.push(users[i].RegEmail);
          }
       }

       if(mail_msg!==''&&emailArray.length!==0){
        await BackendApi.get('/Multinodemailer/'+emailArray+'/'+mail_msg).then((response)=>{
          console.log(response.data.msg);
          alert(response.data.msg);

        })
        .catch((err)=>{
          console.error(err);
        })
      }
      else{
        if(mail_msg===''){
          alert('PLEASE ENTER A MSG FIRST');
        }
        else{
          alert('PLEASE SELECT A MAIL');
        }
      }
      }
    }
    async function chngeStatus(email,stfts,index){
      window.location.reload();
      if(stfts===true){
        stfts=false;
        await BackendApi.get('/Status/'+email+'/'+stfts).then((response)=>{
          console.log(response.data.msg);
        })
        .catch(err=>{
          console.log(err);
        })
      }
      else{
        stfts=true;
        await BackendApi.get('/Status/'+email+'/'+stfts).then(response=>{
        console.log(response.data.msg);     
        })
        .catch((err)=>{
          console.log(err);
        })
      }
    }
  async function selectAllUser(){
    let source=document.getElementById('selectAll');
      let checkboxes = document.getElementsByName('checkboxes');
      for(var i=0, n=checkboxes.length;i<n;i++) {
        checkboxes[i].checked = source.checked;
      }   
  }
return(
<div style={{margin:'50px'}}>
<h1 style={{padding:'50px'}}><center>ADMIN PANEL</center></h1>

  <Row style={{padding:'10px'}}>
    <Col md={8}>
      <FormControl id='txtmsg' name='textmsg' onChange={(e)=>{setMail_msg(e.target.value)}} placeholder='ENTER MESSAGE HERE'></FormControl>
    </Col>
    <Col md={4} style={{paddingTop:'5px',paddingBottom:'5px'}}>
    <Button variant="warning" style={{width:'100%'}} onClick={sendEMAIL}>SEND MAIL</Button>
    </Col>
  </Row>
<Row>
  <Col md={12}>
  <Table striped bordered hover variant="dark" responsive>
  <thead>
    <tr style={{textAlign:'center'}}>
      <th><center><input type='checkbox' id='selectAll' name='selectAll' onChange={selectAllUser}></input></center></th>
      <td>INDEX</td>
      <th>USER_EMAIL</th>
      <th>STATUS</th>
      <th>CHANGE STATUS</th>
    </tr>
  </thead>
  <tbody>
    {
      users.map((user,index)=>{
        let stetus=user.status.toString().toUpperCase();
        return(
          <tr key={index+1} style={{textAlign:'center'}}>
          <th><center><input type='checkbox' id={index+1} name='checkboxes'></input></center></th>
          <td>{index+1}</td>
          <td>{user.RegEmail}</td>
          <td>{stetus}</td>
          <td>{!user.status?<Button variant="success" style={{width:'100%'}} onClick={()=>{chngeStatus(user.RegEmail,user.status,index)}}>AUTHORIZE</Button>:<Button variant="danger" style={{width:'100%'}} onClick={()=>{chngeStatus(user.RegEmail,user.status,index)}}>BLOCK</Button>}</td>
          </tr>
        )
      })
    }
  </tbody>
</Table>
  </Col>
</Row>
</div>
    )
}
export default Admin;