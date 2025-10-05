// src/pages/About.jsx
import React from "react";

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Header */}
      <h1 className="text-4xl font-bold text-gray-300 mb-8">
        About Pocket Watch
      </h1>

      {/* Project Overview */}
      <section className="mb-12">
        <p className="text-gray-100 leading-relaxed mb-4">
          <strong>Pocket Watch</strong> is a personal expense tracker designed
          to help users take control of their financial habits through
          intelligent insights and automation. The app integrates securely with
          users’ financial institutions via <strong>Plaid</strong>, allowing
          real-time transaction imports that categorize, visualize, and
          summarize spending across accounts.
        </p>

        <p className="text-gray-100 leading-relaxed mb-4">
          Key features include:
        </p>

        <ul className="list-disc list-inside text-gray-100 space-y-2 mb-4">
          <li>Seamless Plaid integration for secure bank connectivity.</li>
          <li>
            Automatic transaction categorization and expense visualization.
          </li>
          <li>Real-time synchronization with Firestore for persistent data.</li>
          <li>Responsive, accessible UI for mobile and desktop users.</li>
          <li>
            Transaction management tools, including manual edits and deletions.
          </li>
        </ul>

        <p className="text-gray-100 leading-relaxed">
          This project reflects my drive to work in environments where I can{" "}
          <strong>
            elevate business workflows, streamline efficiency, and create
            accessible, intuitive systems
          </strong>{" "}
          that adapt to users of all kinds. I aim to build tools that{" "}
          <strong>enhance productivity and usability</strong> through thoughtful
          design and reliable engineering. Pocket Watch embodies that
          goal—turning complex financial data into a simple, meaningful
          experience that helps people make smarter decisions every day.
        </p>
      </section>

      {/* Developer Bio Section */}
      <section className="flex flex-col md:flex-row items-center gap-8">
        {/* Profile Image */}
        <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden shadow-md flex-shrink-0">
          <img
            src="/graphic/img/profile.JPG" // Replace with your actual image path
            alt="Joseph Kifle"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Bio Text */}
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-gray-300 mb-3">
            About the Developer
          </h2>
          <p className="text-gray-100 leading-relaxed mb-2">
            <strong>Joseph Kifle</strong> is a Computer Engineering major at the{" "}
            <strong>University of Tennessee, Knoxville</strong>. He is
            passionate about leveraging technology to create systems that make
            information accessible, workflows efficient, and user experiences
            seamless.
          </p>
          <p className="text-gray-100 leading-relaxed mb-2">
            At UTK, Joseph is actively involved in the{" "}
            <strong>National Society of Black Engineers (NSBE)</strong>,{" "}
            <strong>Hack4Impact</strong>, and other innovation-driven
            organizations that promote collaboration and technical growth. His
            work reflects a balance of creativity, logic, and user-centered
            design.
          </p>
          <p className="text-gray-100 leading-relaxed">
            Connect with Joseph on{" "}
            <a
              href="https://www.linkedin.com/in/josephkifle"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              LinkedIn
            </a>{" "}
            to learn more about his projects and professional journey.
          </p>
        </div>
      </section>
    </div>
  );
}
