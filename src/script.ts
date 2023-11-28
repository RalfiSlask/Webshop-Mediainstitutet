import productData from './json/data.json';
import type { ProductType, CartObjectType } from './assets/utils/types';
import {
  removeCheckmarksFromButtons,
  sortByProperty,
  initialTheme,
  // display
  calculateAndDisplayTotalPrice,
  displayNumberOfProductsOnCartLogo,
  displayMondayDiscountText,
  // toggle
  toggleMenuStateOnClick,
  toggleInputContainersVisibility,
  toggleVisibilityOfCheckboxes,
  toggleSidebarVisibility,
  toggleSidebarVisibilityOnKeyDown,
  toggleCategoryContainer,
  toggleCheckboxVisibility,
  toggleMenu,
  toggleClassOnClick,
  toggleClassOnEnter,
  toggleCartClassesBasedOnNumberOfProducts,
  toggleTheme,
  // booleans
  isItLucia,
  isItChristmasEve,
  // getters
  getRandomOrderNumberAsString,
  getCurrentDateAsString,
  getDeliveryTimeAsString,
  getCategoryText,
  getPriceText,
  getObjectPropertyByText,
  getCartObject,
  // setters
  setInputAttribute
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
const discountContainer = document.querySelector('#discount_container');
const listContainer = document.querySelector('#list_container'); // products container for holding the list of products
const cartContainer = document.querySelector('#cart_container'); // cart container for holding the list of products
const totalPriceContainer = document.querySelector('#total_price');
const emptyCartContainer = document.querySelector('#empty_cart');
const checkoutContainer = document.querySelector('#checkout_container');
const paymentInputsContainer = document.querySelector('#payment_inputs');
const invoiceInput = document.querySelector('#invoice_input');
const cardInput = document.querySelector('#card_input');
const shippingContainer = document.querySelector('#shipping_confirm');

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
  { type: 'text', regEx: textOnlyRegx, text: 'Can´t contain numbers' },
  { type: 'address', regEx: addressRegex, text: 'Must be valid address' },
  { type: 'number', regEx: numberOnlyRegex, text: 'Must consist of numbers' },
  { type: 'mail', regEx: emailRegex, text: 'Must be a valid email' },
  { type: 'tel', regEx: telephoneRegex, text: 'Must be a valid number' },
  { type: 'social', regEx: socialSecurityRegex, text: 'Must be a valid SSN' }
];

const currentThemes = [
  'main-theme',
  'secondary-theme',
  'main-button',
  'secondary-button',
  'border-color',
  'input',
  'navtext',
  'icon-hover',
  'main-text',
  'main-Heading'
];

let productArrayOfObjects = productData;
let cartArrayOfObjects: CartObjectType[] = [];
let isCheckoutOpen = false;

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
          src="assets/icons/${index < rating ? 'star-checked' : 'star'}.svg"
          width="20"
          height="20"
          alt="star icon"
        />`;
  }).join('');

  productContainer.innerHTML = `
    <div class="flex-column gap-4 p-4 h-[120px] border-b border-color">
      <h2 class="text-[1.5rem]">${name}</h2>
      <p class="font-bold">$${price}</p>
    </div>
  <div class="product w-full flex-center h-[400px] md:h-[500px] xl:h-[400px] relative overflow-y-hidden">
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
      class="w-full h-[90%] xl:h-[85%] object-cover top-0 absolute"
    />
    <div
      class="w-full translate-y-[250px] h-[250px] transition-transform ease-in duration-300 bg-light-Main dark:bg-dark-Footer border-t border-color opacity-95 absolute z-5 bottom-0"
      id="product_info"
    >
      <div class="col-span-2 flex-column px-3">
        <div class="flex-column">
          <div
            class="border-b border-color py-4 flex-between"
          >
            <h3 class="font-bold">Species</h3>
            <p>${species}</p>
          </div>
          <div
            class="border-b border-color py-4 flex-between"
          >
            <h3 class="font-bold">Category</h3>
            <p>${category}</p>
          </div>
          <div
            class="border-b border-color py-4 flex-column gap-2 justify-between"
          >
            <h3 class="font-bold">Description</h3>
            <p>
              ${alt}
            </p>
          </div>
        </div>
      </div>
    </div>
    <button
    class="text-[1.75rem] h-16 flex-center main-button cursor-pointer absolute bottom-0 w-full add_cart_button"
    id="add_cart_button-${id}"
  >
    Add to cart
  </button>
  </div>
  <div class="flex-column gap-2 px-3 py-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center" aria-description="Rated ${rating} out of 5">
        ${starsHtml}
      </div>
      <p>(${reviews} reviews)</p>
    </div>
    <div class="flex-between">
      <p class="text-green-700 w-[50%]">In store online (${online}+)</p>
      <p class="max-w-[100px]">In store in ${shop} shop(s)</p>
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
      'col-span-4 md:col-span-3 xl:col-span-3 flex-column w-full h-[900px] md:h-[700px] xl:h-[600px] secondary-theme border border-color rounded-md'.split(
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
        'flex-between w-full border-y border-color gap-2 px-3 py-2 grid grid-cols-8 main-theme'.split(
          ' '
        );
      tailwindClasses.forEach((className) => {
        cartPanel.classList.add(className);
      });
      cartPanel.id = `cart_panel-${product.id}`;
      const { id, name, price, cart, count, alt } = product;
      cartPanel.innerHTML = `
      <div class="flex items-center gap-4 col-span-5 ">
        <div class="relative bg-gray-200 h-[100px] w-[100px] rounded-md">
          <img src=${cart} width="100" height="100" alt=${alt} class="absolute rounded-md h-full w-full object-cover">
        </div>

        <div class="flex-column gap-2">
          <h3 class="text-[1.25rem] font-bold">${name}</h3>
          <p>$${price}</p>
        </div>
      </div>
      <div class="cart_wrapper flex gap-4 items-center col-span-3" id="${id}">
        <div class="cart-button h-12 w-[120px] flex-center px-3 rounded-sm">
          <button class="text-[1.25rem] cursor-pointer hover:text-light-Main hover:dark:text-dark-Main w-[30px]" id="minus_button">-</button>
          <p class="font-bold">${count}</p>
          <button class="text-[1.25rem] cursor-pointer hover:text-light-Main hover:dark:text-dark-Main w-[30px]" id="plus_button">+</button>
        </div>
          <button class="font-semibold hover:font-bold cursor-pointer">Remove</button>
      </div>
      `;
      cartContainer?.append(cartPanel);
    });
  } else {
    if (cartContainer === null) return;
    cartContainer.innerHTML = '';
  }
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

const addToCartProcess = (target: HTMLElement) => {
  if (isCheckoutOpen) {
    return;
  }
  const cartButton = target.closest('.add_cart_button');
  if (cartButton === null) {
    return;
  }
  const id = Number(cartButton.id.replace('add_cart_button-', ''));
  const product = productData.find((product) => product.id === id);
  addProductToCart(product);
};

const handleKeyPressOnAddToCartButton = (e: Event) => {
  const keyboardEvent = e as KeyboardEvent;
  if (keyboardEvent.key === 'Enter' || keyboardEvent.key === '') {
    const target = keyboardEvent.target as HTMLElement;
    if (target === null) {
      return;
    }
    addToCartProcess(target);
  }
};

const handleClickOnAddToCartButton = (e: Event) => {
  // if the checkout is open exit the function so the user cant add more products
  const target = e.target as HTMLElement;
  if (target === null) {
    return;
  }
  addToCartProcess(target);
};

const addProductToCart = (product: ProductType | undefined) => {
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
    } else {
      handleclickOnRemove(clickedId);
    }
  }
};

const changeThemeAndDisplayCheckout = (
  checkoutContainer: Element | null,
  cartModal: Element | null,
  checkoutButton: HTMLElement
) => {
  const orderButton = checkoutButton.nextElementSibling;
  const cartHeading = cartModal?.firstElementChild?.children[0];
  const cartIcon = cartModal?.firstElementChild?.children[1];
  const mondayDiscountContainer = document.querySelector('#monday_discount');
  if (cartHeading !== undefined && checkoutButton !== null) {
    mondayDiscountContainer?.classList.add('hide');
    checkoutContainer?.classList.add('open-checkout');
    checkoutContainer?.classList.remove('hide');
    // change from main to secondary theme
    cartModal?.classList.add('main-theme');
    cartModal?.classList.remove('secondary-theme');
    cartContainer?.classList.add('hide');
    orderButton?.classList.remove('hide');
    // remove ability to close the checkout
    cartIcon?.classList.add('hide');
    // change text in heading to checkout
    cartHeading.textContent = 'Checkout';
  }
};

const initializeFormTimer = (maxCount: number) => {
  let count = 0;
  return () => {
    count += 1;
    if (count > maxCount) {
      handleReset(checkoutForm);
      count = 0;
    }
  };
};

const handleClickOnCheckoutButton = (
  e: Event,
  checkoutContainer: Element | null,
  cartModal: Element | null,
  totalPriceContainer: Element | null,
  invoiceInput: Element | null
) => {
  // change isCheckoutOpen to ture to make sure the user cant add more items
  isCheckoutOpen = true;
  const currentPrice = Number(
    totalPriceContainer?.textContent?.replace('$ ', '')
  );
  // invoice option is unavailable if price is over 800
  if (currentPrice > 800) {
    invoiceInput?.classList.add('hide');
  } else {
    invoiceInput?.classList.remove('hide');
  }
  // Interval to reset form and make the user know they are lazy
  const fifteenMinutesInSeconds = 15 * 60;
  const updateTimer = initializeFormTimer(fifteenMinutesInSeconds);
  setInterval(updateTimer, 1000);

  const checkoutButton = e.target as HTMLElement;
  changeThemeAndDisplayCheckout(checkoutContainer, cartModal, checkoutButton);
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
    discountText.classList.remove('hide');
    if (discountInput.value === 'a_damn_fine-cup_of-coffee') {
      discountText.textContent = 'Congratulations!';
      discountText.style.color = 'green';
      totalPriceContainer.textContent = '$ 0';
    } else {
      discountText.textContent = 'Wrong, try again!';
      discountText.style.color = '#EF4444';
    }
  }
};

const handleChangeOnDiscountInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const discountText = discountContainer?.querySelector(
    '#discount_text'
  ) as HTMLElement;
  if (target.tagName === 'INPUT') {
    discountText.classList.add('hide');
  }
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

const setPaymentMethodTextInConfirmation = (
  paymentContainer: Element | null,
  currentInput: Element
) => {
  if (paymentContainer !== null) {
    if (currentInput.id === 'invoice_input') {
      paymentContainer.textContent = 'Invoice';
    } else {
      paymentContainer.textContent = 'Card';
    }
  }
};

const togglePaymentInputButtons = (
  currentInput: Element,
  otherInput: Element | null
) => {
  const button = currentInput.querySelector('.input-button');
  const paymentContainer = document.querySelector('#payment_method');
  setPaymentMethodTextInConfirmation(paymentContainer, currentInput);
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
    toggleInputContainersVisibility(
      cardInputContainer,
      socialSecurityInputContainer
    );
    setInputAttribute(socialSecurityInput, 'required', true);
    changeSubmitButtonColorDependingOnFormValidity(
      isTheFormValid(),
      submitButton
    );
  } else if (cardInputClosest !== null) {
    togglePaymentInputButtons(cardInputClosest, invoiceInput);
    toggleInputContainersVisibility(
      socialSecurityInputContainer,
      cardInputContainer
    );
    setInputAttribute(socialSecurityInput, 'required', false);
    changeSubmitButtonColorDependingOnFormValidity(
      isTheFormValid(),
      submitButton
    );
  }
};

const togglePersonalDataText = (checkbox: Element) => {
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
    toggleVisibilityOfCheckboxes(checkbox);
    togglePersonalDataText(checkbox);
  }
};

const displayErrorTextIfTestFails = (
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

const proceedAndSetupConfirmation = (cartContainer: Element | null) => {
  const dateContainer = document.querySelector('#date');
  const orderContainer = document.querySelector('#order_number');
  const deliverContainer = document.querySelector('#delivery_time');
  const confirmationContainer = document.querySelector(
    '#confirmation_container'
  );
  if (
    dateContainer === null ||
    orderContainer === null ||
    deliverContainer === null
  ) {
    return;
  }
  deliverContainer.textContent = getDeliveryTimeAsString();
  orderContainer.textContent = getRandomOrderNumberAsString();
  dateContainer.textContent = getCurrentDateAsString();
  confirmationContainer?.classList.remove('hide');
  cartContainer?.classList.add('hide');
};

const handleReset = (form: HTMLFormElement | null) => {
  if (form !== null) {
    form.reset();
    const allRequiredInputs = document.querySelectorAll(
      'input[required]'
    ) as NodeListOf<HTMLInputElement>;
    allRequiredInputs.forEach((input) => {
      const inputTypeObject = arrayOfInputTests.find((test) =>
        input.classList.contains(test.type)
      );
      if (inputTypeObject !== undefined) {
        handleValidityOfInputsWithRegex(input, inputTypeObject?.regEx);
      }
    });
    changeSubmitButtonColorDependingOnFormValidity(
      isTheFormValid(),
      submitButton
    );
  }
};

const handleSubmit = (form: HTMLFormElement | null) => {
  const allRequiredInputs = form?.querySelectorAll(
    'input[required]'
  ) as NodeListOf<HTMLInputElement>;
  allRequiredInputs?.forEach((input) => {
    if (input.value.trim() === '') {
      const errorText =
        input.parentElement?.parentElement?.querySelector('p[aria-live]');
      if (errorText !== undefined && errorText !== null) {
        errorText.textContent = 'Can´t be empty';
        errorText.classList.remove('hide');
      }
    } else {
      const inputTypeObject = arrayOfInputTests.find((test) =>
        input.classList.contains(test.type)
      );
      if (inputTypeObject !== undefined) {
        displayErrorTextIfTestFails(
          input,
          inputTypeObject?.regEx,
          inputTypeObject.text
        );
      }
    }
  });
  if (isTheFormValid() === true) {
    proceedAndSetupConfirmation(cartContainer);
  }
};

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

const getFilteredProductsDependingOnSelectedCategories = () => {
  const categoryText = getCategoryText(categoryButtons);
  const priceText = getPriceText(priceButtons);
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
  return productArrayOfObjects;
};

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
  removeCheckmarksFromButtons(buttons, checkbox);
  // toggling the visiblity of the checkbox and adding check class to the box clicked
  toggleCheckboxVisibility(checkbox);
  // if an any category is selected exit the function
  if (isAnyCategoriesSelected(categoryButtons, priceButtons)) {
    return;
  }
  productArrayOfObjects = getFilteredProductsDependingOnSelectedCategories();
  generateList(productArrayOfObjects);
};

const handleClickOnSortButtons = (e: Event, arrayOfObjects: ProductType[]) => {
  const target = e.target as HTMLElement;
  const clickedText = target.textContent?.toLowerCase();
  if (target.tagName !== 'BUTTON') {
    return;
  }
  if (clickedText === undefined) {
    return;
  }
  let isDescending: boolean = false;
  let value: keyof ProductType = 'name';
  if (clickedText.includes('high to low')) {
    isDescending = true;
  } else if (clickedText.includes('low to high')) {
    isDescending = false;
  }
  value = getObjectPropertyByText(value, clickedText);
  const sortedArray = sortByProperty(value, isDescending, [...arrayOfObjects]);
  generateList(sortedArray);
};

const addMouseToCartIfItIsLucia = () => {
  if (isItLucia()) {
    const mouseObject = {
      id: 19,
      name: 'Lucia Mouse',
      price: 0,
      count: 0,
      cart: './src/assets/images/mouse.webp',
      alt: 'A funny little mouse that likes to celebrate Lucia and Christmas'
    };
    cartArrayOfObjects.push(mouseObject);
    generateProductsInCartAsHTML(cartArrayOfObjects, cartContainer);
  }
};

const changeThemesOnChristmasEve = (currentThemes: string[]) => {
  if (isItChristmasEve()) {
    currentThemes.forEach((themeClass) => {
      const themes = document.querySelectorAll(`.${themeClass}`);
      themes.forEach((theme) => {
        theme.classList.remove(`${themeClass}`);
        theme.classList.add(`christmas-${themeClass}`);
      });
    });
  }
};

/* Initial Function Calls */

const initialFunctionCalls = () => {
  addMouseToCartIfItIsLucia();
  displayMondayDiscountText();
  initialTheme(doesUserPreferDark, root, storedTheme);
  generateList(productData);
  changeThemesOnChristmasEve(currentThemes);
};

/* Event Listeners */

// INTIAL

document.addEventListener('DOMContentLoaded', initialFunctionCalls);

// SORTING

sortModal?.addEventListener('click', (e) => {
  handleClickOnSortButtons(e, productArrayOfObjects);
});
sortButton?.addEventListener('click', () => {
  toggleClassOnClick(sortModal, 'hidden');
});
sortButton?.addEventListener('keydown', (e) => {
  toggleClassOnEnter(e, sortModal, 'hidden');
});

// MENU

menu?.addEventListener('click', (e) => {
  toggleMenuStateOnClick(e, menuButton, menu);
});
menuButton?.addEventListener('click', (e) => {
  toggleMenu(e, menuButton, menu);
});

// FILTER

filterModal?.addEventListener('click', toggleCategoryContainer);
filterModal?.addEventListener('click', filterByCategories);
filterButtonOpen?.addEventListener('click', () => {
  toggleSidebarVisibility('open-sidebar', filterModal, cartContainer, true);
});
filterButtonOpen?.addEventListener('keydown', (e) => {
  toggleSidebarVisibilityOnKeyDown(
    e,
    'open-sidebar',
    filterModal,
    cartContainer,
    true
  );
});
filterButtonClose?.addEventListener('click', () => {
  toggleSidebarVisibility('open-sidebar', filterModal, cartContainer, false);
});
filterButtonClose?.addEventListener('keydown', (e) => {
  toggleSidebarVisibilityOnKeyDown(
    e,
    'open-sidebar',
    filterModal,
    cartContainer,
    false
  );
});

// THEME

darkmodeButton?.addEventListener('click', () => {
  toggleTheme(root);
});

// PRODUCT

listContainer?.addEventListener('mouseover', handleMouseEnterOnAddToCart); // mouse over cart button
listContainer?.addEventListener('mouseout', handleMouseLeaveOnProductContainer); // mouse leaving product container
listContainer?.addEventListener('click', handleClickOnAddToCartButton); // clicking on cart button
listContainer?.addEventListener('keydown', handleKeyPressOnAddToCartButton); // pressing Enter on cart button

// CART

addToCartButton?.addEventListener('click', () => {
  toggleSidebarVisibility('open-sidebar', cartModal, cartContainer, true);
  toggleCartClassesBasedOnNumberOfProducts(
    cartArrayOfObjects,
    emptyCartContainer,
    cartContainer,
    checkoutButton
  );
});
closeCartButton?.addEventListener('click', () => {
  toggleSidebarVisibility('open-sidebar', cartModal, cartContainer, false);
});
closeCartButton?.addEventListener('keydown', (e) => {
  toggleSidebarVisibilityOnKeyDown(
    e,
    'open-sidebar',
    cartModal,
    cartContainer,
    false
  );
});
cartContainer?.addEventListener('click', handleClickableItemsOnProducts); // pressing remove, plus and minus buttons

// CHECKOUT

checkoutForm.addEventListener('input', handleChangeOnCheckoutInputs); // handle changes when user types in form inputs
checkoutContainer?.addEventListener('click', clickingOnCheckBoxes);
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
submitButton?.addEventListener('click', () => {
  handleSubmit(checkoutForm);
});
paymentInputsContainer?.addEventListener('click', (e) => {
  togglePaymentMethod(e, invoiceInput, cardInput);
});
discountContainer?.addEventListener('input', handleChangeOnDiscountInput);
