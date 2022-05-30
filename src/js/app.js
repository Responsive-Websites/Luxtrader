//import * as flsFunctions from "./modules/functions.js";
//flsFunctions.thisTest();

let user_icon = document.querySelector('.user-header__icon');
user_icon.addEventListener('click', function (e) {
  let user_menu = document.querySelector('.user-header__menu');
  user_menu.classList.toggle('_active');
});
