import { useEffect, useState } from "react";
import Nav from "../components/nav";
import FooterLog from "../components/footer_log";
import { useNavigate } from "react-router";
import axios from "axios";
import gif from '../assets/compressed.gif'

function SignUp() {
const navigate = useNavigate()
const [email, setEmail] = useState("")
const [username, setUsername] = useState("")
const [password, setPassword] = useState("")

const api = "https://backend.thesketch.app"

const submit = ()=>{
      if (username === null || username.match(/^ *$/) !== null || password === null || password.match(/^ *$/) !== null){
        alert('check your input...');
        return;
      } 
      axios.post(api+"/api/signup", {
        username: username,
        password: password,
        email: email
      }).then( res=>{
        if (res.status == 200){
            alert("registration succeeded");
            navigate("/")
        }else if (res.status == 500){
            alert("User exist")
        }else{
            alert("Internal server error")
        }
      })
}
useEffect(()=>{
    if (localStorage.getItem("token") != undefined){
        navigate("/post")
    }
})
const handleEmail = (e)=>{
    setEmail(e.target.value)
}

const handlePassword = (e)=>{
    setPassword(e.target.value)
}
const handleUsername = (e)=>{
    setUsername(e.target.value)
}
    return (
<><div className="container second-color con full">
<Nav/>
<br/>
<br/>
<div className=' container third-color'>

    <h4>Summary</h4>
<p>
    powered by latent diffusion models and generative AI, thesketch.app is a social media application that allows users to generate sketch images for their posts. 
</p>
</div>
<br/>
<br/>
<div className="container third-color">
<h1>SignUp</h1>
<p>SignUp and start publishing content.</p>
<label>Email</label>
<input  className='form-control'  placeholder="Email"  onChange={handleEmail}/>
<label>Username</label>
<input className="form-control" placeholder="Username"  onChange={handleUsername} />
<label>Password</label>
<input className="form-control" placeholder="Password" type='password' onChange={handlePassword} />
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
export default SignUp
