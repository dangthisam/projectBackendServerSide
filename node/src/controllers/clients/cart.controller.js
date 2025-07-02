
const Cart=require("../../models/card.model")
  const cardProducts=async(req,res)=>{
    const productId=req.params.idProducts // id của sản phẩm
    const quantity=req.body.quantity //số lương sản phẩm 
    const cardId=req.cookies.cardId // id của giỏ hàng 
  

    const cart=await Cart.findById(cardId)

    const exitsProductinCard=cart.products.find(item=>item.product_id==productId)
    if(exitsProductinCard){
        await Cart.updateOne({
            _id:cardId,
            "products.product_id":productId
        },{
            $inc:{"products.$.quantity":quantity} // tăng số lượng sản phẩm lên         
        })

    }else{
const objectCart ={
        product_id:productId,
        quantity:quantity

    }
// chỉ update bản 1 key ở trong bản ghi chứ không phải că bản ghi
    await Cart.updateOne({
        _id:cardId
    },{
        $push:{
            products:objectCart
        }
    })

    }

    

   req.flash("success","Thêm vào giỏ hàng thành công")
    res.redirect("back")


  }



module.exports={cardProducts};