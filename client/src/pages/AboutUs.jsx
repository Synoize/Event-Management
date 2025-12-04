import React from 'react'
import Footer from '../components/landing/Footer'

const AboutUs = () => {
  return (
    <div>
      <section className="w-full bg-white max-w-7xl mx-auto py-8 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-semibold text-gray-600 mb-6">
          About Us
        </h2>

        <p className="text-gray-600 text-lg leading-relaxed">
          We are a creative and reliable event management team dedicated to
          bringing your celebrations to life with seamless planning and
          unforgettable experiences. From intimate gatherings to large-scale
          corporate events, we deliver efficient coordination, unique concepts,
          and flawless execution — ensuring your special day is stress-free,
          memorable, and beautifully organized.
        </p>

        <p className="text-gray-600 text-lg leading-relaxed mt-6">
          With a talented network of designers, planners, photographers,
          entertainers, and venues across India, we organize events in multiple
          cities including Bangalore, Mumbai, Hyderabad, Chennai, Pune, Gurgaon,
          Jaipur, Ahmedabad, and many more. Our mission is to make every event
          special, personal, and perfectly executed — no compromises.
        </p>

        <div className="mt-10 grid md:grid-cols-3 gap-8">
         <div className='bg-primary-pink/70 hover:bg-primary-pink/60 hover:shadow-sm p-4 px-8'>
            <h3 className="text-2xl font-semibold text-gray-900">500+ Events</h3>
            <p className="text-white mt-2 text-sm">
              Successfully organized across India.
            </p>
          </div>
          <div className='bg-primary-pink/70 hover:bg-primary-pink/60 hover:shadow-sm p-4 px-8'>
            <h3 className="text-2xl font-semibold text-gray-900">Expert Team</h3>
            <p className="text-white mt-2 text-sm">
              Creative professionals with years of experience.
            </p>
          </div>
        <div className='bg-primary-pink/70 hover:bg-primary-pink/60 hover:shadow-sm p-4 px-8'>
            <h3 className="text-2xl font-semibold text-gray-900">
              Pan-India Reach
            </h3>
            <p className="text-white mt-2 text-sm">
              We bring your events to life across multiple major cities.
            </p>
          </div>
        </div>
      </div>
    </section>
    <Footer/>
    </div>
  )
}

export default AboutUs