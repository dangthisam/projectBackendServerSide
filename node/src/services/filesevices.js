const path = require("path");
const fs = require("fs");
const uploadFile = async (fileObject) => {
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  //sampleFile = req.files.sampleFile;
  let uploadPath = path.resolve(__dirname, "../public/img/upload");
  // Use the mv() method to place the file somewhere on your server
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  let extName = path.extname(fileObject.name);
  let baseName = path.basename(fileObject.name, extName);
  let finalName = `${baseName}-${Date.now()}${extName}`;
  let finalPath = `${uploadPath}/${finalName}`;
  try {
    await fileObject.mv(finalPath);

    return {
      status: "success",
      path: finalName,
      error: null,
    };
  } catch (error) {
    console.log("__dirname", __dirname);
    console.log("check err :", error);
    return {
      status: "failed",
      path: null,
      error: JSON.stringify(error),
    };
  }
  
  
};
const uploadMutipleFile = async (fileObjects) => {
  let uploadPath = path.resolve(__dirname, "../public/img/upload");

  // Kiểm tra thư mục tồn tại, nếu không thì tạo mới
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  let uploadedFiles = [];

  // Nếu chỉ có một file, biến fileObjects sẽ không phải là một mảng
  if (!Array.isArray(fileObjects)) {
    fileObjects = [fileObjects];
  }

  // Lặp qua từng file để xử lý upload
  for (let file of fileObjects) {
    let extName = path.extname(file.name);
    let baseName = path.basename(file.name, extName);
    let finalName = `${baseName}-${Date.now()}${extName}`;
    let finalPath = `${uploadPath}/${finalName}`;

    try {
      await file.mv(finalPath);
      uploadedFiles.push({ status: "success", path: finalName, error: null });
    } catch (error) {
      console.log("Error uploading file:", error);
      uploadedFiles.push({
        status: "failed",
        path: null,
        error: JSON.stringify(error),
      });
    }
  }

  return uploadedFiles;
};
module.exports = {
  uploadFile,
  uploadMutipleFile,
};
