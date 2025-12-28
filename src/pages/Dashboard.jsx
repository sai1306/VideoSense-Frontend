import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import UploadVideo from "../components/VideoUpload";
import VideoList from "../components/VideoList";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const { user } = useAuth();
  const [refresh, setRefresh] = useState(0);

  const handleUploadSuccess = () => {
    setRefresh(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Left Column: Upload (Editors/Admins only) */}
          {(user.role === 'admin' || user.role === 'editor') && (
            <div className="lg:col-span-1">
              <UploadVideo onUploadSuccess={handleUploadSuccess} />
            </div>
          )}

          {/* Right Column: List */}
          <div className={(user.role === 'admin' || user.role === 'editor') ? "lg:col-span-3" : "lg:col-span-4"}>
            <VideoList refresh={refresh} />
          </div>

        </div>
      </div>
    </div>
  );
}
