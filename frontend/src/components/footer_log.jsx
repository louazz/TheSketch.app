
import { CiHome } from "react-icons/ci";
import { CiChat1 } from "react-icons/ci";
import { GoPerson } from "react-icons/go";
import { IoIosLogIn } from "react-icons/io";
import { CiSquarePlus } from "react-icons/ci";
import { useNavigate } from "react-router";

function FooterLog(){
    const navigate = useNavigate()
    return(
<>
<div className="footer">
<div className="container second-color ">
 <div className="center">
 <br/>

 <div className="box">
                <div className="one">
                  <center><button className="btn btn-light center " onClick={()=>{navigate("/")}}><h2><IoIosLogIn/></h2></button><br/> <small>Login</small></center>
                </div>
                <div className="one">
                <center><button className="btn btn-light center " onClick={()=>navigate("/signup")}> <h2> <CiSquarePlus/></h2> </button><br/> <small>SignUp</small></center>
                </div>
            
            </div>
            <br/>

            
            </div>
            </div>
</div>
</>
    )
}

export default FooterLog