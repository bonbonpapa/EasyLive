export const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://secure-scrubland-97842.herokuapp.com/"
    : "http://localhost:4000";
