import { useNavigate } from "react-router";

import axios from "axios";
import { useEffect, useState } from "react";

function Nav() {
const navigate = useNavigate()
const [checker, setChecker]= useState(false)
const [Image, setImage] = useState({})
const [locker, setLocker]= useState(true)
const [username, setUsername] = useState(null)
  const api = "https://backend.thesketch.app"
useEffect(()=>{

  if ((localStorage.getItem('token')!== undefined || localStorage.getItem('token') !== null)  && checker ==false){
         axios.post(
        api + "/api/image", {
        "id": localStorage.getItem('userId')
      }, {
        responseType: "arraybuffer"
      }).then(res => {
        if (res.status == 200 || res.status == 201) {
          
          var file = new Blob([res.data])
          var fileUrl = URL.createObjectURL(file);

          //setImage(Image => [...Image, fileUrl]);
          setImage(fileUrl);

          setChecker(true)
        }
      })
       axios.post(
      api + "/api/user", {
      "id": localStorage.getItem("userId")
    }, {

      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    }
    ).then(async response => {
      if (response.status == 200 || response.status == 201) {
        setUsername(response.data.username)
      }
    })
  }

},[])


    return (
      <>
     
 

      <div className="header">
           <br/>
   
    <div className="box ">
     
        <div className="one">
         
            <h5 onClick={()=>{setLocker(true)}}>TheSketch.app</h5><br/>
        </div>
         
       {(localStorage.getItem("token") == undefined || localStorage.getItem("token") == null)?
         <></>
      :
     <div className="one">
      
            <div className="float-right">
             {locker == true && Object.keys(Image).length !== 0?<><img onClick={()=>{setLocker(false)}} className="improf" src={Image} /> <h6>{username}</h6> </>: <button className="btn btn-dark" onClick={()=>{localStorage.clear(); navigate("/")}}>Logout</button>}  
            </div>
           
        </div>
      }
   
    </div>
      <br/>
      <br/>
    </div>

      </>
    )
  }
  
  export default Nav
