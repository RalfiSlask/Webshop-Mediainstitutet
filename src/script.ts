import productData from './json/data.json';
import type { ProductType, CartObjectType } from './assets/utils/types';
import {
  hideAllCheckmarks,
  toggleMenu,
  sortByProperty,
  handleClickOnMenuLinks,
  calculateAndDisplayTotalPrice,
  handleReset,
  toggleCartClassesBasedOnNumberOfProducts,
  switchVisibilityOfInputs,
  setInputAttribute,
  initialTheme,
  openOrCloseSidebar,
  changeVisibilityOfCheckboxes,
  toggleCategoryContainer,
  displayNumberOfProductsOnCartLogo,
  displayMondayDiscountText,
  switchTheme
} from './assets/utils/helperfunctions';
import {
  emailRegex,
  numberOnlyRegex,
  telephoneRegex,
  textOnlyRegx,
  socialSecurityRegex,
  addressRegex
} from './assets/utils/regEx';

/* Selectors */

// Containers

const root = document.documentElement;
const checkoutForm = document.querySelector(
  '#checkout_form'
) as HTMLFormElement;
const listContainer = document.querySelector('#list_container'); // products container for holding the list of products
const cartContainer = document.querySelector('#cart_container'); // cart container for holding the list of products
const totalPriceContainer = document.querySelector('#total_price');
const emptyCartContainer = document.querySelector('#empty_cart');
const checkoutContainer = document.querySelector('#checkout_container');
const paymentInputsContainer = document.querySelector('#payment_inputs');
const invoiceInput = document.querySelector('#invoice_input');
const cardInput = document.querySelector('#card_input');
const shippingContainer = document.querySelector('#shipping');
// Buttons / ListItems
const validateButton = document.querySelector('#validate_button');
const resetButton = document.querySelector('#reset_button');
const submitButton = document.querySelector('#submit_button');
const cartDisplayButton = document.querySelector('#cart_display_button'); // button that shows how many items are in the cart
const darkmodeButton = document.querySelector('#darkmode');
const sortButton = document.querySelector('#sort_button');
const filterButtonOpen = document.querySelector('#filter_button');
const filterButtonClose = document.querySelector('#filter_close');
const closeCartButton = document.querySelector('#close_button');
const menuButton = document.querySelector('#menu_button') as HTMLImageElement;
const categoryButtons = document.querySelectorAll(
  '#category_container .checkbox'
);
const priceButtons = document.querySelectorAll('#price_list .checkbox');
const addToCartButton = document.querySelector('#cart_button');
const checkoutButton = document.querySelector('#checkout_button');
// Modals
const filterModal = document.querySelector('#filter_modal');
const sortModal = document.querySelector('#sort_modal');
const menu = document.querySelector('#menu');
const cartModal = document.querySelector('#cart_modal');
// Local Storage
const storedTheme = localStorage.getItem('theme');
// Other

const doesUserPreferDark = window.matchMedia(
  '(prefers-color-scheme: dark'
).matches; // user theme preferences

const arrayOfInputTests = [
  { type: 'text', regEx: textOnlyRegx },
  { type: 'address', regEx: addressRegex },
  { type: 'number', regEx: numberOnlyRegex },
  { type: 'mail', regEx: emailRegex },
  { type: 'tel', regEx: telephoneRegex },
  { type: 'social', regEx: socialSecurityRegex }
];

let productArrayOfObjects = productData;
let errorMessage = 'Can´t be empty';
let cartArrayOfObjects: CartObjectType[] = [];

const handleClickOnSortPanel = (sortModal: Element | null) => {
  sortModal?.classList.toggle('hidden');
};

const createListItemAsHTML = (
  product: ProductType,
  productContainer: HTMLElement
) => {
  const {
    id,
    name,
    price,
    category,
    species,
    rating,
    image,
    alt,
    reviews,
    online,
    shop
  } = product;
  // generates how the stars will look like from the rating property for each product, using the map and join method
  const starsHtml = Array.from({ length: 5 }, (_, index) => {
    return `
        <img
          src="/assets/icons/${index < rating ? 'star-checked' : 'star'}.svg"
          width="20"
          height="20"
          alt="star icon"
        />`;
  }).join('');

  productContainer.innerHTML = `
    <div class="flex flex-col gap-4 p-4 h-[120px]">
      <h2 class="text-[1.5rem]">${name}</h2>
      <p class="font-bold">$${price}</p>
    </div>
  <div class="w-full h-[700px] md:h-[500px] xl:h-[400px] relative overflow-y-hidden">
    <img
      srcset="
      ${image.tablet} 640w,
      ${image.desktop} 768w,
      ${image.mobile} 1024w
      "
      sizes="
      (max-width: 640px) 640px,
      (max-width: 768px) 768px,
      1024px
      "
      src=${image.desktop}
      width="300"
      height="300"
      alt="${alt}"
      class="w-full h-full object-cover absolute"
    />
    <div
      class="w-full translate-y-[250px] h-[250px] transition-transform ease-in duration-300 bg-light-Main dark:bg-dark-Footer border-t border-light-border dark:border-dark-border opacity-90 absolute z-5 bottom-0"
      id="product_info"
    >
      <div class="col-span-2 flex flex-col px-3">
        <div class="flex flex-col">
          <div
            class="border-b border-light-border dark:border-dark-border py-4 flex items-center justify-between"
          >
            <h3 class="font-bold">Species</h3>
            <p>${species}</p>
          </div>
          <div
            class="border-b border-light-border dark:border-dark-border py-4 flex items-center justify-between"
          >
            <h3 class="font-bold">Category</h3>
            <p>${category}</p>
          </div>
          <div
            class="border-b border-light-border dark:border-dark-border py-4 flex flex-col gap-2 justify-between"
          >
            <h3 class="font-bold">Description</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing
              elit. A, nihil iusto molestias odit voluptat.
            </p>
          </div>
        </div>
      </div>
    </div>
    <div
    class="h-16 flex justify-center items-center main-button cursor-pointer absolute bottom-0 w-full add_cart_button"
    id="add_cart_button-${id}"
  >
    <p class="text-[2rem]">Add to cart</p>
  </div>
  </div>
  <div class="flex flex-col gap-2 px-3 py-6">
    <div class="flex items-center gap-2">
      <div class="flex items-center">
        ${starsHtml}
      </div>
      <p>(${reviews} reviews)</p>
    </div>
    <div class="flex gap-3">
      <p class="text-green-700">In store online (${online}+)</p>
      <p>|</p>
      <p class="">In store in ${shop} shop(s)</p>
    </div>
  </div>
    `;
  listContainer?.append(productContainer);
};

const generateList = (productData: ProductType[]) => {
  if (listContainer === null) {
    return;
  }
  listContainer.innerHTML = '';
  productData.forEach((product) => {
    const productContainer = document.createElement('div');
    productContainer.id = 'product';
    // Making the tailwind classes into an array so i can add these to the product container
    const tailwindClasses: string[] =
      'col-span-4 md:col-span-3 xl:col-span-3 flex flex-col w-full h-[900px] md:h-[700px] xl:h-[600px] bg-light-Secondary dark:bg-dark-Secondary dark:border-dark-border rounded-sm'.split(
        ' '
      );
    tailwindClasses.forEach((className) => {
      productContainer.classList.add(className);
    });
    createListItemAsHTML(product, productContainer);
  });
};

const handleMouseEnterOnAddToCart = (e: Event) => {
  const target = e.target as HTMLElement;
  if (target.classList.contains('add_cart_button')) {
    target.classList.remove('main-button');
    target.classList.add('info-open');
    target.previousElementSibling?.classList.add('open-product-info');
  }
};

const handleMouseLeaveOnProductContainer = (e: Event) => {
  const event = e as MouseEvent;
  const target = event.target as HTMLElement;
  const relatedTarget = event.relatedTarget as HTMLElement;
  const productContainer = target.closest('#product');

  if (productContainer !== null && !productContainer.contains(relatedTarget)) {
    const productInfo = productContainer.querySelector('.open-product-info');
    const productButton = productContainer.querySelector('.add_cart_button');
    productButton?.classList.remove('info-open');
    productButton?.classList.add('main-button');

    if (productInfo !== null) {
      productInfo.classList.remove('open-product-info');
    }
  }
};

const generateProductsInCartAsHTML = (
  arrayOfObjects: CartObjectType[],
  cartContainer: Element | null
) => {
  if (arrayOfObjects.length > 0 && cartContainer !== null) {
    cartContainer.innerHTML = '';
    arrayOfObjects.forEach((product) => {
      const cartPanel = document.createElement('div');
      // Making the tailwind classes into an array so i can add these to the product container
      const tailwindClasses: string[] =
        'flex justify-between w-full items-center border-y border-light-border dark:border-dark-border gap-2 px-3 py-2 grid grid-cols-8 bg-light-Main dark:bg-dark-Main'.split(
          ' '
        );
      tailwindClasses.forEach((className) => {
        cartPanel.classList.add(className);
      });
      cartPanel.id = `cart_panel-${product.id}`;
      const { id, name, price, cart, count, alt } = product;
      cartPanel.innerHTML = `
      <div class="flex items-center gap-4 col-span-5 ">
        <img src=${cart} width="100" height="100" alt=${alt} class="rounded-md h-[100px] w-[100px] object-cover">
        <div class="flex flex-col gap-2">
          <h3 class="text-[1.25rem] font-bold">${name}</h3>
          <p>$${price}</p>
        </div>
      </div>
      <div class="cart_wrapper flex gap-4 items-center col-span-3" id="${id}">
        <div class="cart-button h-12 w-[120px] flex justify-between items-center px-3 rounded-sm">
          <button class="text-[1.25rem] cursor-pointer hover:text-light-Main hover:dark:text-dark-Main w-[30px]" id="minus_button">-</button>
          <p class="font-bold">${count}</p>
          <button class="text-[1.25rem] cursor-pointer hover:text-light-Main hover:dark:text-dark-Main w-[30px]" id="plus_button">+</button>
        </div>
          <p class="hover:font-bold cursor-pointer">Remove</p>
      </div>
      `;
      cartContainer?.append(cartPanel);
    });
  } else {
    if (cartContainer === null) return;
    cartContainer.innerHTML = '';
  }
};

const getCartObject = (product: CartObjectType) => {
  const { id, name, price, cart, count, alt } = product;
  const cartObject = {
    id,
    name,
    price,
    cart,
    count,
    alt
  };
  return cartObject;
};

const changeColorOfCheckoutButtonDependingOnTotalPrice = (
  priceContainer: Element | null,
  checkoutButton: Element | null
) => {
  const price = Number(priceContainer?.textContent?.replace('$ ', ''));
  checkoutButton?.classList.remove(
    'lowest',
    'low',
    'medium',
    'high',
    'highest'
  );
  if (price < 500) {
    checkoutButton?.classList.add('lowest');
  } else if (price < 1500) {
    checkoutButton?.classList.add('low');
  } else if (price < 5000) {
    checkoutButton?.classList.add('medium');
  } else if (price < 20000) {
    checkoutButton?.classList.add('high');
  } else {
    checkoutButton?.classList.add('highest');
  }
};

const handleClickOnAddToCartButton = (e: Event) => {
  const target = e.target as HTMLElement;
  if (target === null) {
    return;
  }
  const cartButton = target.closest('.add_cart_button');
  if (cartButton === null) {
    return;
  }
  const id = Number(cartButton.id.replace('add_cart_button-', ''));
  // locates the product in the productData that matches the id of the product clicked
  const product = productData.find((product) => product.id === id);
  if (product === undefined) {
    return;
  }
  // creates new object with key-value pairs i want from the productData
  const cartProduct = getCartObject(product);
  // checking if product exist in the cart already
  const doesObjectExistInArray = cartArrayOfObjects.some(
    (object) => object.id === cartProduct.id
  );
  if (!doesObjectExistInArray) {
    cartArrayOfObjects.push(cartProduct);
  }
  calculateAndDisplayTotalPrice(
    cartArrayOfObjects,
    totalPriceContainer,
    shippingContainer
  );
  displayNumberOfProductsOnCartLogo(
    cartDisplayButton,
    cartArrayOfObjects.length
  );
  toggleCartClassesBasedOnNumberOfProducts(
    cartArrayOfObjects,
    emptyCartContainer,
    cartContainer,
    checkoutButton
  );
  generateProductsInCartAsHTML(cartArrayOfObjects, cartContainer);
  changeColorOfCheckoutButtonDependingOnTotalPrice(
    totalPriceContainer,
    checkoutButton
  );
};

const handleclickOnRemove = (clickedId: number) => {
  cartArrayOfObjects = cartArrayOfObjects.filter(
    (product) => product.id !== clickedId
  );
  toggleCartClassesBasedOnNumberOfProducts(
    cartArrayOfObjects,
    emptyCartContainer,
    cartContainer,
    checkoutButton
  );
  calculateAndDisplayTotalPrice(
    cartArrayOfObjects,
    totalPriceContainer,
    shippingContainer
  );
  displayNumberOfProductsOnCartLogo(
    cartDisplayButton,
    cartArrayOfObjects.length
  );
  generateProductsInCartAsHTML(cartArrayOfObjects, cartContainer);
  changeColorOfCheckoutButtonDependingOnTotalPrice(
    totalPriceContainer,
    checkoutButton
  );
};

const handleclickOnPlusSign = (product: CartObjectType) => {
  if (product.count > 0) {
    product.count += 1;
    calculateAndDisplayTotalPrice(
      cartArrayOfObjects,
      totalPriceContainer,
      shippingContainer
    );
    generateProductsInCartAsHTML(cartArrayOfObjects, cartContainer);
    changeColorOfCheckoutButtonDependingOnTotalPrice(
      totalPriceContainer,
      checkoutButton
    );
  }
};

const handleClickOnMinusSign = (product: CartObjectType) => {
  if (product.count > 1) {
    product.count -= 1;
    calculateAndDisplayTotalPrice(
      cartArrayOfObjects,
      totalPriceContainer,
      shippingContainer
    );
    generateProductsInCartAsHTML(cartArrayOfObjects, cartContainer);
    changeColorOfCheckoutButtonDependingOnTotalPrice(
      totalPriceContainer,
      checkoutButton
    );
  }
};

const handleClickableItemsOnProducts = (e: Event) => {
  const target = e.target as HTMLElement;
  if (target === null) {
    return;
  }
  const wrapper = target.closest('.cart_wrapper');
  if (wrapper === null) {
    return;
  }
  const clickedId = Number(wrapper.id);
  if (target.tagName === 'BUTTON') {
    const product = cartArrayOfObjects.find(
      (product) => product.id === clickedId
    );
    if (product === undefined) return;
    if (target.id === 'plus_button') {
      handleclickOnPlusSign(product);
    } else if (target.id === 'minus_button') {
      handleClickOnMinusSign(product);
    }
  } else if (target.tagName === 'P' && target.textContent === 'Remove') {
    handleclickOnRemove(clickedId);
  }
};

/* const initializeFormTimer = (maxCount: number) => {
  let count = 0;
  return () => {
    count += 1;
    console.log(count);
    if (count > maxCount) {
      handleReset(checkoutForm);
      count = 0;
    }
  };
}; */

const handleClickOnCheckoutButton = (
  e: Event,
  checkoutContainer: Element | null,
  cartModal: Element | null,
  totalPriceContainer: Element | null,
  invoiceInput: Element | null
) => {
  const currentPrice = Number(
    totalPriceContainer?.textContent?.replace('$ ', '')
  );
  // invoice option is unavailable if price is over 800
  if (currentPrice > 800) {
    invoiceInput?.classList.add('hide');
  }
  // Interval to reset form and make the user know they are lazy
  /*  const fifteenMinutesInSeconds = 15 * 60;
  const updateTimer = initializeFormTimer(fifteenMinutesInSeconds)
  const countdownInterval = setInterval(updateTimer, 1000); */

  const checkoutButton = e.target as HTMLElement;
  const orderButton = checkoutButton.nextElementSibling;
  checkoutContainer?.classList.add('open-checkout');
  const cartHeading = cartModal?.firstElementChild?.children[0];
  const cartIcon = cartModal?.firstElementChild?.children[1];
  if (cartHeading !== undefined && checkoutButton !== null) {
    orderButton?.classList.remove('hide');
    checkoutButton.classList.add('hide');
    cartIcon?.classList.add('hide');
    cartHeading.textContent = 'Checkout';
  }
};

const handleClickOnValidateButton = (e: Event) => {
  const target = e.target as HTMLElement;
  const discountContainer = target.closest('#discount_container');
  const discountInput = discountContainer?.querySelector(
    '#discount_input'
  ) as HTMLInputElement;
  const discountText = discountContainer?.querySelector(
    '#discount_text'
  ) as HTMLElement;
  if (discountInput !== undefined && totalPriceContainer !== null) {
    if (discountInput.value === 'a_damn_fine-cup_of-coffee') {
      discountText.classList.remove('hide');
      discountText.textContent = 'Congratulations!';
      totalPriceContainer.textContent = '$ 0';
    }
  }
};
// CONTINUE HERE STILL NOT DONE!!!

// Måste se till så att båda filtren gäller / förenkla funktioner för att förhindra upprepningar

const toggleCheckboxVisibility = (checkbox: Element) => {
  const image = checkbox.firstElementChild;
  if (image === null) {
    return;
  }
  image.classList.toggle('hidden');
  checkbox.classList.toggle('checked');
  checkbox.classList.toggle('main-button');
};

const isAnyCategoriesSelected = (
  categoryButtons: NodeListOf<Element>,
  priceButtons: NodeListOf<Element>
) => {
  const isAnyCategoryChecked = Array.from(categoryButtons).some((button) =>
    button.classList.contains('checked')
  );
  const isAnyPriceChecked = Array.from(priceButtons).some((button) =>
    button.classList.contains('checked')
  );
  const noneChecked = !isAnyCategoryChecked && !isAnyPriceChecked; // if both are empty
  if (noneChecked) {
    productArrayOfObjects = productData;
    generateList(productData);
    // exiting the function with the original list of products when both lists are empty
    return true;
  }
  return false;
};

const togglePaymentInputButtons = (
  currentInput: Element,
  otherInput: Element | null
) => {
  const button = currentInput.querySelector('.input-button');
  if (button !== null && !button.classList.contains('main-button')) {
    button.classList.toggle('main-button');
    otherInput?.querySelector('.main-button')?.classList.toggle('main-button');
  }
};

const togglePaymentMethod = (
  e: Event,
  invoiceInput: Element | null,
  cardInput: Element | null
) => {
  const target = e.target as HTMLElement;
  const invoiceInputClosest = target.closest('#invoice_input');
  const cardInputClosest = target.closest('#card_input');
  const cardInputContainer = document.querySelector('#card_container');
  const socialSecurityInputContainer =
    document.querySelector('#social_container');
  const socialSecurityInput =
    socialSecurityInputContainer?.querySelector('#social');
  if (invoiceInputClosest !== null) {
    togglePaymentInputButtons(invoiceInputClosest, cardInput);
    switchVisibilityOfInputs(cardInputContainer, socialSecurityInputContainer);
    setInputAttribute(socialSecurityInput, 'required', true);
  } else if (cardInputClosest !== null) {
    togglePaymentInputButtons(cardInputClosest, invoiceInput);
    switchVisibilityOfInputs(socialSecurityInputContainer, cardInputContainer);
    setInputAttribute(socialSecurityInput, 'required', false);
  }
};

const validateInputWithRegex = (
  input: HTMLInputElement,
  regExp: RegExp,
  errorMessage: string
) => {
  const errorText = input.parentElement?.parentElement?.querySelector('p');
  if (errorText !== undefined && errorText !== null) {
    if (!regExp.test(input.value)) {
      errorText.classList.remove('hide');
      errorText.textContent = errorMessage;
      input.classList.remove('valid');
    } else {
      errorText.classList.add('hide');
      // also removing the text for screen readers
      errorText.textContent = '';
      input.classList.add('valid');
    }
  }
};

const changeTextOnPersonalData = (checkbox: Element) => {
  if (checkbox.id === 'personal') {
    const personal = checkbox.nextElementSibling;
    if (personal !== null) {
      if (checkbox.classList.contains('main-button')) {
        personal.textContent = 'Approves the processing of personal data *';
      } else {
        const personTextWithoutRequired = personal?.textContent?.replace(
          '*',
          ''
        );
        if (personTextWithoutRequired !== undefined) {
          personal.textContent = personTextWithoutRequired;
        }
      }
    }
  }
};

// Might be unneccesary, maybe have to use custom styling for checkboxes

const clickingOnCheckBoxes = (e: Event) => {
  const target = e.target as HTMLElement;
  const checkbox = target.closest('.checkbox');
  if (checkbox !== null) {
    if (checkbox.id === 'personal') {
      changeSubmitButtonColorDependingOnFormValidity(
        isTheFormValid(),
        submitButton
      );
    }
    changeVisibilityOfCheckboxes(checkbox);
    changeTextOnPersonalData(checkbox);
  }
};

checkoutContainer?.addEventListener('click', clickingOnCheckBoxes);

const handleSubmit = (e: Event, form: HTMLFormElement | null) => {
  const allRequiredInputs = form?.querySelectorAll(
    'input[required]'
  ) as NodeListOf<HTMLInputElement>;
  e.preventDefault();
  allRequiredInputs?.forEach((input) => {
    if (input.value.trim() === '') {
      const errorText =
        input.parentElement?.parentElement?.querySelector('p[aria-live]');
      if (errorText !== undefined && errorText !== null) {
        errorText.textContent = 'Can´t be empty';
        errorText.classList.remove('hide');
      }
    } else {
      if (input.classList.contains('text')) {
        console.log('text');
        errorMessage = 'Can´t contain numbers';
        validateInputWithRegex(input, textOnlyRegx, errorMessage);
      } else if (input.classList.contains('address')) {
        errorMessage = 'Must be valid address';
        validateInputWithRegex(input, addressRegex, errorMessage);
      } else if (input.classList.contains('number')) {
        errorMessage = 'Must consist of numbers';
        validateInputWithRegex(input, numberOnlyRegex, errorMessage);
      } else if (input.classList.contains('mail')) {
        errorMessage = 'Must be a valid email';
        validateInputWithRegex(input, emailRegex, errorMessage);
      } else if (input.classList.contains('tel')) {
        errorMessage = 'Must be a valid number';
        validateInputWithRegex(input, telephoneRegex, errorMessage);
      } else if (input.classList.contains('social')) {
        errorMessage = 'Must be a valid SSN';
        validateInputWithRegex(input, socialSecurityRegex, errorMessage);
      }
    }
  });
};

/* const validateInputWithRegex = (
  input: HTMLInputElement,
  regExp: RegExp,
  errorMessage: string
) => {
  const errorText = input.parentElement?.parentElement?.querySelector('p');
  if (errorText !== undefined && errorText !== null) {
    if (!regExp.test(input.value)) {
      errorText.classList.remove('hide');
      errorText.textContent = errorMessage;
      input.classList.remove('valid');
    } else {
      errorText.classList.add('hide');
      // also removing the text for screen readers
      errorText.textContent = '';
      input.classList.add('valid');
    }
  }
}; */

const handleValidityOfInputsWithRegex = (
  input: HTMLInputElement,
  regExp: RegExp
) => {
  let isInputValid = false;
  isInputValid = regExp.test(input.value);
  if (!isInputValid) {
    input.classList.add('through');
    input.classList.remove('valid');
    input.nextElementSibling?.classList.remove('hide');
  } else {
    input.classList.remove('through');
    input.classList.add('valid');
    input.nextElementSibling?.classList.add('hide');
  }
};

const changeSubmitButtonColorDependingOnFormValidity = (
  isTheFormValid: boolean | undefined,
  button: Element | null
) => {
  if (isTheFormValid === true) {
    button?.classList.add('main-button');
    button?.classList.remove('lowest');
  } else {
    button?.classList.remove('main-button');
    button?.classList.add('lowest');
  }
};

const isTheFormValid = () => {
  const allRequiredInputs = document.querySelectorAll('input[required]');
  const personalCheck = document.querySelector('#personal') as HTMLInputElement;
  const everyInputIsValid = Array.from(allRequiredInputs).every((input) =>
    input.classList.contains('valid')
  );
  if (personalCheck !== null) {
    console.log(personalCheck.checked);
    return personalCheck.checked && everyInputIsValid;
  }
};

const handleChangeOnCheckoutInputs = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target !== null) {
    const errorText =
      target.parentElement?.parentElement?.querySelector('p[aria-live]');
    if (errorText !== null) {
      errorText?.classList.add('hide');
    }
    // using an array of object where i have class types and regEx tests for those types
    const inputTypeObject = arrayOfInputTests.find((test) =>
      target.classList.contains(test.type)
    );
    if (inputTypeObject !== undefined) {
      handleValidityOfInputsWithRegex(target, inputTypeObject?.regEx);
    }
    changeSubmitButtonColorDependingOnFormValidity(
      isTheFormValid(),
      submitButton
    );
  }
};

// Borde nog refaktorera

const filterByCategories = (e: Event) => {
  const target = e.target as HTMLElement;
  const checkbox = target.closest('.checkbox');
  if (checkbox === null) {
    return;
  }
  // which of the filter list is the clicked checkbox in
  const doesCategoryContainCheckbox =
    Array.from(categoryButtons).includes(checkbox);
  // looping through and removing all checkboxes before adding a checkbox so that only one can be checked at a time
  const buttons = doesCategoryContainCheckbox ? categoryButtons : priceButtons;
  hideAllCheckmarks(buttons, checkbox);

  // toggling the visiblity of the checkbox and adding check class to the box clicked
  toggleCheckboxVisibility(checkbox);
  // if an any category is selected exit the function
  if (isAnyCategoriesSelected(categoryButtons, priceButtons)) {
    return;
  }
  const selectedCheckboxInCategories = Array.from(categoryButtons).find(
    (button) => button.classList.contains('checked')
  );
  const selectedCheckboxInPriceInterval = Array.from(priceButtons).find(
    (button) => button.classList.contains('checked')
  );
  const categoryText =
    selectedCheckboxInCategories?.nextElementSibling?.textContent ?? '';
  const priceText =
    selectedCheckboxInPriceInterval?.nextElementSibling?.textContent ?? '';
  // eslint wanted to explicitly check for not empty string
  const category: string | null =
    categoryText !== '' ? categoryText.toLowerCase() : null;
  // converting to an array of numbers for checking against the price of the products
  const price: number[] | null =
    priceText !== '' ? priceText.split('-').map(Number) : null;
  productArrayOfObjects = productData.filter((product) => {
    const doesProductMatchCategory =
      !category || product.category.toLowerCase() === category;
    const doesProductMatchPriceInterval =
      !price || (product.price >= price[0] && product.price <= price[1]);
    return doesProductMatchCategory && doesProductMatchPriceInterval;
  });

  generateList(productArrayOfObjects);
};

// EJ klar än

const handleClickOnSortButtons = (e: Event, arrayOfObjects: ProductType[]) => {
  const target = e.target as HTMLElement;
  const clickedText = target.textContent?.toLowerCase();
  if (target.tagName !== 'LI') {
    return;
  }
  if (clickedText === undefined) {
    return;
  }
  let isDescending: boolean = false;
  let value: keyof ProductType = 'name';
  if (clickedText.includes('high to low')) {
    isDescending = true;
    if (clickedText.includes('alphabet')) {
      value = 'name';
    } else if (clickedText.includes('rating')) {
      value = 'rating';
    } else if (clickedText.includes('price')) {
      value = 'price';
    }
  } else {
    value = 'category';
  }
  const sortedArray = sortByProperty(value, isDescending, [...arrayOfObjects]);
  generateList(sortedArray);
};

/* Initial Function Calls */

const initialFunctionCalls = () => {
  displayMondayDiscountText();
  initialTheme(doesUserPreferDark, root, storedTheme);
  generateList(productData);
};

/* Event Listeners */

document.addEventListener('DOMContentLoaded', initialFunctionCalls);

// Event Delegations

listContainer?.addEventListener('mouseover', handleMouseEnterOnAddToCart); // mouse over cart button
listContainer?.addEventListener('mouseout', handleMouseLeaveOnProductContainer); // mouse leaving product container
checkoutForm.addEventListener('input', handleChangeOnCheckoutInputs); // handle changes when user types in form inputs
listContainer?.addEventListener('click', handleClickOnAddToCartButton); // clicking on cart button
cartContainer?.addEventListener('click', handleClickableItemsOnProducts); // pressing remove, plus and minus buttons
filterModal?.addEventListener('click', toggleCategoryContainer);
filterModal?.addEventListener('click', filterByCategories);

sortModal?.addEventListener('click', (e) => {
  handleClickOnSortButtons(e, productArrayOfObjects);
});
menu?.addEventListener('click', (e) => {
  handleClickOnMenuLinks(e, menuButton, menu);
});

// Direct Events

menuButton?.addEventListener('click', (e) => {
  toggleMenu(e, menuButton, menu);
});
filterButtonOpen?.addEventListener('click', () => {
  openOrCloseSidebar('open-sidebar', filterModal, cartContainer, true);
});
filterButtonClose?.addEventListener('click', () => {
  openOrCloseSidebar('open-sidebar', filterModal, cartContainer, false);
});
addToCartButton?.addEventListener('click', () => {
  openOrCloseSidebar('open-sidebar', cartModal, cartContainer, true);
  toggleCartClassesBasedOnNumberOfProducts(
    cartArrayOfObjects,
    emptyCartContainer,
    cartContainer,
    checkoutButton
  );
});
closeCartButton?.addEventListener('click', () => {
  openOrCloseSidebar('open-sidebar', cartModal, cartContainer, false);
});
darkmodeButton?.addEventListener('click', () => {
  switchTheme(root);
});
sortButton?.addEventListener('click', () => {
  handleClickOnSortPanel(sortModal);
});
checkoutButton?.addEventListener('click', (e) => {
  handleClickOnCheckoutButton(
    e,
    checkoutContainer,
    cartModal,
    totalPriceContainer,
    invoiceInput
  );
});
validateButton?.addEventListener('click', handleClickOnValidateButton);
resetButton?.addEventListener('click', () => {
  handleReset(checkoutForm);
});
submitButton?.addEventListener('click', (e) => {
  handleSubmit(e, checkoutForm);
});
paymentInputsContainer?.addEventListener('click', (e) => {
  togglePaymentMethod(e, invoiceInput, cardInput);
});
