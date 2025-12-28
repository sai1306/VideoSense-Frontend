import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <div className="hero flex-1 bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              VideoSense
            </h1>
            <p className="py-6 text-xl">
              Upload, Analyze & Stream Videos Securely. <br />
              Automated sensitivity analysis, real-time processing, and seamless playback.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/register" className="btn btn-primary">Start Uploading</Link>
              <Link to="/login" className="btn btn-outline">Login</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="bg-base-100 py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <Feature
            title="Secure Uploads"
            desc="Upload videos with validation, access control, and secure storage."
            icon="🔒"
          />
          <Feature
            title="Sensitivity Analysis"
            desc="Automated content screening to classify videos as safe or flagged."
            icon="🛡️"
          />
          <Feature
            title="Smooth Streaming"
            desc="Optimized video streaming using HTTP range requests."
            icon="🎥"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="footer footer-center p-4 bg-base-300 text-base-content">
        <aside>
          <p>© 2025 VideoSense. All rights reserved.</p>
        </aside>
      </footer>
    </div>
  );
}

function Feature({ title, desc, icon }) {
  return (
    <div className="card bg-base-100 shadow-xl border border-base-200 hover:border-primary transition duration-300">
      <div className="card-body items-center text-center">
        <h2 className="card-title text-4xl mb-2">{icon}</h2>
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-base-content/70">{desc}</p>
      </div>
    </div>
  );
}
