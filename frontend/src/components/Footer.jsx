import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";
import {
  FaFacebook,
  FaInstagram,
  FaPinterest,
  FaTwitterSquare,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-200 py-10">
      <div className="max-w-7xl mx-auto px-4 md:flex md:justify-between">
        <div className="mb-6 md:mb-0">
          <Link to={"/"}>
            <img
              src={Logo}
              alt="logo"
              className="w-27 h-7 md:w-33 md:h-10 dark:invert"
            />
          </Link>
          <p className="mt-4">
            Sharing stories, ideas, and blogging inspiration.
          </p>
          <p className="mt-3 text-sm">123 Blogify, ISB PK 10001</p>
          <p className="text-sm">Email: support@blogify.com</p>
          <p className="text-sm">Phone: (123) 456-7890</p>
        </div>

        <div className="mb-6 md:mb-0">
          <h3 className="text-xl font-semibold ">Quick Links</h3>
          <ul className="mt-4 text-sm space-y-2">
            <li className="cursor-pointer hover:underline">
              <a href="/">Home</a>
            </li>
            <li className="cursor-pointer hover:underline">
              <a href="/blogs">Blogs</a>
            </li>
            <li className="cursor-pointer hover:underline">
              <a href="/about">About us</a>
            </li>
            <li className="cursor-pointer hover:underline">
              <a href="#">FAQa</a>
            </li>
          </ul>
        </div>
        <div className="mb-6 md:mb-0">
          <h3 className="text-xl font-semibold">Follow Us</h3>
          <div className="flex space-x-4 mt-4 cursor-pointer">
            <FaFacebook />
            <FaInstagram />
            <FaTwitterSquare />
            <FaPinterest />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold">Stay in the Loop</h3>
          <p className="mt-4 text-sm">
            Subscribe to get special offers, free giveaways, and more
          </p>
          <form className="mt-4 flex">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full p-2 rounded-l-md text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 bg-transparent"
            />
            <button
              type="submit"
              className="bg-red-600 text-white px-4 rounded-r-md hover:bg-red-700 cursor-pointer"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-center text-sm">
        <p>
          &copy; 2026 <span className="text-red-500">Blogify</span>. All rights
          reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
