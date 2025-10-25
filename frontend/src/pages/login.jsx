import { useState, useEffect } from "react";
import Nav from "../components/nav";
import FooterLog from "../components/footer_log";
import gif from '../assets/compressed.gif'
import { useNavigate } from "react-router";
import axios from "axios";
function Login() {
const [username, setUsername] = useState("")
const [password, setPassword] = useState("")
const handlePassword = (e)=>{
    setPassword(e.target.value)
}
const handleUsername = (e)=>{
    setUsername(e.target.value)
}
const navigate = useNavigate()

const api = "https://backend.thesketch.app"

const submit = ()=>{
      if (username === null || username.match(/^ *$/) !== null || password === null || password.match(/^ *$/) !== null){
        return;
      } 
      axios.post(api+"/api/login", {
        username: username,
        password: password
      }).then( res=>{
        if (res.status == 200 || res.status == 201 ){
           localStorage.setItem("userId", res.data["userId"])
           localStorage.setItem('token', res.data["token"])
           navigate("/profile")
      }else{
            alert("Internal server error")
        }
      }).catch(
        function(error){
            alert('server error. try to login again')
        }
      )
}
useEffect(()=>{
    if (localStorage.getItem("token") != undefined){
        navigate("/post")
    }
})



    return (
<>
<div className="container second-color con full">
<Nav/>
<br/>
<br/>
<div className=" container third-color">

    <h4>Summary</h4>
<p>
   powered by latent diffusion models and generative AI, thesketch.app is a social media application that allows users to generate sketch images for their posts. 
</p>
</div>
<br/>
<br/>
<div className="container fourth-color ">
<h1>Login</h1>
<p>Login and start publishing content.</p>
<label>Username</label>
<input className="form-control" placeholder="Username"   onChange={handleUsername}/>
<label>Password</label>
<input className="form-control" type="password" placeholder="Password"  onChange={handlePassword} />
<br/>
<button className="btn btn-info" onClick={submit}>Submit</button>
</div>
<br/>

<br/>
<br/>
<br/>
<br/>
<FooterLog />
</div>
</>

    )}
export default Login
