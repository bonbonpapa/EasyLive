const config = {
  server: {
    secret: "kjVkuti2xAyF3JGCzSZTk0YWM5JhI9mgQW4rytXc",
    port: 3333
  },
  rtmp_server: {
    rtmp: {
      port: 1935,
      chunk_size: 60000,
      gop_cache: true,
      ping: 60,
      ping_timeout: 30
    },
    http: {
      port: 8888,
      mediaroot: "./server/media",
      allow_origin: "*"
    },
    trans: {
      ffmpeg: "C:/Users/willw/Documents/ffmpeg/ffmpeg/bin/ffmpeg.exe",
      tasks: [
        {
          app: "live",
          archive: "archive",
          hls: true,
          hlsFlags: "[hls_time=2:hls_list_size=3:hls_flags=delete_segments]",
          dash: true,
          dashFlags: "[f=dash:window_size=3:extra_window_size=5]",
          mp4: true,
          mp4Flags: "[movflags=faststart]"
        }
      ]
    }
  },
  mongodb_url: {
    url:
      "mongodb+srv://bob:bobnosue@cluster0-peipd.mongodb.net/test?retryWrites=true&w=majority"
  },
  FACEBOOK: {
    clientID: "208032163651073",
    clientSecret: "8e5d1816b28724edcac97e2ea72f00e8"
  }
};

module.exports = config;
