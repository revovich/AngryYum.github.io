function menuToggler() {
  const elButton = document.querySelector('.menu-btn');
  const elMenu = document.querySelector('.wrap');
  
  const state = {
  	isOpen: false
  };
  
  function openMenu() {
    elButton.classList.add('menu-btn_active');
    elMenu.classList.add('wrap_active');
  };
  
  function closeMenu() {
    elButton.classList.remove('menu-btn_active');
    elMenu.classList.remove('wrap_active');
  };
  
  function toggleMenu() {
    (state.isOpen = !state.isOpen) ? openMenu() : closeMenu();
  };
  
  function init() {
    state.isOpen ? openMenu() : closeMenu();
  };
  
  init();
  
  return toggleMenu;
}

document.querySelector('.menu-btn').addEventListener('click', menuToggler())