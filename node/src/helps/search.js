


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

module.exports =search;