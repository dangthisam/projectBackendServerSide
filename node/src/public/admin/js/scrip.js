const statusButtons = document.querySelectorAll('[button-status]');
    statusButtons.forEach(button => {
        button.addEventListener('click', () => {
            statusButtons.forEach(btn => btn.classList.remove('active'));
            // Thêm class active vào nút được nhấn
            button.classList.add('active');
            // Lấy giá trị button-status
            const status = button.getAttribute('button-status');

            // Cập nhật URL
            const url = new URL(window.location.href);
            if (status) {
                url.searchParams.set('status', status);
            } else {
                url.searchParams.delete('status');
            }
            window.location.href = url.href;
        });
    });



    // Form search 

    const formSearch =document.querySelector("#form-search");
    if(formSearch){
        let url = new URL(window.location.href);
        formSearch.addEventListener("submit", (e)=>{
            e.preventDefault();
            

            const keyword =e.target.elements.keyword.value;
            if(keyword){
                url.searchParams.set("keyword", keyword);
            }else{
                url.searchParams.delete("keyword");
            }

            // xet 1 query moi tren url 
            window.location.href = url.href;
        });
    }


    // khi click vao trang nao thi hien so trang len url 
    

    // Xử lý phân trang
    const buttonPagination = document.querySelectorAll('[button-pagination]');
    console.log(buttonPagination); 
   if(buttonPagination){
    buttonPagination.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();

             // lấy ra số trang khi người dùng click vào 
            const page = button.getAttribute('button-pagination');
            const url = new URL(window.location.href);
            if (page) {
                url.searchParams.set('page', page);
            } else {
                url.searchParams.delete('page');
            }
            window.location.href = url.href;
        });
    });
   }

//xu ly checkbox
const checkboxMulti = document.querySelector("[multiTable]");
if( checkboxMulti){
    const checkAll= checkboxMulti.querySelector("input[name='check-all']");
    console.log(checkAll);
    const checkboxs = checkboxMulti.querySelectorAll("input[name='id']");
    console.log(checkboxs);
   checkAll.addEventListener("click", ()=>{
       if(checkAll.checked){
        checkboxs.forEach(checkbox=>{
            checkbox.checked = true;
        });
       } else {
           checkboxs.forEach(checkbox=>{
               checkbox.checked = false;
           });
       }
    }
)  

    checkboxs.forEach(checkbox=>{
        checkbox.addEventListener("click", ()=>{
           const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked");
           const countCheckbox = checkboxs.length;
           if(countChecked.length === countCheckbox){
            checkAll.checked = true;
        }
           else {
            checkAll.checked = false;
           }
        });
    });

    // xử lý form submit
    

}


// xử lý form submit
const formChangeMulite = document.querySelector("[form-change-multi]");
if(formChangeMulite){
    
    formChangeMulite.addEventListener("submit", (e)=>{
        e.preventDefault();
        const checkboxMulti = document.querySelector("[multiTable]");
        console.log("dang thuy")
        const checkboxes = checkboxMulti.querySelectorAll("input[name='id']:checked");
     console.log("dai la:",checkboxes.length);
        const typeChange=e.target.elements.type.value;

        console.log(typeChange);
        if(typeChange === "delete-all"){
            const isConfirm = confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?");
            if(!isConfirm){
                return;
            }
        }

        
       if(checkboxes.length>0){
        const inputIds = formChangeMulite.querySelector("input[name='ids']");
        console.log(inputIds);
         let ids = [];
         checkboxes.forEach(checkbox => {
            const id = checkbox.getAttribute("value");
            console.log(id);
            console.log("ok")
 
            if(typeChange === "update-position"){
                const position=checkbox
                .closest("tr")
                .querySelector("input[name='position']").value;
                console.log(position);
                ids.push(`${id}-${position}`);
            }else{
                ids.push(id);
            }
         
         });
      
           inputIds.value = ids.join(",");
           formChangeMulite.submit();   
       }else{
        alert("Bạn chưa chọn sản phẩm nào để thực hiện thao tác này!");
       }
      

    });

}
 

// xử lý xóa sản phẩm
const buttonDelete = document.querySelectorAll("[button-delete]");
if(buttonDelete.length > 0){
   const formDelete = document.querySelector("#form-delete-product");
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

//show alert
const alert = document.querySelector("[show-alert]");
const closeAlert = document.querySelector("[close-alert]");
if(closeAlert){
    const time = alert.getAttribute("data-time");
    alert.style.transition = "all 0.3s ease-in-out";
    closeAlert.addEventListener("click", ()=>{
        alert.remove();
    });
    if(alert){
        setTimeout(()=>{
            alert.remove();
        }, time);
    }
}


// xử lý upload ảnh
const uploadImage = document.querySelector("[data-upload-image]");

console.log(uploadImage);
if (uploadImage) {
    const uploadImageInput = uploadImage.querySelector("[data-upload-image-input]");
    const uploadImagePreview = uploadImage.querySelector("[data-upload-image-preview]");
    uploadImageInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            uploadImagePreview.src = URL.createObjectURL(file);
        }
    });
}
// xử lý xóa ảnh khi người dùng click vào nút xóa ảnh
const buttonDeleteImage = document.querySelector("[data-upload-image-remove]");

if (buttonDeleteImage) {
    buttonDeleteImage.addEventListener("click", () => {
        const uploadImagePreview = uploadImage.querySelector("[data-upload-image-preview]");
        uploadImagePreview.src = "";
        const uploadImageInput = uploadImage.querySelector("[data-upload-image-input]");
        uploadImageInput.value = "";
       
    });
}


//sort


const sortElements = document.querySelectorAll("[sort]");
if (sortElements.length > 0) {
    sortElements.forEach(sort => {
        const sortSelect = sort.querySelector("[sort-select]");
        const sortClear = sort.querySelector("[sort-clear]");

        if (sortSelect) {
            sortSelect.addEventListener("change", (e) => {
                const value = e.target.value;
                if (value) {
                    const [sortKey, sortValue] = value.split("-");
                    const url = new URL(window.location.href);
                    url.searchParams.set("sortKey", sortKey);
                    url.searchParams.set("sortValue", sortValue);
                    window.location.href = url.href;
                }
            });
        }

        if (sortClear) {
            sortClear.addEventListener("click", () => {
                const url = new URL(window.location.href);
                url.searchParams.delete("sortKey");
                url.searchParams.delete("sortValue");
                window.location.href = url.href;
            });
        }
    });
    const url = new URL(window.location.href);
    const sortKey = url.searchParams.get("sortKey");
    const sortValue = url.searchParams.get("sortValue");
    if (sortKey && sortValue) {
        const stringSort = `${sortKey}-${sortValue}`;
        sortElements.forEach(sort => {
            const sortSelect = sort.querySelector("[sort-select]");
            if (sortSelect) {
                const optionSelect = sortSelect.querySelector(`option[value='${stringSort}']`);
                if (optionSelect) {
                    optionSelect.selected = true;
                }
            }
        });
    }

}

//end sort


