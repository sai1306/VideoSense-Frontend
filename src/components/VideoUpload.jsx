import { useState } from "react";
import api from "../api/axios";

const VideoUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [visibility, setVisibility] = useState("public");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("video/")) {
      setFile(selectedFile);
    } else {
      alert("Please upload a valid video file");
    }
  };

  const handleUpload = async () => {
    if (!file || !title) return alert("Title and video are required");

    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title);
    formData.append("category", category);
    formData.append("visibility", visibility);

    try {
      setStatus("Uploading...");
      setProgress(0);

      await api.post("/api/videos/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
      });

      setStatus("Upload successful! Processing has started.");
      setProgress(100);
      setFile(null);
      setTitle("");

      if (onUploadSuccess) onUploadSuccess();

      setTimeout(() => {
        setStatus("");
        setProgress(0);
      }, 3000);

    } catch (error) {
      console.error(error);
      setStatus("Upload failed");
      setProgress(0);
    }
  };

  return (
    <div className="card w-full bg-base-100 shadow-xl border border-base-200">
      <div className="card-body">
        <h2 style={{ fontSize: "1.5rem" }} className="card-title text-primary">Upload New Video</h2>

        <div className="form-control w-full">
          <label className="label"><span className="label-text">Video Title</span></label>
          <input
            type="text"
            placeholder="Enter video title"
            className="p-2 input input-bordered w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-control w-full mt-2">
          <label className="label"><span className="label-text">Category</span></label>
          <select
            className="select select-bordered w-full"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="General">General</option>
            <option value="Education">Education</option>
            <option value="Entertainment">Entertainment</option>
            <option value="News">News</option>
            <option value="Sports">Sports</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-control w-full mt-2">
          <label className="label"><span className="label-text">Visibility</span></label>
          <select
            className="select select-bordered w-full"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          >
            <option value="public">Public</option>
            <option value="private">Private (Only You & Admin)</option>
          </select>
        </div>

        <div className="form-control w-full mt-2">
          <label className="label"><span className="label-text">Select Video File</span></label>
          <input
            type="file"
            accept="video/*"
            className="file-input file-input-bordered file-input-primary w-full"
            onChange={handleFileChange}
          />
        </div>
        <div className="card-actions justify-end mt-4">
          <button
            style={{ backgroundColor: "#422ad5", color: "white" }}
            className="btn p-4 dark btn-accent btn-lg btn-active"
            onClick={handleUpload}
            disabled={!file || !title || (progress > 0 && progress < 100)}
          >
            {progress > 0 && progress < 100 ? <span className="loading loading-spinner"></span> : "Upload Video"}
          </button>
        </div>
        {progress > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span>{status}</span>
              <span>{progress}%</span>
            </div>
            <progress className="progress progress-primary w-full" value={progress} max="100"></progress>
          </div>
        )}

        {/* Helper text for status even when progress is 0 (e.g. failed) */}
        {status && progress === 0 && (
          <div className="mt-2 text-sm text-error">{status}</div>
        )}
      </div>
    </div>
  );
};

export default VideoUpload;

