import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate=useNavigate();
  return (
    <>
      <div className="absolute top-6 right-24 z-50">
        <button className="px-5 py-3 bg-orange-600 text-white rounded-md mr-2 hover:bg-orange-700" onClick={()=>{navigate("/login")}}>
          Login/Registration
        </button>
        <button className="px-5 py-3 bg-orange-600 text-white rounded-md mr-2 hover:bg-orange-700">
          Admin Login
        </button>
      </div>
      <div className="px-28" style={{ backgroundColor: "#3a4c77" }}>
        <div className="text-5xl font-bold py-14 text-white">
          National Healthcare Providers Registry
        </div>
        <div className="flex space-x-20">
          <div className="w-1/2 text-white">
            <p className="mt-4 text-lg font-medium">Healthcare</p>
            <h2 className="mt-2 text-4xl font-semibold">
              Professionals Registry
            </h2>
            <p className="mt-4 my-8">
              Healthcare Professionals Registry (HPR) is a comprehensive
              repository of registered and verified different system of
              medicines (Modern medicine, Dentistry, Ayurveda, Unani, Siddha,
              Sowa-Rigpa, Homeopathy) and Nurses practitioners delivering
              healthcare services across India. The Ayushman Bharat Digital
              Mission (ABDM) empowers healthcare professionals and encourages to
              be part of India’s digital health ecosystem through a unique
              Healthcare professional ID. With last mile coverage, people will
              be able to interact with healthcare practitioners or vice versa.{" "}
              <br />
              <br />
              Healthcare professional profile visible in the ABDM ecosystem is
              verified and authorized to practice medicine in the country. The
              HPR ensures that healthcare practitioners suitably trained and
              qualified to practice medicine with competence and ethical
              conformity are allowed to register with the HPR.
            </p>
          </div>
          <div className="w-1/2 text-white">
            <p className="mt-4 text-lg font-medium">Health</p>
            <h2 className="mt-2 text-4xl font-semibold">Facility Registry</h2>
            <p className="mt-4">
              Health Facility Registry is a comprehensive repository of health
              facilities of the country across modern and traditional systems of
              medicine. It includes both public and private health facilities
              including hospitals, clinics, diagnostic laboratories and Health
              Facility Registry is a comprehensive repository of health
              facilities of the country across modern and traditional systems of
              medicine. It includes both public and private health facilities
              including hospitals, clinics, diagnostic laboratories and imaging
              centers, pharmacies, etc.
              <br />
              <br /> Registration will enable health facilities to get connected
              to India's digital health ecosystem and allow their listing on a
              national platform. This will instill trust in citizens seeking
              healthcare services by improving discovery of health facilities.
              Health facilities signing up will be able to gain access to a host
              of digital services.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
