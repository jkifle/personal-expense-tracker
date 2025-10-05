// src/pages/Contact.jsx
import React from "react";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center  px-6 py-16">
      <div className="max-w-4xl w-full  rounded-2xl bg-slate-900 shadow-md p-10 flex flex-col md:flex-row items-center gap-10">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <img
            src="/graphic/img/profile.JPG" // replace with your image in /public folder
            alt="Joseph Kifle"
            className="w-40 h-40 rounded-full object-cover shadow-md border"
          />
        </div>

        {/* Contact Info */}
        <div className="flex flex-col text-center md:text-left">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Get in Touch
          </h1>
          <p className="text-gray-300 text-lg mb-4 max-w-md">
            I’m always open to discussing new projects, opportunities, or
            collaborations related to software engineering, data-driven
            development, and accessible design.
          </p>

          <div className="space-y-2 text-gray-300">
            <p>
              <strong>Name:</strong> Joseph Kifle
            </p>
            <p>
              <strong>Major:</strong> Computer Engineering
            </p>
            <p>
              <strong>University:</strong> University of Tennessee, Knoxville
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <a
                href="mailto:kifle.joe@gmail.com"
                className="text-blue-600 hover:underline"
              >
                kifle.joe@gmail.com
              </a>
            </p>
            <p>
              <strong>LinkedIn:</strong>{" "}
              <a
                href="https://www.linkedin.com/in/josephkifle"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                linkedin.com/in/josephkifle
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="text-center text-gray-500 text-sm mt-12">
        <p>© {new Date().getFullYear()} Joseph Kifle | Pocket Watch Project</p>
      </div>
    </div>
  );
}
