import React from "react";
import { gallery, sponsors } from "../../assets/assets";

const GallerySponsors = () => {
  return (
    <div className="max-w-7xl mx-auto bg-white px-4 sm:px-6 lg:px-8">
      {/* IMAGE GALLERY */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {gallery.map((img, i) => (
          <div key={i} className="overflow-hidden">
            <img
              src={img}
              alt={`gallery-${i}`}
              loading="lazy"
              className="w-full h-48 object-cover hover:scale-110 transition-all duration-300"
            />
          </div>
        ))}
      </div>

      {/* SPONSORS SECTION */}
      <div className="py-16 bg-white text-center">
        <h2 className="text-gray-700 tracking-widest mb-10 text-2xl">
          OUR SPONSORS
        </h2>

        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-5 gap-8 px-4">
          {sponsors.map((sponsor, index) => (
            <div
              key={index}
              className="flex flex-col items-center opacity-80 hover:opacity-100 transition"
            >
              <img src={sponsor.src} alt={sponsor.name} loading="lazy" className="h-12 object-contain" />
              <p className="text-xs mt-2 text-gray-600">{sponsor.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GallerySponsors;
