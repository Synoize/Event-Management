import { useNavigate } from "react-router-dom";
import { assets, cities } from "../assets/assets";

const EventCity = ({ isOpen, close }) => {
    if (!isOpen) return null;

    const navigate = useNavigate();
    
    return (
        <div className="fixed h-screen inset-0 bg-black/40  flex items-center justify-center z-[999] p-4">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-4xl w-full">
                <div className="flex justify-between mb-6 items-center">
                    <h2 className="text-lg font-semibold ">Select Your City</h2>
                    <img src={assets.menu_close} alt="" sizes="w-20" onClick={close} className="cursor-pointer" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {cities.map((city) => (
                        <span
                            key={city}
                            onClick={() => {
                                localStorage.setItem("eventCity", city);
                                navigate(`/events/${city}`);
                                scrollTo(0, 0);
                                close();
                            }}
                            className="w-full h-20 md:h-40 px-4 py-2 rounded-md bg-gray-100 text-primary-orange hover:bg-primary-pink/10 hover:text-gray-600 transition first-letter:uppercase cursor-pointer"
                        >
                            {city}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EventCity;
