import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="h-screen mx-auto grid place-items-center text-center px-8">
      <div>
        <img src="/graphic/img/sad.png" className="w-20 h-20 mx-auto" />
        <div
          variant="h1"
          color="blue-gray"
          className="mt-10 !text-3xl !leading-snug md:!text-4xl"
        >
          Error 404 <br /> It looks like something went wrong.
        </div>
        <div className="mt-8 mb-14 text-[18px] font-normal text-gray-500 mx-auto md:max-w-sm">
          Please try refreshing the page or come back later.
        </div>
        <Link to={"/"}>
          <ul className="">back home</ul>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
