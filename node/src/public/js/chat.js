
 import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'
const formChat = document.querySelector(".inner-form");
if (formChat) {
  formChat.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = e.target.elements.content.value;
    if (content) {
      socket.emit("CLIENT_SEND_MESSAGE", content);
      e.target.elements.content.value = "";
    }
  });
}

socket.on("SERVER_RETURN_MESSAGE", (data) => {
  const myId = document.querySelector("[my-id]").getAttribute("my-id");
  const body = document.querySelector(".chat .inner-body");

  const div = document.createElement("div");
  let htmlFullName = "";

  if (myId == data.userId) {
    div.classList.add("inner-outgoing");
  } else {
    htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
    div.classList.add("inner-incoming");
  }
  div.innerHTML = `${htmlFullName}
<div class="inner-content">${data.content}</div>
`;

  body.appendChild(div);
   body.scrollTop = bodyScroll.scrollHeight;

});


 const bodyScroll = document.querySelector(".chat .inner-body");
if(bodyScroll){
  bodyScroll.scrollTop = bodyScroll.scrollHeight;

}

// hiển thị  emoji-picker
const button = document.querySelector('.emoji-picker')
console.log(button);
const tooltip = document.querySelector('.tooltip')
console.log(tooltip);
Popper.createPopper(button, tooltip)
button.onclick=() => {
  tooltip.classList.toggle('shown')
}


// insert emoji
const emojiPicker = document.querySelector('emoji-picker');
if(emojiPicker){
  emojiPicker.addEventListener('emoji-click', (event) => {
    const emoji = event.detail.unicode;
    const contentInput = document.querySelector('.chat .inner-form input[name="content"]');
    contentInput.value += emoji;
  });

     const contentInput = document.querySelector('.chat .inner-form input[name="content"]');
     contentInput.addEventListener("keyup", () => {
       const value = contentInput.value;
       socket.emit("CLIENT_TYPING","data");
     });

     socket.on("SERVER_TYPING" , (data) =>{
      console.log(data)
     })
}


