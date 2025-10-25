
import Nav from "../components/nav";
import axios from 'axios';
import Footer from "../components/footer";
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router";
function Conv() {
      const [Image, setImage] = useState([])
        const [locker, setLocker] = useState(false)

  const [users, setUsers] = useState([])
    const api = "https://backend.thesketch.app"
  const [dates, setDates] = useState([])
    const navigate = useNavigate()
      const [checker, setChecker] = useState(false)
    const [content, setContent] = useState([])

    useEffect(() => {
        if (checker == false) {
          getAll()
    
          setChecker(true)
        }
      }, [])
    const getAll =async () => {
        axios.get(api + '/api/conv/get', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        }).then(async res => {
            if (res.status == 200) {
                setContent(res.data.conv)
                console.log("convs")
                console.log(res.data.conv)
                var i = 0;
                while (i < res.data.conv.length + 1) {
                var receiver = null;

          if (res.data.conv[i].user1 == localStorage.getItem('userId')){
            receiver = res.data.conv[i].user2
          }else{
            receiver = res.data.conv[i].user1
          }
          var date = new Date(JSON.parse(res.data.conv[i].date))

          setDates(dates => [...dates, date.toString()]);
                      await axios.post(
            api + "/api/image", {
            "id": receiver
          }, {
            responseType: "arraybuffer"
          }).then(async res => {
            if (res.status == 200 || res.status == 201) {
              console.log(locker)

              var file = new Blob([res.data])
              var fileUrl = URL.createObjectURL(file);

              setImage(Image => [...Image, fileUrl]);
              //setImage(Image => [fileUrl, ...Image]);


            }
          })
         
            await axios.post(
            api + "/api/user", {
            "id": receiver
          }, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
          }
          ).then(res => {
            if (res.status == 200 || res.status == 201) {
           
              setUsers(users => [...users, res.data.username]);

            }
          })
                    i += 1
                }
            }
        })
    }
    return (
        <>   <div className="container second-color con full">
            <Nav />
            <br />
         
                <br />
                <button className="btn btn-danger float-right" onClick={() => { navigate('/profile/all') }}>New</button>
                <h1>Conversations</h1>
                {
                    content.map((item, i) => (
                        <>
                              <div class="card">
  <div class="card-body">
                                <br />
                                <div className="box">
                                    <div className="one">
                                        <img className="improf float-left" src={Image[i]} />
                                        <br />
                                        <br />

                                        <p><strong>{users[i]}</strong></p>
                                    </div>
                                    <div className="one">
                                     
                                        <center>
                                            <small>{dates[i]}</small>
                                        </center>

                                    </div>
                                    <div className="one">
                                        <br />
                                        <button className='btn btn-info float-right' onClick={() => {if (localStorage.getItem('userId')== item.user1) {localStorage.setItem('user1', item.user1); localStorage.setItem('user2', item.user2);navigate("/chat/" + item.id)}else{localStorage.setItem('user2', item.user1); localStorage.setItem('user1', item.user2);navigate("/chat/" + item.id)} }}>

                                            Chat
                                        </button>
                                    </div>
                                </div>
    </div>
                            </div>
                            <br />
                        </>
                    ))
                }
           <br />
            <br />
            <br />
            <br />
            <br />
            <Footer />     </div>
        </>
    )
}
export default Conv;
