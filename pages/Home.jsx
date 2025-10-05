import React from "react";
import Slideshow from "../src/components/PhotoCarousel.jsx";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center">
      <section className="w-full mb-16">
        <Slideshow />
      </section>

      {/* Intro / Tagline */}
      <section className="max-w-5xl text-center px-6 mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Manage Smarter with Pocket Watch
        </h1>
        <p className="text-lg text-gray-100 leading-relaxed max-w-3xl mx-auto">
          Pocket Watch is a personal expense tracker built to simplify how you
          understand your finances. By connecting securely with your bank
          through Plaid, it gives you real-time insights into where your money
          goes—helping you plan better and spend smarter.
        </p>
      </section>

      {/* Feature Highlights */}
      <section className="max-w-6xl px-6 py-10 grid md:grid-cols-3 gap-8 text-center">
        <div className="p-6 border rounded-2xl shadow-sm hover:shadow-md transition">
          <h3 className="text-xl font-semibold mb-2">
            🔗 Seamless Integration
          </h3>
          <p>
            Securely connect your financial accounts via Plaid and watch your
            transactions sync automatically in real-time.
          </p>
        </div>
        <div className="p-6 border rounded-2xl shadow-sm hover:shadow-md transition">
          <h3 className="text-xl font-semibold mb-2">📊 Visual Insights</h3>
          <p>
            Get a clear breakdown of your spending patterns with clean charts
            and categorization tools that make data easy to understand.
          </p>
        </div>
        <div className="p-6 border rounded-2xl shadow-sm hover:shadow-md transition">
          <h3 className="text-xl font-semibold mb-2">⚙️ Smart Management</h3>
          <p>
            Add, edit, or remove transactions with ease while keeping everything
            synced across devices through Firestore persistence.
          </p>
        </div>
      </section>

      {/* Why It Matters / Value Section */}
      <section className="w-full bg-slate-950 py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-semibold pb-4">
            Built for Simplicity and Impact
          </h2>
          <p className="leading-relaxed max-w-3xl mx-auto mb-8">
            Pocket Watch isn’t just about tracking numbers—it’s about helping
            people make informed, confident financial decisions. From
            intelligent categorization to user-friendly design, every feature
            supports the goal of making personal finance accessible, efficient,
            and empowering.
          </p>
          <Link
            to="/about"
            className="bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-slate-700 transition"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-semibold text-gray-300 mb-4">
          Ready to Take Control of Your Finances?
        </h2>
        <p className="text-gray-100 mb-8">
          Get started today and experience how simple financial clarity can be.
        </p>
        <a
          href="/overview" // or your actual route for the dashboard
          className="bg-green-500 text-slate-800 font-semibold py-3 px-8 rounded-lg hover:bg-green-100 transition"
        >
          Try Pocket Watch
        </a>
      </section>
    </div>
  );
}
