
const inputsQuantity=document.querySelectorAll('input[name="quantity"]')
//console.log(inputsQuantity);
if(inputsQuantity.length > 0) {
inputsQuantity.forEach(input=> {
input.addEventListener("change", (e) => {
    console.log(e.target.value)
const productId = input.getAttribute("product-id");
const quantity = e.target.value

console.log(productId);
console.log(quantity);

window. location.href = `/cart/update/${productId}/${quantity}` ;
});

})

}

// Hết Cập nhật số lượng sản phẩm trong giỏ hàng