import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import io from "socket.io-client";

import Messages from "../Messages/Messages";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";

import "./Chat.css";

let socket;

const Chat = ({ cuser, croom, isOwner }) => {
  // const user = useSelector(state => state.user);

  let lgin = useSelector(state => state.loggedIn);
  let msgs = useSelector(state => state.msgs);
  const room_msg = msgs.find(msg => msg.room === croom);

  const dispatch = useDispatch();

  const [chatUser, setChatUser] = useState(cuser || null);
  const [created, setCreated] = useState(false);
  const [room, setRoom] = useState(croom || "");
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(room_msg ? room_msg.msgs : []);
  // const [roomDesc, setRoomDesc] = useState(
  //   livesell ? livesell.description : "Live Description"
  // );
  const ENDPOINT = "localhost:4000";

  useEffect(() => {
    socket = io(ENDPOINT);

    // setChatUser(cuser);
    // setRoom(croom);
    console.log("chatuser in Chat", chatUser);
    console.log("Room in Chat", room);

    if (lgin) {
      if (!room_msg && isOwner) {
        socket.emit("create", { chatUser, room }, error => {
          if (error) {
            alert(error);
          }
        });
        // setCreated(true);
        dispatch({ type: "create-room", room: room });
      } else {
        socket.emit("join", { chatUser, room }, error => {
          if (error) {
            alert(error);
          }
        });
      }
      socket.on("msgs", ({ msgs }) => {
        setMessages(msgs);
        dispatch({ type: "set-messages", room: room, content: msgs });
      });
      socket.on("message", message => {
        setMessages(messages => [...messages, message]);
        dispatch({ type: "add-message", room: room, content: message });
      });

      socket.on("roomData", ({ users }) => {
        setUsers(users);
      });
    }

    return () => {
      socket.emit("disconnect");
      socket.disconnect();
    };
  }, [chatUser, room]);

  useEffect(() => {
    setMessages(msgs);
    setChatUser(cuser);
    setRoom(croom);
    setCreated(false);
  }, [croom]);

  const sendMessage = event => {
    event.preventDefault();

    if (lgin) {
      if (message) {
        socket.emit("sendMessage", message, () => setMessage(""));
      }
    } else {
      alert("Need to login before send the messages!");
    }
  };

  return (
    <div className="chat-container">
      <InfoBar roomDesc={room} />
      <Messages messages={messages} name={chatUser && chatUser.username} />
      {lgin ? (
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      ) : (
        <button>you need login to send message</button>
      )}
    </div>
  );
};

export default Chat;
