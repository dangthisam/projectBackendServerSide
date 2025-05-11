const Customer = require("../models/customer");
const aqp = require("api-query-params");
const createrCustomerSerViece = async (customerData) => {
  try {
    let result = await Customer.create({
      name: customerData.name,
      phone: customerData.phone,
      address: customerData.address,
      image: customerData.image,
      description: customerData.description,
    });
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};
const createArrCuss = async (arr) => {
  try {
    let result = await Customer.insertMany(arr);
    return result;
  } catch (error) {
    console.log("err", error);
    return null;
  }
};

const getCustomers = async (limit, page, name, queryString) => {
  try {
    let customer = null;
    if (limit && page) {
      let offset = (page - 1) * limit;

      const { filter } = aqp(queryString);
      delete filter.page;
      console.log(">>>>check filter", filter);
      customer = Customer.find(filter).skip(offset).limit(limit).exec();
    } else {
      customer = Customer.find({});
    }
    return customer;
  } catch (error) {
    console.log(">>>>>error", error);
    return null;
  }
};

const updateCus = async (id, name, phone, address) => {
  try {
    let result = await Customer.updateOne(
      { _id: id },
      { name: name, phone: phone, address: address }
    );
    return result;
  } catch (error) {
    console.log(">>>error", error);
    return null;
  }
};
const deleteCus = async (id) => {
  try {
    let result = await Customer.deleteById({ _id: id });
    return result;
  } catch (error) {
    console.log(">>>>error", error);
    return null;
  }
};

const deleleManyCuss = async (arr) => {
  try {
    let result = await Customer.delete({ _id: { $in: arr } });
    return result;
  } catch (error) {
    console.log(">>>error", error);
    return null;
  }
};

module.exports = {
  createrCustomerSerViece,
  createArrCuss,
  getCustomers,
  updateCus,
  deleteCus,
  deleleManyCuss,
};
