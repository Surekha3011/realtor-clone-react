import React from "react";
import spinner from "../assets/svg/spinner.svg";
export default function Spinner() {
  return (
    <div className=" bg-black flex items-center bg-opacity-50 justify-center fixed left-0 right-0 bottom-0 top-0 z-50">
      <div>
        <img src={spinner} alt="loading..." className="h-24"></img>
      </div>
    </div>
  );
}
