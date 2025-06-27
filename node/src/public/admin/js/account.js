// xử lý xóa sản phẩm
const buttonDelete = document.querySelectorAll("[button-delete]");
if(buttonDelete.length > 0){
   const formDelete = document.querySelector("#form-delete-account");
   const path = formDelete.getAttribute("data-path");
   buttonDelete.forEach(button => {
        button.addEventListener("click", (e)=>{
            e.preventDefault();
            const isCOnfirm = confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?");
            if (isCOnfirm){
                const id=button.getAttribute("data-id");
                const action = `${path}/${id}?_method=DELETE`;
                formDelete.action = action;
                formDelete.submit();
            } 
            
        });
    });
}


// xử lý thay đổi trạng thái sản phẩm
const buttonChangeStatus = document.querySelectorAll("[button-change-status]");
if(buttonChangeStatus.length>0){
    const formChangeStatus= document.querySelector("#form-change-status");
            const path = formChangeStatus.getAttribute("data-path");
           
    buttonChangeStatus.forEach(button=>{
        button.addEventListener("click", ()=>{
            
            const statusCurrent = button.getAttribute("data-status");
            const id = button.getAttribute("data-id");
            let statusChange =statusCurrent == "active" ? "inactive" : "active";
            console.log(statusCurrent);
            console.log(statusChange);
            console.log(id);
            const action =path+ `/${statusChange}/${id}/?_method=PATCH`;
            formChangeStatus.action = action;
            formChangeStatus.submit();
        })
    })
}   
