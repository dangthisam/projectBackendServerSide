
const Cart=require("../../models/card.model")
const Product=require("../../models/products")
const productHelp=require("../../helps/products")

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


  const cartProducts= async (req,res)=>{

     const cartId=req.cookies.cardId;
     const cart=await Cart.findById(cartId);
   if(cart.products.length>0){

     for (const item of cart.products) {
        productsId=item.product_id;
        const productInfo=await Product.findOne({
            _id:productsId,
            deleted:false,
            status:"active"
        }).select("title thumbnail price slug discountPercentage")
      
        productInfo.priceNew=productHelp.priceNew(productInfo)
          item.productInfo=productInfo;
          item.totalPrice=item.productInfo.priceNew*item.quantity
          

   }
}


cart.totalPrice=cart.products.reduce((sum, item) =>  sum+item.productInfo.priceNew*item.quantity, 0)

    
    res.render("clients/pages/products/cart.pug",{
       title:"Giỏ hàng",
       cartDetail:cart
    })
  }


module.exports={cardProducts, cartProducts};