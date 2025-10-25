import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router";

import Nav from "../components/nav";
import Footer from "../components/footer";
import { FaRegComments } from "react-icons/fa";
import { GrLike } from "react-icons/gr";
import axios from 'axios';
export default function SingleProfile() {
  let { id } = useParams();
  const [ids, setIds] = useState(id)
  const [summary, setSummary] = useState("")
  const [photo, setPhoto] = useState(null)
  const [username, setUsername] = useState("")
  const [checker, setChecker] = useState(false)
  const [locker, setLocker] = useState(false)
  const [Image, setImage] = useState([])
  const [users, setUsers] = useState([])
  const [dates, setDates] = useState([])
  const [content, setContent] = useState([])
  const [liked, setLiked] = useState([])
  const navigate = useNavigate()
  const api = "https://backend.thesketch.app"
  const getAll = async () => {
    setLiked([])
    console.log(id)

    axios.post(
      api + "/api/post/custom", {id: id},{
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    }
    ).then(async response => {
      if (response.status == 200) {
        console.log(response.data)


        setContent(response.data.posts.reverse())
        var i = 0;
        while (i < response.data.posts.length) {
          console.log(response.data.posts[i].id)
          var id = response.data.posts[i].id

          var date = new Date(JSON.parse(response.data.posts[i].date))

          setDates(dates => [...dates, date.toString()]);
          await axios.post(
            api + "/api/user", {
            "id": response.data.posts[i].user
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
          console.log(response.data.posts[i].user)
          if (response.data.posts[i].likes.includes(localStorage.getItem("userId"))) {
            setLiked(liked => [...liked, true])
          } else {
            setLiked(liked => [...liked, false])
          }

          await axios.post(
            api + "/api/image", {
            "id": id
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
          if (i == response.data.posts.length - 1) {
            setChecker(true)

          }
          i += 1

        }

      }
    })

  }


   
  const getProfile = async () => {
    axios.post(api + "/api/profile/custom",{id:id},
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      }).then(res => {
        setSummary(res.data.profile.summary)
        console.log(res.data)
      })
    await axios.post(api + "/api/image", {
      'id': id
    }, {
      responseType: "arraybuffer"
    }, {

    }).then(async res => {
      var file = new Blob([res.data])
      var fileUrl = URL.createObjectURL(file);
      console.log(fileUrl)
      setPhoto(fileUrl)

    })
    await axios.post(
      api + "/api/user", {
      "id": id
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
  useEffect(() => {
    if (checker == false) {
      getProfile()
      getAll()
      setChecker(true)
    }
  }, [])
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


  const like = (id) => {
    axios.post(
      api + "/api/post/like", {
      "id": id
    }
      , {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      }).then(res => {
        if (res.status == 200) {
          getAll()
        }
      })
  }
  return (
    <>      <div className="container second-color con full">
      <Nav />
      <br />

        <button className="btn btn-info"onClick={()=>{navigate('/profile/all')}}>Back</button>
      
         <div class="card">
  <div class="card-body">
        <div className='box'>
          <div className="one">
            <h2>Profile</h2>
          </div>
          <div className="one">
      
      
<button className="btn btn-dark float-right" onClick={()=>{conv(id)}}>Chat</button>          </div>
        </div>

        <center>
          <img className="improf4" src={photo} />
          <br />
          <strong>{username}</strong>
        </center>
        <br />
        <h3>Summary</h3>
     <p>{summary}</p></div></div>
        <br />
        {content.length == 0 ? <></> :
          content.map((item, i) => (
            <>
             <div class="card">
  <div class="card-body">
    <h4 class="card-title">
              <div className="side">
                <img className="improf" src={photo} />
              </div>
              <div className="side">
                <strong className="float-left"> &nbsp;
                  {users[i]}</strong>
      
              </div></h4>
              <br />
              <p>
                {item.content}
              </p>
       

              <img className="img1" src={Image[i]} />
              <br />
              <div className="box">
                <div className="two">
                  <p>  {item.likes ? item.likes.length : 0} Like(s) <br />
                    <button className="btn btn-info" onClick={() => { like(item.id) }} ><GrLike /> {liked[i] ? 'Liked' : "Like"}</button></p>
                </div>
                <div className="two">
                  <br/>
                    <button className="btn btn-info" onClick={() => { navigate("/post/" + item.id) }}><FaRegComments /> Comment</button>
                </div>
              </div>
     </div>
<div class="card-footer text-muted">
    <small>{dates[i]}</small>
  </div></div>

              <br />
            </>
          ))
        }
     
      <br />
      <br />
      <br />
      <Footer /> </div>
    </>
  )
}
