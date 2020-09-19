import './App.css'
import React from 'react'
import Logo from '../Components/Templates/Logo'
import Nav from '../Components/Templates/Nav'
import Footer from '../Components/Templates/Footer'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'
import { BrowserRouter } from 'react-router-dom'
import Routes from './Routes'

export default props =>
    <BrowserRouter>
        <div className="app">
            <Logo/>
            <Nav/>
            <Routes/>
            <Footer/>
        </div>
    </BrowserRouter>
    