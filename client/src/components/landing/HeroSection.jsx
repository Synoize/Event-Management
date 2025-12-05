import React from "react";
import { motion } from "framer-motion";
import { assets, slide_images_1, slide_images_2 } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../../contexts/EventContext";

const HeroSection = () => {
  const navigate = useNavigate();
  const { eventCity } = useEvents();

  // Animation settings
  const scrollDuration = 30;

  return (
    <section className="w-full md:h-[86vh] bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col h-full md:flex-row justify-between md:gap-10 items-center">

        {/* LEFT SECTION */}
        <div className="py-12 flex flex-col justify-center items-center md:items-start">
          <span className="px-4 py-2 border rounded-full text-gray-600 text-sm">
            Get Access To
          </span>

          <h1 className="text-4xl md:text-7xl font-extrabold text-gray-900 mt-4 leading-tight text-center md:text-start">
            Transform Your  <br /> Events With 
          </h1>

          <p className="px-8 md:px-0 text-gray-500 md:text-xl mt-4 md:mt-8 max-w-xl  text-center md:text-start">
             A Modern Platform that handles everything from planning to execution. Whether it's a college fest, corporate event, workshop, or cultural program — manage it all in one place, effortlessly.
          </p>

          <button
            onClick={() => {
              eventCity ? navigate(`/events/${eventCity}`) : navigate(`/events`)
              scrollTo(0, 0);
            }}
            className="mt-12 px-6 py-3 bg-primary-pink/90 hover:bg-primary-pink text-white text-sm rounded-lg shadow-md transition"
          >
            Book Now
          </button>

          <div className="flex items-center gap-3 mt-6">
            <div className="flex -space-x-3">
              <img src={assets.profile_icon} className="w-10 h-10 rounded-full border-2 border-white" />
              <img src={assets.profile_icon} className="w-10 h-10 rounded-full border-2 border-white" />
              <img src={assets.profile_icon} className="w-10 h-10 rounded-full border-2 border-white" />
              <img src={assets.profile_icon} className="w-10 h-10 rounded-full border-2 border-white" />
            </div>
            <div className="text-yellow-500 text-xl">★★★★★</div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex gap-4 h-52 md:h-full overflow-hidden">

          {/* COLUMN 1 (scroll DOWN) */}
          <motion.div
            className="flex flex-col gap-4"
            animate={{ y: ["0%", "-100%"] }}
            transition={{
              duration: scrollDuration,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {[...slide_images_1, ...slide_images_1].map((src, i) => (
              <img
                key={i}
                src={src}
                className="w-34 h-34 md:w-52 md:h-60 object-cover "
              />
            ))}
          </motion.div>

          {/* COLUMN 2 (scroll UP) */}
          <motion.div
            className="flex flex-col gap-4"
            animate={{ y: ["-100%", "0%"] }}
            transition={{
              duration: scrollDuration,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {[...slide_images_2, ...slide_images_2].map((src, i) => (
              <img
                key={i}
                src={src}
                className="w-34 h-34 md:w-52 md:h-60 object-cover"
              />
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
