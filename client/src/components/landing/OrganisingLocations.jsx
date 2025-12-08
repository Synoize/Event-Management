import React from "react";
import { MapPin } from "lucide-react";
import { locations } from "../../assets/assets";
import { useEvents } from "../../contexts/EventContext";
import { useNavigate } from "react-router-dom";

const OrganisingLocations = () => {
    const navigate = useNavigate();
    const { eventCity } = useEvents();

    return (
        <section className="w-full bg-white max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            {/* <h2 className="text-3xl md:text-5xl font-semibold text-gray-600 mb-12 mt-4 text-center">
                Organising In India
            </h2> */}
            <h2 className="text-gray-700 tracking-widest mb-10 text-2xl text-center">
                ORGANISING IN INDIA
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {locations.map((loc, index) => (
                    <div
                        key={index}
                        className="flex flex-col md:flex-row items-center md:items-start gap-4 p-6 border hover:shadow-md transition bg-white cursor-default"
                    >
                        <div className="p-3 bg-gray-100 rounded-full shadow-md">
                            <MapPin className="w-6 h-6 text-primary-pink" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900">{loc.city}</h3>
                            <p className="text-gray-600 text-sm mt-1 leading-relaxed line-clamp-2 md:line-clamp-2">{loc.address}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center mt-12">
                <button
                    onClick={() => {
                        eventCity ? navigate(`/events/${eventCity}`) : navigate(`/events`)
                        scrollTo(0, 0);
                    }}
                    className="px-8 py-3 bg-primary-pink text-white rounded-sm text-sm shadow-md hover:bg-primary-pink/90 transition">
                    Book Now
                </button>
            </div>
        </section>
    );
}

export default OrganisingLocations;