import { useEffect, useState } from "react";
import Nav from "../components/nav";
import Footer from "../components/footer";
import { FaRegComments } from "react-icons/fa";
import { GrLike } from "react-icons/gr";
import { useNavigate } from "react-router";
import axios from "axios";
import { FiRefreshCcw } from "react-icons/fi";

function Post() {
  const api = "https://backend.thesketch.app"
  const [checker, setChecker] = useState(false)
  const [Image, setImage] = useState([])
  const [users, setUsers] = useState([])
  const navigate = useNavigate()
  const [dates, setDates] = useState([])
  const [locker, setLocker] = useState(true)
  const [content, setContent] = useState([])
  const [profIm, setProfim] = useState([])
  const [liked, setLiked]= useState([])
  const [c, setC]= useState(false)
  useEffect(() => {
    if (localStorage.getItem("token") == undefined) {
      navigate("/")
    }
    if (checker == false) {
      getAll()
    }
  }, [])
  const delay = ms => new Promise(res => setTimeout(res, ms));

  const getAll = async () => {
    setLiked([])
    setC(true)
    if (locker == true) {
      axios.get(
        api + "/api/post/getall", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      }
      ).then(async response => {
        if (response.status == 200) {


          setContent(response.data.posts.reverse())
          var i = 0;
          while (i < response.data.posts.length ) {
            console.log(response.data.posts)
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
             if (response.data.posts[i].likes.includes(localStorage.getItem("userId"))){
          setLiked(liked => [...liked, true])
        }else{
          setLiked(liked =>[...liked, false])
        }
            await axios.post(
              api + "/api/image", {
              "id": response.data.posts[i].user
            }, {
              responseType: "arraybuffer"
            }
            
            ).then(async res1 => {
              if (res1.status == 200 || res1.status == 201) {
                var file = new Blob([res1.data])
                var fileUrl = URL.createObjectURL(file);
                console.log(fileUrl)
                setProfim(profIm => [...profIm, fileUrl]);

              }
            })
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
              setLocker(true)
              setChecker(true)
              setC(false)
            }
            console.log(i)
            i += 1

          }

        }
      })
       setLocker(true)
              setChecker(true)
    }
  }
  /*
  useEffectAsync(async () => {
     let ignore = false;
    if (!ignore) {  await getAll()}
    return () => { ignore = true; }
}, []);

*/
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

  const parseDate = () => {
    const c = content;
    for (var i = 0; i < c.length; i++) {
      c[i].date = new Date(content[i].date);
      console.log(content[i].date)
      setContent(c)
    }

  }

  const getImage = async (data) => {
    var i = 0;
    while (i < data.length) {
      var id = data[i].id
      await axios.post(
        api + "/api/image", {
        "id": id
      }, {
        responseType: "arraybuffer"
      }).then(res => {
        if (res.status == 200 || res.status == 201) {

          var file = new Blob([res.data])
          var fileUrl = URL.createObjectURL(file);

          //setImage(Image => [...Image, fileUrl]);
          setImage(Image => [fileUrl, ...Image]);
        }
      })
      i += 1
    }
  }
  return (
    <> <div className="container second-color con">
      <Nav />
      {checker == false ? <div className="center-screen"><h1 onClick={async () => { setImage([]); await getAll() }}><FiRefreshCcw /></h1> </div> : <>   <br />
        {locker == false ? <div className="center-screen">Loading data. Please wait ...</div> :
   
             <>

          
<div class="card">
  <div class="card-body">
            <div className="box">
              <div className="one">
                <h1>View posts and interact</h1>
              </div>
              <div className="one">
              
                 <button className="btn btn-info float-right" onClick={() => { navigate("/new") }}>New</button>
              </div>
            </div>

              <p>View posts and interact with a community of digitally creative people</p>
</div></div>
            <br />
            {content.length == 0 ? <></> :
              content.map((item, i) => (
                <>
                <div class="card">
  <div class="card-body">
    <h4 class="card-title">
                  <div className="side">
                    <img className="improf" src={profIm[i]} />
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
                        <button className="btn btn-info" onClick={() => { like(item.id) }} ><GrLike /> {liked[i]? 'Liked': "Like"}</button></p>
                    </div>
                    <div className="two">
                      <p>  {item.comments == undefined ? 0 : item.comments.length == 2? '+2' : item.comments.length} Comment(s)<br />
                        <button className="btn btn-info" onClick={() => { navigate("/post/" + item.id) }}><FaRegComments /> Comment</button></p>
                    </div>
                  </div>

</div><div class="card-footer text-muted">
    <small>{dates[i]}</small>
  </div></div>
                  <br />
                </>
              ))
            }
            <br />
            <br /> </>}</>}

      <Footer />
</div>
    </>
  )
}
export default Post;
