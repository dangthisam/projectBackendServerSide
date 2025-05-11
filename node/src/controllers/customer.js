const { uploadMutipleFile } = require("../services/filesevices");
const {
  createrCustomerSerViece,
  createArrCuss,
  getCustomers,
  updateCus,
  deleteCus,
  deleleManyCuss,
} = require("../services/customerServieces");

// liabrary validate data
const Joi = require("joi");
const postCustomer = async (req, res) => {
  let { name, phone, address, description } = req.body;

  const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    phone: Joi.String().pattern(new RegExp("^[0-9]{8,11}$")),

    address: Joi.string().required(),

    //repeat_password: Joi.ref("password"),

    //access_token: [Joi.string(), Joi.number()],

    // birth_year: Joi.number().integer().min(1900).max(2013),

    description: Joi.string(),
  });

  schema.validate(req.body);
  console.log(">>>name", name, description);
  // name: String,
  // phone: String,
  // address: String,
  // image: String,
  // description: String,

  if (!req.files || Object.keys(req.files).length === 0) {
    // res.status(400).send("No files were uploaded.");
    // return;
  } else {
    let result = await uploadMutipleFile(req.files.image);
    console.log(">>result ", result);

    imgUrl = result[0].path;
    console.log(imgUrl);
    console.log("file", req.files.image);
  }
  let customerData = {
    name,
    phone,
    address,
    image: imgUrl,
    description,
  };
  let user = await createrCustomerSerViece(customerData);

  return res.status(200).json({
    EC: 0,
    data: user,
  });
};

const createArrCus = async (req, res) => {
  let customer = await createArrCuss(req.body.customer);
  return res.status(200).json({
    EC: 0,
    data: customer,
  });
};

const getCustomer = async (req, res) => {
  console.log(req.query);
  let limit = req.query.limit;
  let page = req.query.page;
  let name = req.query.name;
  let result = null;
  if (limit && page) {
    result = await getCustomers(limit, page, name, req.query);
  } else result = await getCustomers();
  return res.status(200).json({
    EC: 0,
    data: result,
  });
};

const updateCuss = async (req, res) => {
  let { id, name, phone, address } = req.body;
  let result = await updateCus(id, name, phone, address);
  return res.status(200).json({
    EC: 0,
    data: result,
  });
};

const deleteCuss = async (req, res) => {
  let { id } = req.body;
  let result = await deleteCus(id);
  return res.status(200).json({
    EC: 0,
    data: result,
  });
};
const deleteManyCus = async (req, res) => {
  let id = req.body.customerID;
  console.log(id);
  let result = await deleleManyCuss(id);
  return res.status(200).json({
    EC: 0,
    data: result,
  });
};
module.exports = {
  postCustomer,
  createArrCus,
  getCustomer,
  updateCuss,
  deleteCuss,
  deleteManyCus,
};
