const toast = (toastify) => {
  const toastElement = document.querySelector(".zm_notify_list");
  const toast = document.createElement("li");
  const autoRemoveId = setTimeout(() => {
    toast && toastElement.removeChild(toast);
  }, [4000]);
  toast.onclick = (event) => {
    if (event.target.closest(".close_toast")) {
      toastElement.removeChild(toast);
      clearTimeout(autoRemoveId);
    }
  };
  toast.classList.add("toast_bg");
  toast.innerHTML = `<span>${toastify}</span>
    <i class="fa-solid fa-xmark close_toast"></i>
   `;
  toast.style.animation = `slideInLeft ease .3s forwards, fadeOut linear 1s 3s forwards`;
  toastElement.appendChild(toast);
};
export default toast;
