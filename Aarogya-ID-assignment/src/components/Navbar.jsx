import React from "react";
import { Link } from "react-router-dom";
import { Search } from "@mui/icons-material";

const Navbar = () => {
  return (
    <div className="h-10vh bg-blue-900 flex justify-between items-center z-50 text-white sticky px-24 py-2">
      <ul className="flex space-x-6 ml-5">
        <li>
          <Link to="/" className="hover:text-yellow-500"> {/* Added hover:text-yellow-500 */}
            Home
          </Link>
        </li>
        <li>
          <Link to="/about" className="hover:text-yellow-500"> {/* Added hover:text-yellow-500 */}
            About ABDM
          </Link>
        </li>
        <li>
          <Link to="/resource" className="hover:text-yellow-500"> {/* Added hover:text-yellow-500 */}
            Resource Center
          </Link>
        </li>
        <li>
          <Link to="/support" className="hover:text-yellow-500"> {/* Added hover:text-yellow-500 */}
            Support
          </Link>
        </li>
      </ul>
      <div className="relative flex items-center mx-2">
        <input
          type="text"
          placeholder="Know your doctor/facility"
          className="px-4 py-2 pr-8 rounded bg-slate-900 text-white placeholder-white"
        />
        <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white" /> 
      </div>
    </div>
  );
};

export default Navbar;
