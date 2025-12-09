import React from "react";

const Footer = () => {
  return (
    <section className="w-full bg-white max-w-7xl mx-auto py-8 md:py-16 px-4 sm:px-6 lg:px-8 border-t">
      <h2 className="text-3xl md:text-5xl font-semibold text-gray-600 mb-6 md:mb-10">
        Get in touch.
      </h2>

      <div className="flex gap-10 text-sm md:text-xl font-medium text-gray-800">
        <a
          href="https://www.instagram.com/joinphantomcircle/"
          target="_blank"
          className="hover:text-primary-pink transition duration-200"
        >
          Instagram
        </a>
        <a
          href="https://grabify.link/B7QMKE"
          target="_blank"
          className="hover:text-primary-pink transition duration-200"
        >
          Linktree
        </a>
      </div>
    </section>
  );
}

export default Footer;