const express = require("express");
const {
 getTasks,
 createTask,
 getTaskById,
 updateTask,
 deleteTask,
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
router.use(protect); // every task route needs login
router.route("/").get(getTasks).post(createTask);
router.route("/:id").get(getTaskById).put(updateTask).delete(deleteTask);
module.exports = router;

