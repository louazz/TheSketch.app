import Login from "./pages/login"
import Post from "./pages/posts"
import SinglePost from "./pages/single"
import Conv from "./pages/conversation"
import Image from "./assets/roboto.png"
import Chat from "./pages/chat"
import NewPost from "./pages/new"
import SignUp from "./pages/signup"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Profile from "./pages/profile"
import Allprofile from "./pages/allprofiles"
import SingleProfile from "./pages/singleprofile"
function App() {

  return (
    <>
  <BrowserRouter>
        <Routes>

          <Route index element={<Login/>}/>
          <Route path="signup" element={<SignUp/>}/>
          <Route path='post' element={<Post/>}/>
          <Route path="post/:id" element={<SinglePost/>}/>
          <Route path="new" element={<NewPost/>}/>
          <Route path="conv" element={<Conv/>}/>
          <Route path="chat/:id" element={<Chat/>}/>
          <Route path="profile" element={<Profile/>} />
          <Route path='profile/all' element={<Allprofile/>}/>
          <Route path='profile/one/:id' element={<SingleProfile/>} />

        </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
