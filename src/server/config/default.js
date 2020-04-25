const config = {
  server: {
    secret: "kjVkuti2xAyF3JGCzSZTk0YWM5JhI9mgQW4rytXc",
    port: 3333,
  },
  rtmp_server: {
    rtmp: {
      port: 1935,
      chunk_size: 60000,
      gop_cache: true,
      ping: 60,
      ping_timeout: 30,
    },
    http: {
      port: 8888,
      mediaroot: "./server/media",
      allow_origin: "*",
    },
    trans: {
      ffmpeg:
        process.env.NODE_ENV === "production"
          ? "/app/vendor/ffmpeg/ffmpeg"
          : "C:/Users/willw/Documents/ffmpeg/ffmpeg/bin/ffmpeg.exe",
      tasks: [
        {
          app: "live",
          archive: "archive",
          hls: true,
          hlsFlags: "[hls_time=2:hls_list_size=3:hls_flags=delete_segments]",
          dash: true,
          dashFlags: "[f=dash:window_size=3:extra_window_size=5]",
          mp4: true,
          mp4Flags: "[movflags=faststart]",
        },
      ],
    },
  },
  mongodb_url: {
    url: process.env.MONGODB_URL,
  },
  FACEBOOK: {
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_KEY,
  },
  Facebookcallback:
    process.env.NODE_ENV === "production"
      ? `https://secure-scrubland-97842.herokuapp.com/login/facebook/callback`
      : `http://localhost:4000/login/facebook/callback`,
  // Facebookcallback: "http://localhost:4000/login/facebook/callback",
  CLIENT_ORIGIN:
    process.env.NODE_ENV === "production"
      ? "https://secure-scrubland-97842.herokuapp.com"
      : ["http://127.0.0.1:4000", "http://localhost:4000"],
  // CLIENT_ORIGIN: ["http://127.0.0.1:4000", "http://localhost:4000"],
};

module.exports = config;
