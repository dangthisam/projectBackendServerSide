

// xử lý xóa sản phẩm
const buttonDelete = document.querySelectorAll("[button-delete]");
if(buttonDelete.length > 0){
   const formDelete = document.querySelector("#form-delete-roles");
   const path = formDelete.getAttribute("data-path");
   buttonDelete.forEach(button => {
        button.addEventListener("click", (e)=>{
            e.preventDefault();
            const isCOnfirm = confirm("Bạn có chắc chắn muốn xóa vai trò này không?");
            if (isCOnfirm){
                const id=button.getAttribute("data-id");
                const action = `${path}/${id}?_method=DELETE`;
                formDelete.action = action;
                formDelete.submit();
            } 
            
        });
    });
}