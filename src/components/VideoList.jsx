import { useEffect, useState } from "react";
import api from "../api/axios";
import VideoPlayer from "./VideoPlayer";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:4000";

export default function VideoList({ refresh }) {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Filter States
  const [filters, setFilters] = useState({
    safetyStatus: '',
    category: '',
    startDate: '',
    endDate: '',
    myVideos: '', // '' = all, 'true' = my videos
    minSize: '',
    maxSize: '',
    minDuration: '',
    maxDuration: '',
  });

  useEffect(() => {
    fetchVideos();
  }, [refresh, filters]); // Re-fetch when filters change

  // Socket listener for real-time updates
  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on("video_processing_update", (data) => {
      setVideos((prevVideos) =>
        prevVideos.map((v) =>
          v._id === data.videoId
            ? {
              ...v,
              processingProgress: data.progress,
              status: data.status,
              sensitivity: data.sensitivity || v.sensitivity,
              message: data.message
            }
            : v
        )
      );

      // If a new video has just started processing but isn't in our list yet (rare race condition but possible if list fetched before processing start), 
      // we might want to refetch, but typically we handle that with 'refresh' prop from parent.
    });

    return () => socket.close();
  }, []);

  const fetchVideos = async () => {
    try {
      // Remove empty filters and convert units
      const params = Object.fromEntries(
        Object.entries(filters)
          .filter(([_, v]) => v !== '')
          .map(([k, v]) => {
            if (k === 'minSize' || k === 'maxSize') return [k, Number(v) * 1024 * 1024]; // MB to Bytes
            return [k, v];
          })
      );
      const res = await api.get("/api/videos", { params });
      setVideos(res.data);
    } catch (err) {
      console.error("Failed to fetch videos", err);
    }
  };

  const getStatusBadge = (video) => {
    // If explicitly flagged as failed
    if (video.status === 'failed') return <div className="badge badge-error gap-2">Failed</div>;

    // If completed, check sensitivity
    if (video.status === 'completed') {
      if (video.sensitivity?.isSafe === false) {
        return <div className="badge badge-error gap-2">Flagged</div>;
      }
      return <div className="badge badge-success gap-2">Safe</div>;
    }

    // Default processing/pending
    if (video.status === 'processing') {
      return <div className="badge badge-warning gap-2">Processing {video.processingProgress}%</div>;
    }

    return <div className="badge badge-ghost">{video.status}</div>;
  };

  return (
    <div className="mt-8">
      {/* Filters Section */}
      <div className="collapse collapse-arrow bg-base-200 mb-6">
        <input type="checkbox" />
        <div className="collapse-title text-xl font-medium">
          Filter Videos
        </div>
        <div className="collapse-content">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-2">

            {/* View Mode Filter */}
            <div className="form-control">
              <label className="label"><span className="label-text">View</span></label>
              <select
                className="select select-bordered select-sm w-full"
                value={filters.myVideos}
                onChange={(e) => setFilters({ ...filters, myVideos: e.target.value })}
              >
                <option value="">All Videos</option>
                <option value="true">My Videos</option>
              </select>
            </div>

            {/* Safety Status Filter */}
            <div className="form-control">
              <label className="label"><span className="label-text">Safety Status</span></label>
              <select
                className="select select-bordered select-sm w-full"
                value={filters.safetyStatus}
                onChange={(e) => setFilters({ ...filters, safetyStatus: e.target.value })}
              >
                <option value="">All</option>
                <option value="safe">Safe</option>
                <option value="flagged">Flagged</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="form-control">
              <label className="label"><span className="label-text">Category</span></label>
              <select
                className="select select-bordered select-sm w-full"
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              >
                <option value="">All</option>
                <option value="General">General</option>
                <option value="Education">Education</option>
                <option value="Entertainment">Entertainment</option>
                <option value="News">News</option>
                <option value="Sports">Sports</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Start Date Filter */}
            <div className="form-control">
              <label className="label"><span className="label-text">Start Date</span></label>
              <input
                type="date"
                className="input input-bordered input-sm w-full"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
            </div>

            {/* End Date Filter */}
            <div className="form-control">
              <label className="label"><span className="label-text">End Date</span></label>
              <input
                type="date"
                className="input input-bordered input-sm w-full"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>

            {/* Size Filters */}
            <div className="form-control">
              <label className="label"><span className="label-text">Min Size (MB)</span></label>
              <input
                type="number"
                className="input input-bordered input-sm w-full"
                value={filters.minSize}
                onChange={(e) => setFilters({ ...filters, minSize: e.target.value })}
              />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Max Size (MB)</span></label>
              <input
                type="number"
                className="input input-bordered input-sm w-full"
                value={filters.maxSize}
                onChange={(e) => setFilters({ ...filters, maxSize: e.target.value })}
              />
            </div>

            {/* Duration Filters */}
            <div className="form-control">
              <label className="label"><span className="label-text">Min Duration (sec)</span></label>
              <input
                type="number"
                className="input input-bordered input-sm w-full"
                value={filters.minDuration}
                onChange={(e) => setFilters({ ...filters, minDuration: e.target.value })}
              />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Max Duration (sec)</span></label>
              <input
                type="number"
                className="input input-bordered input-sm w-full"
                value={filters.maxDuration}
                onChange={(e) => setFilters({ ...filters, maxDuration: e.target.value })}
              />
            </div>

            {/* Reset Button */}
            <div className="form-control md:col-span-1 lg:col-span-5 flex justify-end">
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setFilters({ safetyStatus: '', category: '', startDate: '', endDate: '', myVideos: '', minSize: '', maxSize: '', minDuration: '', maxDuration: '' })}
              >
                Clear Filters
              </button>
            </div>

          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4 px-1">{filters.myVideos === 'true' ? 'My Videos' : 'All Videos'}</h2>

      {videos.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No videos uploaded yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video._id} className="card bg-base-100 shadow-xl border border-base-200 hover:shadow-2xl transition">
              <figure className="h-48 bg-gray-200 flex items-center justify-center relative">
                <span className="text-4xl">🎬</span>
                <div className="absolute top-2 right-2">
                  {getStatusBadge(video)}
                </div>
                {video.visibility === 'private' && (
                  <div className="absolute top-2 left-2 badge badge-neutral gap-1">
                    🔒 Private
                  </div>
                )}
              </figure>
              <div className="card-body p-4">
                <h2 className="card-title text-base truncate" title={video.title}>{video.title || "Untitled"}</h2>

                {/* Progress Bar & Message for Processing Videos */}
                {video.status === 'processing' && (
                  <div className="mt-2 text-center">
                    <progress className="progress progress-primary w-full" value={video.processingProgress || 0} max="100"></progress>
                    <p className="text-xs text-info mt-1 animate-pulse">{video.message || "Processing..."}</p>
                  </div>
                )}

                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">{new Date(video.createdAt).toLocaleDateString()}</span>

                  {video.status === 'completed' && (
                    <button
                      style={{ backgroundColor: "#422ad5", color: "white" }}
                      className="btn p-4 btn-sm btn-primary"
                      onClick={() => setSelectedVideo(video._id)}
                    >
                      Play
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Player Modal */}
      {selectedVideo && (
        <dialog className="modal modal-open">
          <div className="modal-box w-11/12 max-w-4xl p-0 overflow-hidden bg-black">
            <VideoPlayer id={selectedVideo} />
            <div className="modal-action absolute top-0 right-2 mt-0">
              <button className="btn btn-circle btn-sm btn-ghost text-white" onClick={() => setSelectedVideo(null)}>✕</button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setSelectedVideo(null)}>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
}
