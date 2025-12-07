const auth = require("../middlewares/auth");
const express = require("express");
const router = express.Router();
const UsersController = require("../controllers/UsersController");
const TransmissionController = require("../controllers/TransmissionController");
const ChatController = require("../controllers/ChatController");
const GroupController = require("../controllers/GroupController");

//login
router.post("/login", UsersController.login);

// Usuarios
router.get("/users", auth.verificatoken, UsersController.users);
router.get("/user/:id", auth.verificatoken, UsersController.userById);
router.post("/user", UsersController.userCreate);
router.post("/user/newpassword", UsersController.newPassword);
router.put("/user/:id", auth.verificatoken, UsersController.userUpdate);
router.delete("/user/:id", auth.verificatoken, UsersController.userDelete);
router.get(
  "/user/lock-unlock/:id",
  auth.verificatoken,
  UsersController.userLockUnlock
);

//friends
router.get("/friends", auth.verificatoken, UsersController.userFriends);
router.delete("/friend/:id", auth.verificatoken, UsersController.deleteFriend);
router.get("/requests", auth.verificatoken, UsersController.userRequests);
router.post(
  "/requests/accept",
  auth.verificatoken,
  UsersController.acceptRequests
);
router.post("/requests/deny", auth.verificatoken, UsersController.denyFriend);
router.get("/new-friends", auth.verificatoken, UsersController.newFriends);
router.post("/send-request/:id", auth.verificatoken, UsersController.sendRequest)
router.get("/myRequests",auth.verificatoken, UsersController.myRequests)


//transmissions
router.get(
  "/transmissions",
  auth.verificatoken,
  TransmissionController.getTransmissions
);
router.post(
  "/transmissions",
  auth.verificatoken,
  TransmissionController.createTransmissions
);
router.delete(
  "/transmission/:id",
  auth.verificatoken,
  TransmissionController.deleteTransmissions
);
router.get(
  "/transmission/:id",
  auth.verificatoken,
  TransmissionController.getTransmission
);
router.put(
  "/transmission",
  auth.verificatoken,
  TransmissionController.updateTransmission
);

//chats
router.get("/chats", auth.verificatoken, ChatController.getChats);
router.get("/rooms", auth.verificatoken, ChatController.getRooms);
router.get("/listNewChat", auth.verificatoken, ChatController.listNewChat);
router.post("/chat/:id",auth.verificatoken, ChatController.createChat);
//router.delete("/chat", auth.verificatoken, ChatController.deleteChat);

//Groups
router.get("/groups", auth.verificatoken, GroupController.getGroups);
router.post("/group", auth.verificatoken, GroupController.createGroup);
router.delete("/group/:id", auth.verificatoken, GroupController.deleteGroup);

module.exports = router;
