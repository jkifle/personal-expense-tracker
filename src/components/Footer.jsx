import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="">
      <div className="flex flex-row pr-4 flex-wrap items-center justify-center gap-y-6 gap-x-12 text-center md:justify-between">
        <Link to={"/"}>
          <img
            src="/graphic/img/jomango.jpg"
            alt="logo-ct"
            className="m-2 w-16"
          />
        </Link>
        <ul className="flex flex-wrap items-center gap-y-2 gap-x-8">
          <Link to={"/about"}>
            <li className="">About</li>
          </Link>

          <Link to={"/contact"}>
            <li as="a" className="">
              Contact
            </li>
          </Link>
        </ul>
      </div>
      <hr className="my-8 border-blue-gray-50" />
      <div className="text-center pb-5 font-normal text-white">
        <p>
          {" "}
          &copy; {new Date().getFullYear()} Joseph Kifle | Pocket Watch Project
        </p>
      </div>
    </footer>
  );
};

export default Footer;
