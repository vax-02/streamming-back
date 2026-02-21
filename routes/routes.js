const auth = require("../middlewares/auth");
const express = require("express");
const router = express.Router();
const UsersController = require("../controllers/UsersController");
const TransmissionController = require("../controllers/TransmissionController");
const ChatController = require("../controllers/ChatController");
const GroupController = require("../controllers/GroupController");
const SettingsController = require("../controllers/SettingsController");
const MessageController = require("../controllers/MessageController");

//login
router.post("/login", UsersController.login);
//logout
router.put("/logout", UsersController.logout);

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
  UsersController.userLockUnlock,
);

//friends
router.get("/friends", auth.verificatoken, UsersController.userFriends);
router.delete("/friend/:id", auth.verificatoken, UsersController.deleteFriend);
router.get("/requests", auth.verificatoken, UsersController.userRequests);
router.post(
  "/requests/accept",
  auth.verificatoken,
  UsersController.acceptRequests,
);
router.post("/requests/deny", auth.verificatoken, UsersController.denyFriend);
router.get("/new-friends", auth.verificatoken, UsersController.newFriends);
router.post(
  "/send-request/:id",
  auth.verificatoken,
  UsersController.sendRequest,
);
router.get("/myRequests", auth.verificatoken, UsersController.myRequests);

//transmissions
router.get(
  "/transmissions",
  auth.verificatoken,
  TransmissionController.getTransmissions, //furutas
);

router.get(
  "/pastTransmissions",
  auth.verificatoken,
  TransmissionController.getPastTransmissions, //pasadas
);

router.get(
  "/publicTransmissions",
  auth.verificatoken,
  TransmissionController.getPublicTransmissions, //publicas
);

router.post(
  "/transmissions",
  auth.verificatoken,
  TransmissionController.createTransmissions,
);
router.delete(
  "/transmissions/:id",
  auth.verificatoken,
  TransmissionController.deleteTransmissions,
);
router.get(
  "/transmissions/:id",
  auth.verificatoken,
  TransmissionController.getTransmission,
);
router.put(
  "/transmissions/:id/status",
  auth.verificatoken,
  TransmissionController.updateStatus,
);
router.put(
  "/transmissions/:id",
  auth.verificatoken,
  TransmissionController.updateTransmission,
);

router.put(
  "/transmissions/link/:id",
  auth.verificatoken,
  TransmissionController.updateLink,
);

router.get(
  "/transmissionGroups",
  auth.verificatoken,
  TransmissionController.getTransmissionGroups,
);

//chats
router.get("/chats", auth.verificatoken, ChatController.getChats);
router.get("/rooms", auth.verificatoken, ChatController.getRooms);
router.get("/listNewChat", auth.verificatoken, ChatController.listNewChat);
router.post("/chat/:id", auth.verificatoken, ChatController.createChat);
//router.delete("/chat", auth.verificatoken, ChatController.deleteChat);

//Messages
router.post(
  "/messages/bulk",
  auth.verificatoken,
  MessageController.sendBulkMessages,
);
//Multi messages
router.post("/messages/share", auth.verificatoken, MessageController.share);
//Groups
router.get("/groups", auth.verificatoken, GroupController.getGroups);
router.get("/roomsGroups", auth.verificatoken, GroupController.getRoomsGroups);
router.post("/group", auth.verificatoken, GroupController.createGroup);
router.delete("/group/:id", auth.verificatoken, GroupController.deleteGroup);
//editar grupo
router.put("/group/:id", auth.verificatoken, GroupController.editGroup);

router.get("/all-groups", auth.verificatoken, GroupController.getAllGroups);
router.get(
  "/group-details/:id",
  auth.verificatoken,
  GroupController.getGroupDetails,
);

//expulsar miembro - abandonar grupo
router.delete(
  "/group/:idGroup/member/:id",
  auth.verificatoken,
  GroupController.deleteMember,
);

//poner/quitar a alguien como admin
router.put(
  "/group/:idGroup/member/:id",
  auth.verificatoken,
  GroupController.newAdmin,
);

//agregar miembro
router.post(
  "/group/:idGroup/member/:id",
  auth.verificatoken,
  GroupController.addMember,
);
//bloquear sms de grupo

//PERFIL
router.put("/settings", auth.verificatoken, SettingsController.updateSettings); //photo and name
router.get(
  "/settings/privacity-notifi",
  auth.verificatoken,
  SettingsController.getPrivacityNotify,
);
router.put(
  "/settings/privacity-notifi",
  auth.verificatoken,
  SettingsController.updatePrivacityNotify,
);
router.put(
  "/settings/password",
  auth.verificatoken,
  SettingsController.updatePassword,
);

//reportes
router.get(
  "/report/user/active",
  auth.verificatoken,
  UsersController.activeUsersReport,
);
router.get(
  "/report/transmision/active",
  auth.verificatoken,
  TransmissionController.activeTransmision,
);
router.get(
  "/report/messages",
  auth.verificatoken,
  MessageController.messagesToday,
);
router.get(
  "/report/groups/active",
  auth.verificatoken,
  GroupController.activeGroupsReport,
);

router.get(
  "/report/messages/hourly",
  auth.verificatoken,
  MessageController.hourlyMessagesReport,
);

module.exports = router;
