const express = require("express");
const router = express.Router();
// const {
//   getHomePage,
//   getAPI,
//   get1,
//   postUser,
//   createrpostUser,
// } = require("../controllers/homeControllers");
//const { getUserAPI } = require("../controllers/apiControllers");
// router.get("/", get1);
// router.get("/dangthuy", getAPI);
const {
  getUsersAPI,
  postUser,
  putUser,
  deleteUser,
  postFile,
} = require("../controllers/apiControllers");
const {
  postCustomer,
  createArrCus,
  getCustomer,
  updateCuss,
  deleteCuss,
  deleteManyCus,
} = require("../controllers/customer");
const project = require("../models/project");
const {
  postCrateProject,
  getAllProject,
  createTask,
  getTask,
  updateTask,
  deleteTask,
} = require("../controllers/postCreateProject");
// router.get("/creater-user", createrpostUser);
router.get("/1", (req, res) => {
  res.send("ok");
});
router.get("/User", getUsersAPI);
router.post("/User", postUser);
router.put("/User", putUser);
router.delete("/User", deleteUser);
router.post("/file", postFile);
router.post("/customer", postCustomer);
router.post("/customerMany", createArrCus);
router.get("/getCustomer", getCustomer);
router.put("/updateCustomer", updateCuss);
router.delete("/deleteCustomer", deleteCuss);
router.delete("/deleteArrCus", deleteManyCus);
router.post("/project", postCrateProject);
router.get("/project", getAllProject);
router.post("/task", createTask);
router.get("/task", getTask);
router.put("/task", updateTask);
router.delete("/task", deleteTask);

// router.get('/',(req, res)=>{
//   res.render('clients/pages/home/index.pug');
// });

// router.get("/products" ,(req, res)=>{
//   res.render("clients/pages/products/index");
// });
module.exports = router;
