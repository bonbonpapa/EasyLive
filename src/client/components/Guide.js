import React from "react";

export default function Guide(props) {
  return (
    <div className="container mt-5">
      <h4>How to Stream</h4>
      <hr className="my-4" />

      <div className="col-12">
        <div className="row">
          <p>
            You can use{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://obsproject.com/"
            >
              OBS
            </a>{" "}
            or
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.xsplit.com/"
            >
              XSplit
            </a>{" "}
            to Live stream. If you're using OBS, go to Settings > Stream and
            select Custom from service dropdown. Enter
            <b>rtmp://127.0.0.1:1935/live</b> in server input field. Also, add
            your stream key. Click apply to save.
          </p>
        </div>
      </div>
    </div>
  );
}
