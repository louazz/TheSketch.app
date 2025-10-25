import { useEffect, useState } from "react";

import Nav from "../components/nav";
import Footer from "../components/footer";
import { FaRegComments } from "react-icons/fa";
import { GrLike } from "react-icons/gr";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FiRefreshCcw } from "react-icons/fi";

export default function SinglePost() {
  let { id } = useParams();
  const [ids, setIds] = useState(id)
  const navigate = useNavigate()
  const [image, setImage] = useState([])
  const [checker, setChecker] = useState(false)
  const api = "https://backend.thesketch.app"
  const [item, setItem] = useState({})
  const [user, setUser] = useState("")
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState("")
  const [dates, setDates] = useState([])
  const [users, setUsers] = useState([])
  const [likes, setLikes] = useState([])
  const [profIm, setProfim] = useState(null)
  const [commentIm, setCommentim] = useState([])
  const [liked, setLiked] = useState(false)
  const [postDate, setpostDate] = useState('')
  const getPost = async () => {

    await axios.post(
      api + "/api/post/one", {
      "id": ids
    },
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      }
    ).then(async res => {
      if (res.status == 200) {
        setItem(res.data.post)
        const date = new Date(JSON.parse(res.data.post.date))
        setpostDate(date.toString())
        if (res.data.post.likes.includes(localStorage.getItem("userId"))) {
          setLiked(true)
        }
        await axios.post(
          api + "/api/image", {
          "id": res.data.post.user
        }, {
          responseType: "arraybuffer"
        }).then(async res => {
          if (res.status == 200 || res.status == 201) {

            var file = new Blob([res.data])
            var fileUrl = URL.createObjectURL(file);

            setProfim(fileUrl)
            //setImage(Image => [fileUrl, ...Image]);


          }
        })
        await axios.post(
          api + "/api/user", {
          "id": res.data.post.user
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        }
        ).then(async response => {
          if (response.status == 200 || response.status == 201) {
            setUser(response.data.username)
            await axios.post(api + "/api/comment/get", {

              id: ids

            }, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
              }
            }).then(async res => {
              setComments(res.data.comments)
              setUsers([])
              setCommentim([])
              console.log(res.data.comments)
              setDates([])
              var i = 0;
              while (i < res.data.comments.length) {
                var date = new Date(JSON.parse(res.data.comments[i].date))
                setDates(dates => [...dates, date.toString()]);
                await axios.post(
                  api + "/api/image", {
                  "id": res.data.comments[i].user
                }, {
                  responseType: "arraybuffer"
                }).then(res => {
                  if (res.status == 200 || res.status == 201) {

                    var file = new Blob([res.data])
                    var fileUrl = URL.createObjectURL(file);

                    //setImage(Image => [...Image, fileUrl]);
                    setCommentim(commentIm => [...commentIm, fileUrl]);
                  }
                })
                await axios.post(
                  api + "/api/user", {
                  "id": res.data.comments[i].user
                }, {
                  headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                  }
                }
                ).then(res => {
                  if (res.status == 200 || res.status == 201) {
                    console.log(res.data.username)
                    setUsers(users => [...users, res.data.username]);
                    setLikes(likes => [...likes, res.data.likes]);
                  }
                }).catch((error) => {
                  console.log(error);
                });

                i += 1
              }
            })
          }
        })
      }
    })
  }
  const datetime = (data) => {
    setDates([])
    var i = 0;
    while (i < data.length + 1) {
      var date = new Date(data[i].date)
      console.log(date)

      setDates(dates => [...dates, date.toString()]);
      i += 1
    }
  }
  useEffect(() => {
    if (localStorage.getItem("token") == undefined || localStorage.getItem("token") == null) {
      navigate("/")
    }
    if (checker == false) {
      getImage()
      axios.post(
        api + "/api/post/one", {
        "id": ids
      },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        }
      ).then(async res => {
        if (res.status == 200) {
          setItem(res.data.post)
          if (res.data.post.likes.includes(localStorage.getItem("userId"))) {
            setLiked(true)
          }
          await axios.post(
            api + "/api/image", {
            "id": res.data.post.user
          }, {
            responseType: "arraybuffer"
          }).then(async res => {
            if (res.status == 200 || res.status == 201) {

              var file = new Blob([res.data])
              var fileUrl = URL.createObjectURL(file);

              setProfim(fileUrl)
              //setImage(Image => [fileUrl, ...Image]);


            }
          })
          await axios.post(
            api + "/api/user", {
            "id": res.data.post.user
          }, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
          }
          ).then(async response => {
            if (response.status == 200 || response.status == 201) {
              setUser(response.data.username)
            }
          })
        }
      })
      getPost()
    }
  }, [])
  const getImage = async () => {
    console.log(ids)
    await axios.post(
      api + "/api/image", {
      "id": ids
    }, {
      responseType: "arraybuffer"
    }).then(res => {
      if (res.status == 200 || res.status == 201) {
        var file = new Blob([res.data])
        var fileUrl = URL.createObjectURL(file);
        setImage(fileUrl)
        setChecker(true)

      }
    })
  }

  const submit = () => {
    axios.post(api + "/api/comment", { "content": comment, "id": ids }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    }).then(async res => {
      if (res.status == 200) {
        setComments(res.data.comments)
        setDates([])
        setUsers([])
        setCommentim([])
        var i = 0;
        while (i < res.data.comments.length) {
          var date = new Date(res.data.comments[i].date)
          setDates(dates => [...dates, date.toString()]);
          await axios.post(
            api + "/api/image", {
            "id": res.data.comments[i].user
          }, {
            responseType: "arraybuffer"
          }).then(res => {
            if (res.status == 200 || res.status == 201) {

              var file = new Blob([res.data])
              var fileUrl = URL.createObjectURL(file);

              //setImage(Image => [...Image, fileUrl]);
              setCommentim(commentIm => [...commentIm, fileUrl]);
            }
          })
          await axios.post(
            api + "/api/user", {
            "id": res.data.comments[i].user
          }, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
          }
          ).then(res => {
            if (res.status == 200 || res.status == 201) {
              setUsers(users => [...users, res.data.username]);
              setLikes(likes => [...likes, res.data.likes]);


            }
          })

          i += 1
        }
      }
    })
  }
  const onComment = (e) => {
    setComment(e.target.value)
  }
  const like = () => {
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
          setChecker(true)
        }
      })
  }
  const likeComment = (commentId) => {
    setCommentim([])
    setUsers([])
    setLikes([])
    axios.post(
      api + "/api/comment/like", {
      "id": commentId
    }
      , {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      }).then(async res => {
        if (res.status == 200) {
          await axios.post(api + "/api/comment/get", {

            id: ids

          }, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
          }).then(async res => {
            setComments(res.data.comments)
            console.log(res.data.comments)
            setDates([])
            var i = 0;
            while (i < res.data.comments.length) {
              var date = new Date(res.data.comments[i].date)
              setDates(dates => [...dates, date.toString()]);
              await axios.post(
                api + "/api/image", {
                "id": res.data.comments[i].user
              }, {
                responseType: "arraybuffer"
              }).then(res => {
                if (res.status == 200 || res.status == 201) {

                  var file = new Blob([res.data])
                  var fileUrl = URL.createObjectURL(file);

                  //setImage(Image => [...Image, fileUrl]);
                  setCommentim(commentIm => [...commentIm, fileUrl]);
                }
              })
              await axios.post(
                api + "/api/user", {
                "id": res.data.comments[i].user
              }, {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
              }
              ).then(res => {
                if (res.status == 200 || res.status == 201) {
                  setUsers(users => [...users, res.data.username]);
                  setLikes(likes => [...likes, res.data.likes]);
                }
              })

              i += 1
            }
          })
        }
      })
  }

  return (
    <> <div className="container second-color con full">
      <Nav />
      <br />

      <br />
      <div className="box">
        <div className="one">
          <button className="btn btn-danger float-left " onClick={() => { getImage(); getPost() }}><FiRefreshCcw /> Refresh</button>
        </div>
        <div className="one">
          <button className="btn btn-info float-right" onClick={() => { navigate("/post") }}><FaArrowLeftLong /> Back</button>
        </div>
      </div>
      {checker == false ?

        <></>
        :
        <>
          <br />
             <div class="card">
  <div class="card-body">
    <h4 class="card-title">
          <div className="side">
            <img className="improf" src={profIm} />
          </div>
          <div className="side">
            <strong className="float-left"> &nbsp;
              {user}</strong>

          </div></h4>

          <br />
          <p>
            {item.content}
          </p>
      

          <img className="img1" src={image} />
          <br />
          <div className="box">
            <div className="two">
              <p> {item.likes ? item.likes.length : 0} Like(s) <br />
                <button className="btn btn-dark" onClick={() => { like() }}><GrLike /> {liked == true ? 'Liked' : 'Like'} </button></p>
            </div>
            <div className="two">
              <p> {comments.length != 0 ? comments.length : 'Load'}  Comment(s)<br />
                <button className="btn btn-dark" onClick={() => { getImage(); getPost() }} ><FaRegComments /> Comment</button></p>
            </div>
        </div>  <div class="card-footer text-muted">
    <small>{postDate}</small>
  </div></div> </div><br />
          <textarea className='form-control comment' placeholder="Write comment" onChange={onComment} />
          <button className="btn btn-dark" onClick={submit}>Submit</button>
          <br/>
              <br />
          {comments ? comments.map((item, i) => (
            <>
              <div className="container fifth-color rounded">

                <br />
                <div className="side">
                  <img className="improf" src={commentIm[i]} />
                </div>
                <div className="side">
                  <strong className="float-left"> &nbsp;
                    {users[i]}</strong>

                </div>
                <br />
                <small> {dates[i]}</small>
                <br />
                <br />
                {item.content}
                <br />
            
                <p>
                  <button className="btn btn-light " onClick={() => { likeComment(comments[i].id) }}>Like</button>&nbsp;<small>{item.likes ? item.likes.length : 0} Likes</small></p>
    <br />
              </div>
                <br />
            </>

          )) : <></>}
        </>
      }
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <Footer />

    </div>
    </>)
}
