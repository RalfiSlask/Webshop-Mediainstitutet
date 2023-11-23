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

export const getTotalPriceWithMondayDiscount = (totalPrice: number) => {
  const currentDate = new Date();
  const currentDay = currentDate.getDay();
  const currentHour = currentDate.getHours();
  const isThereMondayDiscount = currentDay === 1 && currentHour < 10; 
  // If it is Monday before 10 am return a 10% discount on the total price
  return isThereMondayDiscount ? totalPrice * (90 / 100) : totalPrice;
};

export const getProductPriceDependingOnIfItIsWeekendOrNot = (productTotalPrice: number) => {
  const currentDate = new Date();
  const currentDay = currentDate.getDay();
  const currentHour = currentDate.getHours();
  const isItFridayAfterThreePM = currentDay >= 5 && currentHour > 15;
  const isItWeekend = currentDay === 6 || currentDay === 0;
  const isItBeforeMondayThreeAm = currentDay === 1 && currentHour < 3; 
  const isThereWeekendSurcharge = isItFridayAfterThreePM || isItBeforeMondayThreeAm || isItWeekend;
  // If it is Friday after 3 pm and before 3 am on Monday return product total price with a 15% surcharge
  return isThereWeekendSurcharge ? productTotalPrice * 1.15 : productTotalPrice;
};

export const calculateAndDisplayTotalPrice = (
  arrayOfObjects: CartObjectType[],
  totalPriceContainer: Element | null,
  shippingContainer: Element | null
) => {
  let totalPrice: number = 0;
  let shipping: number = 25;
  let totalAmountOfProductsInCart: number = 0;
  arrayOfObjects.forEach(object => {
    totalAmountOfProductsInCart += object.count;
  });
  arrayOfObjects.forEach((object) => {
    let productTotal: number = getProductPriceDependingOnIfItIsWeekendOrNot(object.price * object.count);
    if (object.count >= 10) {
      productTotal *= (90 / 100);
    };
    // if the total amount of products in the cart is over 15 remove shipping cost, else add 10% of each products total
    totalAmountOfProductsInCart > 15 ? shipping = 0 : shipping += productTotal / 10;
    totalPrice += productTotal;
  });  
  if (totalPriceContainer === null || shippingContainer === null) {
    return;
  };
  shippingContainer.textContent = `Shipping: ${shipping.toFixed(0)}`
  totalPriceContainer.textContent = `$ ${getTotalPriceWithMondayDiscount(totalPrice).toFixed(0)}`;
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
  input?.setAttribute(attribute, `${state}`);
};
