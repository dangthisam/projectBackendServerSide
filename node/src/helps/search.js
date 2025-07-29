

const unidecode = require('unidecode');

const search =(query)=>{
    let objectSearch ={
        keyword:""
    }

    if (query.keyword) {
      objectSearch.keyword=query.keyword;

      // tìm kiếm không phân biệt hoa thường và chỉ cần có từ trong trang là được 
      //REGEX 
      const regex = new RegExp(objectSearch.keyword, "i");
     objectSearch.regex=regex;
  }
 return  objectSearch;
}





const toSlug=(text) => {
  if (!text || typeof text !== 'string') return ''; // hoặc xử lý khác nếu cần
  return unidecode(text)                  // Bỏ dấu/chuyển sang ký tự ASCII
    .toLowerCase()                       // Chuyển thành chữ in thường
    .trim()                             // Loại bỏ khoảng trắng đầu/cuối
    .replace(/\s+/g, '-')               // Thay khoảng trắng thành dấu gạch ngang
    .replace(/[^\w\-]+/g, '')           // Loại bỏ ký tự đặc biệt
    .replace(/\-\-+/g, '-');            // Gộp các dấu gạch ngang liên tiếp lại
}

module.exports = {
  search,
  toSlug
};
