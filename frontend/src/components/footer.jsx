
import { CiHome } from "react-icons/ci";
import { CiChat1 } from "react-icons/ci";
import { CiUser } from "react-icons/ci";
import { CiSearch } from "react-icons/ci";

import { useNavigate } from "react-router";
function Footer(){
    const navigate = useNavigate()
    return(
<>
<div className="footer">
<div className="container second-color ">
 <div className="center">
 <br/>

 <div className="box">
                <div className="one">
                    <center><button className="btn btn-light " onClick={()=>{navigate("/post")}}><h2><CiHome/></h2></button><br/><small>Posts</small></center> 
                </div>
                <div className="one">
                <center><button className="btn btn-light  " onClick={()=>{navigate("/conv")}}> <h2> <CiChat1/></h2> </button><br/><small>Chat</small></center>
                </div>
                <div className="one">
                 <center><button className="btn btn-light " onClick={()=>{navigate("/profile")}} > <h2 >  <CiUser/></h2> </button> <br/> <small>Profile</small>
            </center>     </div>
                   
            </div>
            <br/>

            
            </div>
            </div>
</div>
</>
    )
}

export default Footer