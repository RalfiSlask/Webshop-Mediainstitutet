import type { ProductType } from './types';

export const hideAllCheckmarks = (
  buttons: NodeListOf<Element>,
  checkbox: Element | null
) => {
  buttons.forEach((button) => {
    console.log(button)
    if (button !== checkbox) {
      button.classList.remove('checked');
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

// maybe should refactor

export const sortByProperty = (property: keyof ProductType, isDescending: boolean, items: ProductType[]) => {
  return items.sort((a, b) => {
    // had to set these as any to be able to bypass the strict type checking, did not know this. 
    const valueA = a[property] as any;
    const valueB = b[property] as any;
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return isDescending ? valueB - valueA : valueA - valueB
    } else if (typeof valueA === 'string' && typeof valueB === 'string') {
      const stringA = valueA.toLowerCase();
      const stringB = valueB.toLowerCase();
      if (isDescending) {
        if (stringA > stringB) {
          return -1;
        } else {
          return 1
        }
      } else {
        if (stringA < stringB) {
          return -1
        } else {
          return 1;
        }
      }
    }
    return 0; 
  })
};
