import type { ProductType, CartObjectType } from './types';

export const hideAllCheckmarks = (
  buttons: NodeListOf<Element>,
  checkbox: Element | null
) => {
  buttons.forEach((button) => {
    console.log(button);
    if (button !== checkbox) {
      button.classList.remove('checked');
      button.firstElementChild?.classList.add('hidden');
    }
  });
};

export const handleClickOnMenuLinks = (
  e: Event,
  menuButton: HTMLImageElement,
  menu: Element | null
) => {
  const target = e.target as HTMLElement;

  if (target.tagName === 'LI' || target.tagName === 'A') {
    menu?.classList.toggle('hidden');
    const isIconHamburger = menuButton.src.includes('hamburger');
    let source = menuButton.src;
    source = isIconHamburger
      ? source.replace('hamburger', 'close')
      : source.replace('close', 'hamburger');
    menuButton.src = source;
  }
};

export const toggleCartClassesBasedOnNumberOfProducts = (
  cartArrayOfObjects: CartObjectType[],
  emptyCartContainer: Element | null,
  cartContainer: Element | null,
  checkoutButton: Element | null
) => {
  const numberOfProductsInCart = cartArrayOfObjects.length;
  if (emptyCartContainer === null) {
    return;
  }; 
  if (numberOfProductsInCart === 0) {
    emptyCartContainer.classList.remove('hide');
    cartContainer?.classList.add('hide');
    checkoutButton?.classList.add('hide');
  } else {
    emptyCartContainer.classList.add('hide');
    cartContainer?.classList.remove('hide');
    checkoutButton?.classList.remove('hide');
  }
};

export const calculateAndDisplayTotalPrice = (
  arrayOfObjects: CartObjectType[],
  totalPriceContainer: Element | null
) => {
  let totalPrice: number = 0;
  arrayOfObjects.forEach((object) => {
    const productTotal: number = object.price * object.count;
    totalPrice += productTotal;
  });
  if (totalPriceContainer === null) {
    return;
  }; 
  totalPriceContainer.textContent = `$ ${totalPrice.toString()}`;
};

export const toggleMenu = (
  e: Event,
  menuButton: HTMLImageElement,
  menu: Element | null
) => {
  if (e.target === menuButton) {
    menu?.classList.toggle('hidden');
    const isIconHamburger = menuButton.src.includes('hamburger');
    let source = menuButton.src;
    source = isIconHamburger
      ? source.replace('hamburger', 'close')
      : source.replace('close', 'hamburger');
    menuButton.src = source;
  }
};

// maybe should refactor

export const sortByProperty = (
  property: keyof ProductType,
  isDescending: boolean,
  items: ProductType[]
) => {
  return items.sort((a, b) => {
    // had to set these as any to be able to bypass the strict type checking, did not know this.
    const valueA = a[property] as any;
    const valueB = b[property] as any;
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return isDescending ? valueB - valueA : valueA - valueB;
    } else if (typeof valueA === 'string' && typeof valueB === 'string') {
      const stringA = valueA.toLowerCase();
      const stringB = valueB.toLowerCase();
      if (isDescending) {
        if (stringA > stringB) {
          return -1;
        } else {
          return 1;
        }
      } else {
        if (stringA < stringB) {
          return -1;
        } else {
          return 1;
        }
      }
    }
    return 0;
  });
};

export const resetForm = (form: HTMLFormElement | null) => {
  if (form !== null) {
    form.reset();
  };
};

export const submitForm = (form: HTMLFormElement | null) => {
  if (form !== null) {
    form.submit();
  };
};

