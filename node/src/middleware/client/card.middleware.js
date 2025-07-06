

const Card = require("../../models/card.model");

module.exports.cardId=async (req, res, next) => {

    if (!req.cookies.cardId){
        const card=new Card();
        await card.save();
        const time =365*24*60*60*1000;
        res.cookie("cardId", card.id , {
            httpOnly: true,
            maxAge:time
        });
    }else{
     

        const cardId=await Card.findById(req.cookies.cardId);
        totalQuantity=0
        arrayProducts=cardId.products;
        for (let i = 0; i < arrayProducts.length; i++) {
            const element = arrayProducts[i];
            totalQuantity+=element.quantity;
        }
        res.locals.totalQuantity=totalQuantity;
            
            
   
    }
    next();

}