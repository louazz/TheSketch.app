import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router";

import Nav from "../components/nav";
import Footer from "../components/footer";
import { FaRegComments } from "react-icons/fa";
import { GrLike } from "react-icons/gr";
import Ant from "../assets/ant.png"
import axios from 'axios';
import { MoonLoader } from "react-spinners";

export default function Profile() {
  const [prompt, setPrompt] = useState("A face of ")
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
  const [c, setC] = useState(false)
  const [key, setKey] = useState(0)
  const navigate = useNavigate()
  let [color, setColor] = useState("#17a2b8");

  const api = "https://backend.thesketch.app"
  const getAll = async () => {
    setLiked([])
  setDates([])
          setImage([])
       
          setUsers([])
    axios.post(
      api + "/api/post/custom", { 'id': localStorage.getItem('userId') }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    }
    ).then(async response => {
      if (response.status == 200) {


        setContent(response.data.posts.reverse())
        var i = 0;
        while (i < response.data.posts.length) {
          console.log(response.data.posts[i].id)
          var id = response.data.posts[i].id

          var date = new Date(response.data.posts[i].date)

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
          console.log(i)
          i += 1

        }

      }
    })

  }
  const deletePost = async (postId) => {
    axios.post(api + '/api/post/delete', { id: postId },
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      }).then(async response => {
       setLiked([])
  setDates([])
          setImage([])
       
          setUsers([])


        setContent(response.data.posts.reverse())
        var i = 0;
        while (i < response.data.posts.length) {
          console.log(response.data.posts[i].id)
          var id = response.data.posts[i].id

          var date = new Date(response.data.posts[i].date)

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
          console.log(i)
          i += 1

        }
          console.log('deleted post')
        })
        
      
  }
  const getProfile = async () => {
    axios.get(api + "/api/profile/get",
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      }).then(res => {
        setSummary(res.data.profile.summary)
        console.log(res.data)
      })
    await axios.post(api + "/api/image", {
      id: localStorage.getItem("userId")
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
  useEffect(() => {
    if (checker == false) {
      getProfile();
      getAll()
      setChecker(true)
    }
  }, [])

  const updateSummary = () => {
    axios.post(api + "/api/profile/summary", {

      'id': localStorage.getItem('userId'),
      'summary': summary
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    }).then(res => {
      if (res.status == 200) {
        setSummary(res.data['profile'].summary)
        setChecker(true)
      }
    })
  }
  const submit = async () => {
    setLocker(true)
    await axios.post(api + "/api/profile", {
      'id': localStorage.getItem("userId"),
      "summary": summary,
      "prompt": prompt
    },
      { headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      },
        responseType: "arraybuffer"
      }).then(async response => {
        if (response.status == 200 || response.status == 201) {
          var file = new Blob([response.data])
          var fileUrl = URL.createObjectURL(file);
          setPhoto(fileUrl)
          setLocker(false)
        }
      })
  }

  const handlePrompt = (e) => {
    setPrompt(e.target.value)
  }
  const handleSummary = (e) => {
    setSummary(e.target.value)
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
    <> <div className="container second-color con full" key={key}>
      <Nav />
      <br />
      {locker == true ?     <div className="center-screen"><MoonLoader
        color={color}
        loading={locker}
       
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      /></div>:
        <><div class="card">
          <div class="card-body">
            <div className='box'>
              <div className="one">
                <h2>Edit your profile</h2>
              </div>
              <div className="one">
               
                <button className="btn btn-info float-right" onClick={() => { navigate('/profile/all') }}>all profiles</button>
              </div>
            </div>

            <p>Generate a profile photo using our generative ai model and update the summary of your profile</p>
            <br /></div> </div>     <br />
            <div class="card">
          <div class="card-body">
            <div className="box">
              <div className="one">
     <br /><center>
              <img className="improf4" src={photo} />
             
             <h4>{username}</h4></center>     
              
       
              </div>
              <div className="one">
 <label>Generate a profile photo</label>
          <textarea className='form-control comment' placeholder="generate a profile photo" onChange={handlePrompt} defaultValue={prompt} />
          <button className="btn btn-dark" onClick={submit} >generate</button>
          
              </div>
            </div>
         </div></div>
          <br />
          <label>Add a text summary for your profile</label>
          <textarea placeholder="Type a summary for your profile" className="textarea form-control" onChange={handleSummary} defaultValue={summary} />
          <button className="btn btn-dark" onClick={updateSummary}>update summary</button>
          <br />
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
                      </div>        <button className="btn btn-danger float-right" onClick={ async() => { await deletePost(item.id);}}>Delete</button>

                    </h4>
                  </div>
                  <br />
                  <p>

                    {item.content}
                  </p>


                  {Image[i] == null || Image[i] == undefined ? <MoonLoader
                    color={color}
                    loading={Image[i] == null ? false : true}
                    size={50}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  /> : <img className="img1" src={Image[i]} />}
                  <br />
                  <div className="box">
                    <div className="two">
                      <p>  {item.likes ? item.likes.length : 0} Like(s) <br />
                        <button className="btn btn-info" onClick={() => { like(item.id) }} ><GrLike /> {liked[i] ? 'Liked' : "Like"}</button></p>
                    </div>
                    <div className="two">
                      <br />
                      <button className="btn btn-info" onClick={() => { navigate("/post/" + item.id) }}><FaRegComments /> Comment</button>
                    </div>
                  </div>
                  <div class="card-footer text-muted">
                    <small>{dates[i]}</small>
                  </div></div>

                <br />
              </>
            ))
          }
        </>}

      <br />
      <br />
      <br />
      <Footer /> </div >
    </>
  )
}
