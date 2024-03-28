const optionMenu = document.querySelector(".select-menu"), selectBtn = optionMenu.querySelector(".select-btn"),
options = optionMenu.querySelectorAll(".option"), 
text = optionMenu.querySelector(".sBtn-text");

selectBtn.addEventListener('click', () => optionMenu.classList.toggle("active"));

options.forEach(option => {
  option.addEventListener('click', () => {
    let selectedOption = option.querySelector(".option-text").innerText;

    text.value = selectedOption;
    console.log(selectedOption);
    optionMenu.classList.add("active")
  });
});

const showHiddenPass = (loginPass, loginEye) => {
  const input = document.getElementById(loginPass), iconEye = document.getElementById(loginEye);

  iconEye.addEventListener('click', () => {
    if (input.type === 'password') {
      input.type = 'text';
      iconEye.classList.add('ri-eye-line');
      iconEye.classList.remove('ri-eye-off-line');
    } else {
      input.type = 'password';
      iconEye.classList.remove('ri-eye-line');
      iconEye.classList.add('ri-eye-off-line');
    }
  });
};
showHiddenPass('login-pass', 'login-eye');

document.addEventListener('DOMContentLoaded', () => {
  optionMenu.classList.add("active");
})