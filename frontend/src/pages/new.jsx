import Nav from "../components/nav";
import Footer from "../components/footer";
import { useEffect, useState } from "react";
import { LoremIpsum } from "lorem-ipsum";
import axios from "axios"
import { useNavigate } from "react-router";
import { MoonLoader } from "react-spinners";
export default function NewPost() {

    const navigate = useNavigate()
    const [step, setStep] = useState(0)
    const [content, setContent] = useState('')
    const [image, setImage] = useState(null)
    const [imProfile, setImprof] = useState(null)
    const [username, setUsername] = useState(null)
    const [file, setFile] = useState(null)
    const [checker, setChecker] = useState(true)
    const [prompt, setPrompt] = useState("")
    let [color, setColor] = useState("#17a2b8");
    const api = "https://backend.thesketch.app"

    const submit =async () => {
        await axios.post(
              api + "/api/user", {
              "id": localStorage.getItem('userId')
            }, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
              }
            }
            ).then(res => {
              if (res.status == 200 || res.status == 201) {
                setUsername(res.data.username);

              }
            })
            await axios.post(
              api + "/api/image", {
              "id": localStorage.getItem('userId')
            }, {
              responseType: "arraybuffer"
            }).then(async res => {
              if (res.status == 200 || res.status == 201) {

                var file = new Blob([res.data])
                var fileUrl = URL.createObjectURL(file);

                setImprof(fileUrl)
                //setImage(Image => [fileUrl, ...Image]);


              }
            })
        if (prompt !== "") {
           await axios.post(api + "/api/post", {
                prompt: prompt,
                content: content
            },
                {
                    responseType: "arraybuffer",

                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`

                    },
                }).then(res => {
                    if (res.status == 200 || res.status == 201) {
                        const file = new Blob([res.data])
                        var fileUrl = URL.createObjectURL(file);
                        navigate('/post')
                        setImage(fileUrl)
                        
                        setStep(step+4)
                        console.log(image)
                        setChecker(false)
                    }
                })
        }
    }
    const handleImage = (e) =>{
      setFile(e.target.files[0])
    }
    const submit_image= async()=>{
      var form = new FormData()
     form.append('file', file)
     form.append('content', content)
     setChecker(false)
     await axios.post(api + "/api/post/image", form,
                {
                    responseType: "arraybuffer",

                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`

                    },
                }).then(res => {
                    if (res.status == 200 || res.status == 201) {
                        const file = new Blob([res.data])
                        var fileUrl = URL.createObjectURL(file);
                        navigate('/post')
                        setImage(fileUrl)
                        
                        setStep(step+4)
                        console.log(image)
                        setChecker(false)
                    }
                })

    }
    useEffect(()=>{
          if (localStorage.getItem("token") == undefined || localStorage.getItem("token") == null) {
            navigate("/")
        }
       
    },[])


    const handleChange = (e) => {
        setContent(e.target.value)
    }
    const handlePrompt = (e) => {
        setPrompt(e.target.value)
    }
    return (
        <>
            <div className="container full">
                <Nav />
                {checker == false ?
            
                        <div className="center-screen"><MoonLoader
        color={color}
        loading={!checker}
       
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      /></div>
                      : 

                <div className="container second-color con">
                                    <h1>Create a New Post</h1>

                    <br />
                    {step == 0 ? <> <label>Your story</label>
                        <textarea className="textarea form-control" placeholder="Publish a post" onChange={handleChange} value={content} /><br/>
                        <div className="box"><div className="one"><button className="btn btn-dark" onClick={() => { setStep(step + 1) }}  >From text</button></div>  <div className="one"><button className="btn btn-dark float-right" onClick={() => { setStep(step + 2) }}  >From Image</button></div></div>
                        </> : step == 1 ? <div >
                            <textarea className="comment form-control" placeholder="Generate an image from text" onChange={handlePrompt} />
<br/>
                            <button  className="btn btn-info" onClick={() => { image == null ? setChecker(false) : setChecker(true); submit(); }}>Generate</button>
                        </div> : step == 2 ?  <> <label>Upload an Image</label><input className="form-control" type='file' placeholder="file.jpg" onChange={handleImage}/><br/><button className="btn btn-info" onClick={submit_image}>Submit</button> </>:<>
                        <div className="side">
                            <img className="improf" src={imProfile} />

                        </div>
                        <div className="side">
                            <strong className="float-left"> &nbsp; {username}</strong>
                        </div>
                        <p>{content}</p>
                        <img className="img1" src={image} />
                        <br />
                        <button  className="btn btn-dark" onClick={()=>{navigate("/post")}}>Publish</button>

                    </>}


                </div>}
                <br />
                <br />
                <br />
                <br />
                <Footer />
            </div>
        </>
    )
}
