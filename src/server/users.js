const users = [];
const messages = [];

const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find(
    user => user.room === room && user.name === name
  );

  if (!name || !room) return { error: "Username and room are required." };
  //  if (existingUser) return { error: "Username is taken." };

  if (existingUser) {
    let findIndex = users.findIndex(
      user => user.room === room && user.name === name
    );

    const user = { id, name, room };
    users[findIndex] = user;

    console.log("User updated in the user array", users);

    return { user };
  }

  const user = { id, name, room };

  users.push(user);
  console.log("User added to the user array", users);

  return { user };
};

const removeUser = id => {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) return users.splice(index, 1)[0];
};

const getUser = id => users.find(user => user.id === id);

const getUsersInRoom = room => users.filter(user => user.room === room);

// messages functions
const addMsgRoom = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingRoom = messages.find(message => message.room === room);

  if (!name || !room) return { error: "Username and room are required." };

  if (existingRoom) {
    let findIndex = messages.findIndex(message => message.room === room);

    const room_msg = messages[findIndex];

    console.log("return the messages array for the room", room_msg);

    return { room_msg };
  }

  const room_msg = { room, msgs: [] };

  messages.push(room_msg);
  console.log("Room messages added to the user array", messages);

  return { room_msg };
};

const addMessage = ({ room, msg }) => {
  console.log("Message to be added to array", msg);
  const existingRoom = messages.find(message => message.room === room);

  if (existingRoom) {
    let findIndex = messages.findIndex(message => message.room === room);

    messages[findIndex].msgs.push(msg);

    console.log("Messages added to the user array", messages);
  }
};
const getMsgRoom = ({ room }) => {
  const existingRoom = messages.find(message => message.room === room);

  if (!room || !existingRoom) return { error: "room are required." };

  if (existingRoom) {
    let findIndex = messages.findIndex(message => message.room === room);

    const room_msg = messages[findIndex];

    console.log("return the messages array for the room", room_msg);

    return { room_msg };
  }
};
module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  addMsgRoom,
  addMessage,
  getMsgRoom
};
