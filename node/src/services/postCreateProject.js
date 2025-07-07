const Project = require("../models/project");
const Task = require("../models/task");
const aqp = require("api-query-params");
var mongoose_delete = require("mongoose-delete");
const createProject = async (data) => {
  if (data.type === "EMPTY_PROJECT") {
    let result = Project.create(data);
    return result;
  }

  if (data.type === "ADD_USER") {


    let myProject = await Project.findById(data.projectID).exec();
    // myProject.userInfor.push(data.userArr);

    for (let i = 0; i < data.userArr.length; i++) {
      // check xem da co data chua
      myProject.userInfor.push(data.userArr[i]);
    }

    //console.log(">>>>>>", myProject.userInfor);
    let newProject = await myProject.save();

    return newProject;
  }

  if (data.type === "DELETE_USER") {
  

    let myProject = await Project.findById(data.projectID).exec();
    // myProject.userInfor.push(data.userArr);

    for (let i = 0; i < data.userArr.length; i++) {
      // check xem da co data chua
      myProject.userInfor.pull(data.userArr[i]);
    }

    //console.log(">>>>>>", myProject.userInfor);
    let newProject = await myProject.save();
    console.log(myProject);
    return newProject;
  }

  if (data.type === "ADD_TASK") {
    console.log(data);

    let myProject = await Project.findById(data.projectID).exec();
    // myProject.userInfor.push(data.userArr);

    for (let i = 0; i < data.Task.length; i++) {
      // check xem da co data chua
      myProject.tasks.push(data.Task[i]);
    }

    //console.log(">>>>>>", myProject.userInfor);
    let newProject = await myProject.save();
    console.log(myProject);
    return newProject;
  }
};

// create data for Task

const addTask = async (data) => {
  if (data.type === "EMPTY_TASK") {
    let result = await Task.create(data);
    return result;
  }
};

const getDataTask = async (queryString) => {
  try {
    let page = queryString.page;

    const { filter, limit, population } = aqp(queryString);

    console.log("sdjkfs", queryString);
    delete filter.page;
    console.log(population);
    console.log(">>>>check filter", filter);
    // console.log(limit);

    let offset = (page - 1) * limit;
    task = await Task.findById("67a775fb6aee2cc291998bcd")
      .skip(offset)
      .limit(limit)
      .populate("tasks")
      .exec();
    console.log("lllllllll", task);
    return task;
  } catch (error) {
    console.log(">>>>>error", error);
    return null;
  }
};

// update data Task

const updateDataTask = async (data) => {
  let result = await Task.updateOne({ _id: data.id }, { ...data });
  return result;
};

///delete Task

const deleteDataTask = async (id) => {
  try {
    let result = await Task.deleteById(id);
    return result;
  } catch (error) {
    console.log(">>>>error", error);
    return null;
  }
};
const getProject = async (queryString) => {
  try {
    let page = queryString.page;

    const { filter, limit, population } = aqp(queryString);

    console.log("sdjkfs", queryString);
    delete filter.page;
    console.log(population);
    console.log(">>>>check filter", filter);
    // console.log(limit);

    let offset = (page - 1) * limit;
    let project = await Project.find(filter)
      .skip(offset)
      .limit(limit)
      .populate(population)
      .exec();

    return project;
  } catch (error) {
    console.log(">>>>>error", error);
    return null;
  }
};
module.exports = {
  createProject,
  getProject,
  addTask,
  getDataTask,
  updateDataTask,
  deleteDataTask,
};
