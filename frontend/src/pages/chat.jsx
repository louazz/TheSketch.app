import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { io } from "socket.io-client";

import Nav from "../components/nav";

import { LoremIpsum } from "lorem-ipsum";

import axios from 'axios';
export default function Chat() {
    const api = "https://backend.thesketch.app"
    const divRef = useRef(null)
    let { id } = useParams();
    const [ids, setIds] = useState(id)

    const [user1, setUser1] = useState('')
    const [user2, setUser2] = useState('')
    const [im1, setIm1] = useState({})
    const [im2, setIm2] = useState({})
    const [name1, setName1] = useState('')
    const [name2, setName2] = useState('')

    const [dates, setDates] = useState([])
    const [checker, setChecker] = useState(false)
    const [len, setLen] = useState(0)
    const [locker, setLocker] = useState(false)





    const submit = () => {
        const socket = io('https://chat.thesketch.app');
        const data = {
            'convId': ids,
            'message': msg,
            'userId': localStorage.getItem('userId')
        }
        socket.emit("chat", data);

    }

    useEffect(() => {
        console.log(dates)

    }, [dates])
    useEffect(() => {
        const socket = io('https://chat.thesketch.app');
        if (checker == false) {
            axios.post(
                api + "/api/user", {
                "id": localStorage.getItem("user1")
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            }
            ).then(res => {
                if (res.status == 200 || res.status == 201) {

                    //setUsers(users => [...users, res.data.username]);
                    setName1(res.data.username)

                }
            })


            axios.post(
                api + "/api/image", {
                "id": localStorage.getItem('user1')
            }, {
                responseType: "arraybuffer"
            }).then(async res => {
                if (res.status == 200 || res.status == 201) {

                    var file = new Blob([res.data])
                    var fileUrl = URL.createObjectURL(file);

                    //setImage(image => [...image, fileUrl]);
                    //setImage(Image => [fileUrl, ...Image]);
                    setIm1(fileUrl)


                }
            })
            axios.post(
                api + "/api/user", {
                "id": localStorage.getItem("user2")
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            }
            ).then(res => {
                if (res.status == 200 || res.status == 201) {

                    //setUsers(users => [...users, res.data.username]);
                    setName2(res.data.username)

                }
            })


            axios.post(
                api + "/api/image", {
                "id": localStorage.getItem("user2")
            }, {
                responseType: "arraybuffer"
            }).then(async res => {
                if (res.status == 200 || res.status == 201) {

                    var file = new Blob([res.data])
                    var fileUrl = URL.createObjectURL(file);

                    //setImage(image => [...image, fileUrl]);
                    //setImage(Image => [fileUrl, ...Image]);
                    setIm2(fileUrl)


                }
            })
            divRef.current.scrollIntoView({ behavior: 'smooth' });
            const data = {
                'convId': ids
            }
            socket.emit("get", data);
            setChecker(true)
        }
        socket.on(id, async (arg) => {
            setChat(arg)


            var date_tmp = []
            var i = 0;
            while (i < arg.length) {
                var user_id = arg[i].id

                var date = new Date(JSON.parse(arg[i].date))

                //setDates(dates => [...dates, date.toString()]);
                date_tmp.push(date.toString())


                if (i == arg.length - 1) {

                    setDates([])

                    setDates(date_tmp)
                    setChecker(true)
                    divRef.current.scrollIntoView({ behavior: 'smooth' });

                }
                i += 1
            }


        });

        return () => {
            socket.disconnect();
        }
    },
        []
    )


    const lorem = new LoremIpsum({
        sentencesPerParagraph: {
            max: 8,
            min: 4
        },
        wordsPerSentence: {
            max: 16,
            min: 4
        }
    });
    const [chat, setChat] = useState([

    ])
    const [msg, setMsg] = useState('')
    const handleChange = (e) => {
        setMsg(e.target.value)
    }
    const navigate = useNavigate()

    return (
        <>           <div className="container second-color con full">
            <Nav />
            <br />

            <br />
            <button className="btn btn-danger float-right" onClick={() => { navigate("/conv") }}>Back</button>

            <h4>Chat</h4>
            <br />
            {
                chat.map((item, i) => (
                    <>
                        {
                            item.userId == localStorage.getItem('userId') ? <>

                                <div className="row">
                                    <div className="column column-75  column-offset-25">
                                        <div class="card">
                                            <div class="card-body">


                                                <div className="side">
                                                    <img className="improf3" src={im1} />
                                                </div>
                                                <div className="side">
                                                    <small className="float-left"> &nbsp;
                                                        {name1}</small>
                                                    <br />
                                                    <p className="float-left"><small>{item.content}</small><br />
                                                    </p>
                                                </div>


                                            </div>
                                            <div class="card-footer text-muted">
                                                {dates[i] == undefined || dates[i] == null ? <br /> : <small className="float-right small">{dates[i]}</small>}

                                            </div>
                                        </div></div>
                                </div> <br />

                            </> :
                                <>
                                    <div className="row">
                                        <div className="column column-75  ">
                                  
                                            <div class="card">
                                                <div class="card-body">

                                                    <div className="side">
                                                        <img className="improf3" src={im2} />
                                                    </div>
                                                    <div className="side">
                                                        <small className="float-left"> &nbsp;
                                                            {name2}</small>
                                                        <br /> <p className="float-left"><small>{item.content}</small>
                                                        </p>
                                                    </div>



                                                </div>
                                                <div class="card-footer text-muted">
                                                    {dates[i] == undefined || dates[i] == null ? <br /> : <small className="float-right small">{dates[i]}</small>}

                                                </div>
                                            </div>
                                        </div>
                                    </div> <br /> 

                                </>
                        }


                    </>


                )
                )
            }
            <br />
            <br />
            <div ref={divRef} />

        </div >
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />

            <br />
            <div className="footer">
                <div className="container second-color ">
                    <br />
                    <button className="btn btn-info float-right" onClick={submit}>Send</button>
                    <textarea className="comment form-control " placeholder="Message" onChange={handleChange} />


                </div></div>
        </>
    )
}
