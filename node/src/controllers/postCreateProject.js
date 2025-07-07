const {
  createProject,
  getProject,
  addTask,
  getDataTask,
  updateDataTask,
  deleteDataTask,
  // deleteTask,
} = require("../services/postCreateProject");

const postCrateProject = async (req, res) => {
  let result = await createProject(req.body);
  return res.status(200).json({
    EC: 0,
    data: result,
  });
};

const createTask = async (req, res) => {
  let result = await addTask(req.body);
  return res.status(200).json({
    EC: 0,
    data: result,
  });
};

//fetch data Task

const getTask = async (req, res) => {

  let result = await getDataTask(req.query);
  return res.status(200).json({
    EC: 0,
    data: result,
  });
};

// update data Task

const updateTask = async (req, res) => {
  let result = await updateDataTask(req.body);
  return res.status(200).json({
    EC: 0,
    data: result,
  });
};

//delete Task
const deleteTask = async (req, res) => {
  let id = req.body.id;
  let result = await deleteDataTask(id);
  return res.status(200).json({
    EC: 0,
    data: result,
  });
};
const getAllProject = async (req, res) => {

  let result = await getProject(req.query);
  return res.status(200).json({
    EC: 0,
    data: result,
  });
};

module.exports = {
  postCrateProject,
  getAllProject,
  createTask,
  getTask,
  updateTask,
  deleteTask,
};
