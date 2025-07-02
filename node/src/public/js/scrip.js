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
