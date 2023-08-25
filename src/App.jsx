
import './App.css'
import { Route } from 'react-router-dom'
import { Routes } from 'react-router-dom'
import Login from './components/Login'
import Lobby from './components/Lobby'
import CodeBlock from './components/CodeBlock'
function App() {

  return (
   <Routes>
    <Route path="/" element={<Login></Login>}></Route>
    <Route path='Lobby' element={<Lobby></Lobby>}></Route>
    <Route path="Codeblock/:id" element={<CodeBlock></CodeBlock>}></Route>
   </Routes>
  )
}

export default App
