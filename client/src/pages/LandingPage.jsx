import React from 'react'
import HeroSection from '../components/landing/HeroSection'
import OrganisingLocations from '../components/landing/OrganisingLocations'
import Footer from '../components/landing/Footer'
import GallerySponsors from '../components/landing/GallerySponsors'

const LandingPage = () => {
  return (
     <div>
      <HeroSection/>
      <OrganisingLocations/>
      <GallerySponsors/>
      <Footer/>
     </div>
  )
}

export default LandingPage