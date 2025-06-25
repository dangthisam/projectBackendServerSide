// start delete roles
const buttonDelete = document.querySelectorAll("[button-delete]");
if(buttonDelete.length > 0){
    const formDelete = document.querySelector("#form-delete-roles");
    const path = formDelete.getAttribute("data-path");
    buttonDelete.forEach(button => {
        button.addEventListener("click", (e)=>{
            e.preventDefault();
            const isConfirm = confirm("Bạn có chắc chắn muốn xóa vai trò này không?");
            if (isConfirm){
                const id = button.getAttribute("data-id");
                const action = `${path}/${id}?_method=DELETE`;
                formDelete.action = action;
                formDelete.submit();
            }                      
        });
    });
}
//end delete roles

const tablePermissions = document.querySelector("[table-permissions]"); // Sử dụng querySelector thay vì querySelectorAll
if(tablePermissions) {
    const buttonSubmit = document.querySelector("[button-submit]");
    
    buttonSubmit.addEventListener("click", () => {
        let permissions = [];
        const rows = tablePermissions.querySelectorAll("[data-name]");
        
        rows.forEach(row => {
            const name = row.getAttribute("data-name");
            const inputs = row.querySelectorAll("input");
            
            if(name == "id") {
                inputs.forEach(input => {
                    const id = input.value;
                    permissions.push({
                        id: id,
                        permissions: []
                    });
                });
            } else {
                inputs.forEach((input, index) => {
                    const checked = input.checked;
                    if(checked) {
                        permissions[index].permissions.push(name);
                    }         
                });
            }
        });
        
        console.log(permissions);
        
        if (permissions.length > 0) {
            const form = document.querySelector("#form-change-permissions");
            const inputPermissions = form.querySelector("input[name='permissions']");
            
            // Sửa lỗi: sử dụng inputPermissions.value thay vì form.permissions.value
            inputPermissions.value = JSON.stringify(permissions);
            form.submit();
        }
    });
}


// Permissions Data Default
const dataRecords = document.querySelector("[data-records]");
if(dataRecords) {
const records = JSON.parse(dataRecords.getAttribute("data-records"));

const tablePermissions = document.querySelector("[table-permissions]");

records.forEach((record, index) => {
const permissions = record.permissions;

permissions. forEach(permission => {
const row = tablePermissions.querySelector( `[data-name="${permission}"]` );
const input = row.querySelectorAll("input") [index];

input.checked = true;
});

});
}

// End Permissions Data Default