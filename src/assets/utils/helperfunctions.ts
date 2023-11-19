export const hideAllCheckmarks = (
  buttons: NodeListOf<Element>,
  checkbox: Element | null
) => {
  buttons.forEach((button) => {
    if (button.firstElementChild !== checkbox?.firstElementChild) {
      button.firstElementChild?.classList.add('hidden');
    }
  });
};

export const toggleMenu = (e: Event, menuButton: HTMLImageElement, menu: Element | null) => {
  menu?.classList.toggle('hidden');
  if (e.target === menuButton) {
    const isIconHamburger = menuButton.src.includes('hamburger');
    let source = menuButton.src;
    source = isIconHamburger
      ? source.replace('hamburger', 'close')
      : source.replace('close', 'hamburger');
    menuButton.src = source;
  }
};
