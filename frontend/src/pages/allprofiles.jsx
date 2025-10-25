
import { useEffect, useState } from "react";
import axios from "axios";
import Nav from "../components/nav";
import Footer from "../components/footer";
import { useNavigate } from "react-router";
import { ImProfile } from "react-icons/im";

function Allprofile() {
    const [profile, setProfile] = useState([])
    const [res, setRes] = useState(profile)

    const [checker, setChecker] = useState(false)
    const [users, setUsers] = useState([])
    const [res2, setRes2] = useState(users)
    const api = "https://backend.thesketch.app"
    const navigate = useNavigate()
    const [profim, setProfim] = useState([])
    const [res3, setRes3] = useState(profim)
    const handleChange = (e) => {
        if (e.target.value == "") {
            setRes(profile)
            setRes2(users)
            setRes3(profim)
        } else {
            setRes(profile.filter((item, i) => users[i].includes(e.target.value)))
            setRes2(users.filter((item, i) => item.includes(e.target.value)))
            setRes3(profim.filter((item, i) => users[i].includes(e.target.value)))

        }

    }
    const conv = (userid) => {
        axios.post(api + '/api/conv/check', { 'user': userid }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        }).then(res => {
            if (res.status == 200) {
                navigate('/chat/' + res.data.convId)
            }
        })
    }

    useEffect(() => {
        if (localStorage.getItem("token") == undefined) {
            navigate("/")
        }
        if (checker == false) {
            getAll()
  
        }
    }, [])

    const getAll = () => {
        axios.get(
            api + '/api/profile/all', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        }
        ).then(async response => {
            if (response.status == 200) {
                setProfile(response.data.profiles.reverse())
                setRes(response.data.profiles.reverse())

                var i = 0;
              
                while (i < response.data.profiles.length ) {
                    console.log(response.data.profiles[i])
                    await axios.post(
                        api + "/api/user", {
                        "id": response.data.profiles[i].userId
                    }, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                    ).then(resp => {
                        if (resp.status == 200 || resp.status == 201) {
                            setUsers(users => [...users, resp.data.username]);
                            setRes2(res2 => [...res2, resp.data.username]) 
                        }
                    })
                    await axios.post(
                        api + "/api/image", {
                        "id": response.data.profiles[i].userId
                    }, {
                        responseType: "arraybuffer"
                    }

                    ).then(async resp => {
                        if (resp.status == 200 || resp.status == 201) {
                            var file = new Blob([resp.data])
                            var fileUrl = URL.createObjectURL(file);
                            setProfim(profim => [...profim, fileUrl]);
                       setRes3(res3 => [...res3, fileUrl]) 
                        }
                    })
                   
                    if (i == response.data.profiles.length - 1) {

                        setChecker(true)

                    }
            
                    i += 1
                }
                 
            }
        })
    
    }
    return (
        <>   <div className="container  second-color con full">
            <Nav />
            <br />
         
                <h1>Browse profiles</h1>
                <p>you can view other users profiles and send them messages</p>
                <br />
                <label>Search</label>
                <input placeholder="Search" className=" form-control" onChange={handleChange} />
                <br />
                {res.map((item, i) => (
                    <>
                        <br />

                                 <div class="card">
  <div class="card-body">
                            <br />

                            <div className="box">
                                <div className="one">


                                    <div className="side">
                                        <img className="improf" src={profim.length == 0? profim[0] :res3[i]} />
                                    </div>
                                    <div className="side">
                                        <strong className="float-left"> &nbsp;
                                            {res2[i]}</strong>
                                    </div>
                                </div>
                                <div className="one">
                                    <button className="btn btn-info float-right" onClick={() => { navigate('/profile/one/' + item.userId) }}>View</button>

                                    <button className="btn btn-danger float-right" onClick={() => { conv(item.userId) }}>Chat</button>
                                </div>
                            </div>
                            <br />
                        </div>
 </div>

                    </>

                ))}
    <br />
            <br />
            <br />
            <br />
            <Footer />            </div>
        </>
    )
}
export default Allprofile;
