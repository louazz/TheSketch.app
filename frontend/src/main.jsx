import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Post from './pages/posts.jsx'
import NewPost from "./pages/new.jsx"
//import './assets/milligram.css'
import './assets/normalize.css'
import './assets/bootstrap.min.css'
import './assets/App_original (2).css'
import SinglePost from './pages/single.jsx'
import Chat from "./pages/chat.jsx"
import Conv from './pages/conversation.jsx'
createRoot(document.getElementById('root')).render(
 
    <App />,
)
