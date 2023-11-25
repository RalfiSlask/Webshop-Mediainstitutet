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

export const getMilitaryTimeAsStringWithAddedMinutes = (currentDate: Date, addedMinutes: number) => {
  currentDate.setMinutes(currentDate.getMinutes() + addedMinutes);
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${formattedMinutes}`;
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
  }
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

export const getRandomOrderNumberAsString = () => {
  let firstFour = '';
  for (let i = 0; i < 4; i++) {
    const randomNumber = Math.floor(Math.random() * 9)
    firstFour += randomNumber;
  };
  let lastEight = '';
  for (let i = 0; i < 8; i++) {
    const randomNumber = Math.floor(Math.random() * 9)
    lastEight += randomNumber;
  };
  return `${firstFour}-${lastEight}`;
};

export const getCurrentDateAsString = () => {
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.toLocaleString('en-Us', { month: 'long' });
  const currentYear = currentDate.getFullYear();
  return `${currentDay} ${currentMonth} ${currentYear}`;
};

export const getTotalPriceWithMondayDiscount = (totalPrice: number) => {
  const currentDate = new Date();
  const currentDay = currentDate.getDay();
  const currentHour = currentDate.getHours();
  const isThereMondayDiscount = currentDay === 1 && currentHour < 10;
  // If it is Monday before 10 am return a 10% discount on the total price
  return isThereMondayDiscount ? totalPrice * (90 / 100) : totalPrice;
};

export const getProductPriceDependingOnIfItIsWeekendOrNot = (
  productTotalPrice: number
) => {
  const currentDate = new Date();
  const currentDay = currentDate.getDay();
  const currentHour = currentDate.getHours();
  const isItFridayAfterThreePM = currentDay >= 5 && currentHour > 15;
  const isItWeekend = currentDay === 6 || currentDay === 0;
  const isItBeforeMondayThreeAm = currentDay === 1 && currentHour < 3;
  const isThereWeekendSurcharge =
    isItFridayAfterThreePM || isItBeforeMondayThreeAm || isItWeekend;
  // If it is Friday after 3 pm and before 3 am on Monday return product total price with a 15% surcharge
  return isThereWeekendSurcharge ? productTotalPrice * 1.15 : productTotalPrice;
};

const displayPrices = (totalPriceContainer: Element | null, shippingContainer: Element | null, shipping: number, totalPrice: number, grandTotalNumber: number) => {
  const totalPriceInConfirmation = document.querySelector('#total_confirm');
  const grandTotal = document.querySelector('#grand_total');
  if (
    totalPriceContainer === null ||
    shippingContainer === null ||
    totalPriceInConfirmation === null ||
    grandTotal === null
  ) {
    return;
  }
  shippingContainer.textContent = `$ ${shipping.toFixed(0)}`;
  totalPriceContainer.textContent = `$ ${getTotalPriceWithMondayDiscount(
    totalPrice
  ).toFixed(0)}`;
  totalPriceInConfirmation.textContent = totalPriceContainer.textContent;
  grandTotal.textContent = `$ ${grandTotalNumber.toString()}`;
};

export const calculateAndDisplayTotalPrice = (
  arrayOfObjects: CartObjectType[],
  totalPriceContainer: Element | null,
  shippingContainer: Element | null
) => {
  let totalPrice: number = 0;
  let shipping: number = 25;
  let totalAmountOfProductsInCart: number = 0;
  arrayOfObjects.forEach((object) => {
    totalAmountOfProductsInCart += object.count;
  });
  arrayOfObjects.forEach((object) => {
    let productTotal: number = getProductPriceDependingOnIfItIsWeekendOrNot(
      object.price * object.count
    );
    if (object.count >= 10) {
      productTotal *= 90 / 100;
    }
    // if the total amount of products in the cart is over 15 remove shipping cost, else add 10% of each products total
    totalAmountOfProductsInCart > 15
      ? (shipping = 0)
      : (shipping += productTotal / 10);
    totalPrice += productTotal;
  });
  const grandTotal = Number((shipping + totalPrice).toFixed(0));
  displayPrices(totalPriceContainer, shippingContainer, shipping, totalPrice, grandTotal)
};

export const toggleCategoryContainer = (e: Event) => {
  const target = e.target as HTMLElement;
  const categorySwitcher = target.closest('.category_switcher');
  if (categorySwitcher === null) {
    return;
  }
  categorySwitcher.nextElementSibling?.classList.toggle('close-categories');
  // toggle rotation on arrow
  categorySwitcher.children[1].classList.toggle('rotate');
  if (categorySwitcher.parentElement === null) return;
  // fix this animation not done
  categorySwitcher.parentElement.classList.toggle('closed');
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

export const displayMondayDiscountText = () => {
  const currentDate = new Date();
  const currentDay = currentDate.getDay();
  const currentHour = currentDate.getHours();
  const isThereMondayDiscount = currentDay === 1 && currentHour < 10;
  const mondayDiscountContainer = document.querySelector('#monday_discount');
  if (isThereMondayDiscount) {
    mondayDiscountContainer?.classList.remove('hide');
  } else {
    mondayDiscountContainer?.classList.add('hide');
  }
};

export const displayNumberOfProductsOnCartLogo = (
  button: Element | null,
  numberOfProducts: number
) => {
  if (button === null) {
    return;
  }
  if (numberOfProducts > 0) {
    button.classList.remove('hidden');
    button.classList.add('flex');
    button.textContent = numberOfProducts.toString();
  } else {
    button.classList.add('hidden');
    button.classList.remove('flex');
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

export const handleReset = (form: HTMLFormElement | null) => {
  if (form !== null) {
    form.reset();
  }
};

export const switchVisibilityOfInputs = (
  inputContainerToHide: Element | null,
  inputContainerToShow: Element | null
) => {
  inputContainerToHide?.classList.add('hide');
  inputContainerToShow?.classList.remove('hide');
};

export const setInputAttribute = (
  input: Element | null | undefined,
  attribute: string,
  state: boolean
) => {
  if (state) {
    input?.setAttribute(attribute, '');
  } else {
    input?.removeAttribute(attribute);
  }
};

export const switchTheme = (root: HTMLElement) => {
  const isDarkModeOn = document.documentElement.classList.contains('dark');
  root.classList.toggle('dark', !isDarkModeOn);
  // setting the theme in the localStorage
  localStorage.setItem('theme', isDarkModeOn ? 'light' : 'dark');
};

export const initialTheme = (
  doesUserPreferDark: boolean,
  root: HTMLElement,
  storedTheme: string | null
) => {
  doesUserPreferDark
    ? root.classList.add('dark')
    : root.classList.remove('dark');
  if (storedTheme === null) {
    return;
  }
  storedTheme === 'dark'
    ? root.classList.add('dark')
    : root.classList.remove('dark');
};

export const openOrCloseSidebar = (
  animationClass: string,
  modal: Element | null,
  cartContainer: Element | null,
  isOpen: boolean
) => {
  const body = document.body;
  const lightbox = document.querySelector('#lightbox');
  if (isOpen) {
    modal?.classList.add(animationClass);
    cartContainer?.classList.add('scroll');
    body.classList.add('no-scroll');
    modal?.classList.add('flex');
    lightbox?.classList.remove('hidden');
  } else {
    modal?.classList.remove(animationClass);
    body.classList.remove('no-scroll');
    cartContainer?.classList.remove('scroll');
    modal?.classList.remove('flex');
    lightbox?.classList.add('hidden');
  }
};

export const changeVisibilityOfCheckboxes = (checkbox: Element) => {
  if (checkbox.classList.contains('main-button')) {
    checkbox.classList.remove('main-button');
  } else {
    checkbox.classList.add('main-button');
  }
};
