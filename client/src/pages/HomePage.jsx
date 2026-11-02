import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Legacy from '../components/Legacy';
import Process from '../components/Process';
import Gallery from '../components/Gallery';
import WhyChooseUs from '../components/WhyChooseUs';
import Stylists from '../components/Stylists';
import Footer from '../components/Footer';

const HomePage = () => (
  <div className="bg-[#0f0f0f] min-h-screen">
    <Hero />
    <About />
    <Legacy />
    <Process />
    <Gallery />
    <WhyChooseUs />
    <Stylists />
    <Footer />
  </div>
);

export default HomePage;