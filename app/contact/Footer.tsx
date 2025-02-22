import React from 'react';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4 flex justify-center items-center space-x-6">
        {/* GitHub Icon */}
        <a
          href="https://github.com/MucahidUsta"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-400 transition-colors"
        >
          <FaGithub size={24} />
        </a>

        {/* LinkedIn Icon */}
        <a
          href="https://www.linkedin.com/in/bahtiyar-m%C3%BCcahid-usta-2b60ba261/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-400 transition-colors"
        >
          <FaLinkedin size={24} />
        </a>

        {/* Gmail Icon */}
        <a
          href="mailto:ustamucahid.b@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-400 transition-colors"
        >
          <FaEnvelope size={24} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;