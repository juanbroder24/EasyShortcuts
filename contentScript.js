let customLinks = {
  link1: { url: 'https://www.example1.com', text: 'Custom 1' },
  link2: { url: 'https://www.example2.com', text: 'Custom 2' }
};

function createRadialMenu() {
  const menuHTML = `
    <div class="circular-menu">
      <div class="circular-menu__content">
        <div class="content__page" style="--angle: 0;">
          <a href="${customLinks.link1.url}" class="">${customLinks.link1.text}</a>
        </div>
        <div class="content__page" style="--angle: 45;">
          <a href="${customLinks.link2.url}" class="">${customLinks.link2.text}</a>
        </div>
        <div class="content__page" style="--angle: 90;">
          <a href="https://www.google.com/" class="">Google</a>
        </div>
        <div class="content__page" style="--angle: 135;">
          <a href="https://www.facebook.com/" class="">Facebook</a>
        </div>
        <div class="content__page" style="--angle: 180;">
          <a href="https://www.twitter.com/" class="">Twitter</a>
        </div>
        <div class="content__page" style="--angle: 225;">
          <a href="https://www.linkedin.com/" class="">LinkedIn</a>
        </div>
        <div class="content__page" style="--angle: 270;">
          <a href="https://www.github.com/" class="">GitHub</a>
        </div>
        <div class="content__page" style="--angle: 315;">
          <a href="https://www.youtube.com/" class="">YouTube</a>
        </div>
      </div>
      <div class="circular-menu__menu-button"></div>
    </div>
  `;

  const menuContainer = document.createElement('div');
  menuContainer.innerHTML = menuHTML;
  document.body.appendChild(menuContainer.firstElementChild);

  const menu = document.querySelector('.circular-menu');
  const MenuButton = menu.querySelector('.circular-menu__menu-button');
  const MenuContent = menu.querySelector('.circular-menu__content');

  MenuButton.addEventListener('mouseenter', () => MenuContent.classList.add('visible'));
  menu.addEventListener('mouseleave', () => MenuContent.classList.remove('visible'));

  return menu;
}

let radialMenu;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getMousePosition") {
    sendResponse({ x: window.mouseX, y: window.mouseY });
  } else if (message.action === "toggleRadialMenu") {
    if (!radialMenu) {
      radialMenu = createRadialMenu();
    }
    radialMenu.style.left = `${message.position.x}px`;
    radialMenu.style.top = `${message.position.y}px`;
    radialMenu.classList.toggle('open');
  } else if (message.action === "updateCustomLinks") {
    customLinks = {
      link1: message.customLinks.customLink1,
      link2: message.customLinks.customLink2
    };
    if (radialMenu) {
      document.body.removeChild(radialMenu);
    }
    radialMenu = createRadialMenu();
  }
});

document.addEventListener('mousemove', (e) => {
  window.mouseX = e.clientX;
  window.mouseY = e.clientY;
});

// Solicitar los enlaces personalizados al cargar la página
chrome.runtime.sendMessage({ action: "getCustomLinks" });