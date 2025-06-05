import React from "react";
import { NavLink } from "react-router-dom";
import { RouteIndex, RouteTaskList } from "../helper/RouteName"; 

const Navigation = () => {
    const baseLinkClass =
        "relative flex items-center justify-center px-4 py-2 font-medium text-lg text-gray-700 hover:text-blue-600 transition-colors duration-300 ease-in-out group";

    const activeLinkClass =
        "text-blue-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600 after:transform after:scale-x-100"; 

    return (
        <nav className="mb-6 border-b border-gray-200 flex justify-center sm:justify-start space-x-6 py-4">
            <NavLink
                to={RouteIndex}
                className={({ isActive }) =>
                    `${baseLinkClass} ${isActive ? activeLinkClass : ''}`
                }
            >
                Add Task
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
            </NavLink>
            <NavLink
                to={RouteTaskList}
                className={({ isActive }) =>
                    `${baseLinkClass} ${isActive ? activeLinkClass : ''}`
                }
            >
                My Tasks
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
            </NavLink>
        </nav>
    );
};

export default Navigation;