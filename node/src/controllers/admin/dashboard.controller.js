


const admin=(req, res)=>{
    res.render('admin/pages/dashboard/index.pug', {
        title:"Sản phẩm nổi bật",
        titles:"Sản phẩm mới"
    });
}

module.exports=admin