const users = [];
const messages = [];

const addUser = ({ socketid, chatUser, room }) => {
  let findIndex = users.findIndex(
    user => user.room === room && user.userId === chatUser.userId
  );

  if (!chatUser || !room) return { error: "Username and room are required." };

  if (findIndex !== -1) {
    const user = { ...chatUser, socketid: socketid };
    users[findIndex] = user;

    console.log("User updated in the user array with new socket id", user);

    return { user };
  }

  const user = { ...chatUser, socketid: socketid, room: room };
  console.log("New user added,", user);

  users.push(user);
  console.log("User added to the user array", users);

  return { user };
};

const removeUser = id => {
  const index = users.findIndex(user => user.socketid === id);

  if (index !== -1) return users.splice(index, 1)[0];
};

const getUser = id => users.find(user => user.socketid === id);

const getUsersInRoom = room => users.filter(user => user.room === room);

// messages functions
const addMsgRoom = room => {
  // room = room.trim().toLowerCase();
  if (!room) return { err: "room are required." };
  // const existingRoom = messages.find(message => message.room === room);
  let findIndex = messages.findIndex(message => message.room === room);

  if (findIndex !== -1) {
    const room_msg = messages[findIndex];

    console.log("return the messages array for the room", room_msg);

    return { room_msg };
  }

  const room_msg = { room, msgs: [] };

  messages.push(room_msg);
  console.log("Room messages added to the user array", messages);

  return { room_msg };
};

const removeMsgRoom = room => {
  const index = messages.findIndex(message => message.room === room);

  if (index !== -1) {
    const room_msg = messages.splice(index, 1)[0];
    return { room_msg };
  } else return { error: "cannot remove the message room" };
};

const addMessage = ({ room, msg }) => {
  console.log("Message to be added to array", msg);
  let findIndex = messages.findIndex(message => message.room === room);

  if (findIndex !== -1) {
    messages[findIndex].msgs.push(msg);

    console.log("Messages added to the user array", messages);
  } else return { error: "cannot add message to the array" };
};
const getMsgRoom = room => {
  let findIndex = messages.findIndex(message => message.room === room);

  if (findIndex !== -1) {
    const room_msg = messages[findIndex];

    console.log("return the messages array for the room", room_msg);

    return { room_msg };
  } else return { error: "cannot get message room for " + room };
};
module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  addMsgRoom,
  addMessage,
  getMsgRoom,
  removeMsgRoom
};
