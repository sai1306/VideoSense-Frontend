const VideoPlayer = ({ id }) => {
  const token = localStorage.getItem("token");

  return (
    <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
      <video className="w-full h-full" controls autoPlay>
        <source
          src={`http://localhost:4000/api/videos/stream/${id}?token=${token}`}
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
