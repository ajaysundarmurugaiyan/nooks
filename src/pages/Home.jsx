import React from 'react'
import Hero from '../components/Home/Hero'
import About from '../components/Home/About'
import Features from '../components/Home/Features'
import Gallery from '../components/Home/Gallery'
import Contact from './Contact'

const Home = () => {
  return (
    <div>
      <Hero/>
      <About/>
      <Features/>
      <Gallery/>
      <Contact/>
    </div>
  )
}

export default Home
