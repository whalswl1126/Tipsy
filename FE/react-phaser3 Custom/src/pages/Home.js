import React from "react"
import { Link } from 'react-router-dom';
import MainNav from "../components/MainNav";
import Modal from '../components/Modal'


const Home = () => {
  return (
    <div>
      <MainNav/>
      <h1>Home</h1>
      <Link to="/about">About</Link>
      <br/> 
      <Link to="/phaser">Phaser</Link>
      <br/> 
      <Link to="/QR">QRcode</Link>
      <Modal/>
    </div>
  )
}

export default Home