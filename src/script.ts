/**
 * Import productData x
 * Setup Selectors x
 * Get darkmode button as selector x
 * Add Event Listener x
 * Create startTheme function and use localStorage and user preferences x
 * Create SwitchTheme function and toggle Theme based on if root contains dark, set LocalStorage x
 * Create a function for generating the products x
 * Click Event for opening Sort Modal x
 * Click Event for Menu x
 * Change Menu Button on Click x
 * Click Event for opening Filter Modal x
 * Add to Cart functionality x
 * Calculate Total Price x
 * Handle Remove and Plus Minus functionality in cart x
 * Function/s for sorting the products x
 * Function/s for filtering products based on price interval and category
 * Animation for Menu
 */

import productData from './json/data.json';
import type { ProductType, CartObjectType } from './assets/utils/types';
import {
  hideAllCheckmarks,
  toggleMenu,
  sortByProperty
} from './assets/utils/helperfunctions';

let productArrayOfObjects = productData;

/* Selectors */

// Containers
const root = document.documentElement;
const body = document.body;
const listContainer = document.querySelector('#list_container'); // products container for holding the list of products
const cartContainer = document.querySelector('#cart_container'); // cart container for holding the list of products
const totalPriceContainer = document.querySelector('#total_price');
// Buttons
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
// Modals
const filterModal = document.querySelector('#filter_modal');
const sortModal = document.querySelector('#sort_modal');
const menu = document.querySelector('#menu');
const cartModal = document.querySelector('#cart_modal');
// Local Storage
const storedTheme = localStorage.getItem('theme');
// Other
const lightbox = document.querySelector('#lightbox');
const userDark = window.matchMedia('(prefers-color-scheme: dark').matches; // user theme preferences

let cartArrayOfObjects: CartObjectType[] = [];

const openSidebar = (animationClass: string, modal: Element | null) => {
  modal?.classList.add(animationClass);
  // adding scroll functionality for body and cart-container
  cartContainer?.classList.add('scroll');
  body.classList.add('no-scroll');
  modal?.classList.add('flex');
  lightbox?.classList.remove('hidden');
};

const closeSidebar = (animationClass: string, modal: Element | null) => {
  modal?.classList.remove(animationClass);
  body.classList.remove('no-scroll');
  cartContainer?.classList.remove('scroll');
  modal?.classList.remove('flex');
  lightbox?.classList.add('hidden');
};

const startTheme = () => {
  userDark ? root.classList.add('dark') : root.classList.remove('dark');
  if (storedTheme === null) return;
  storedTheme === 'dark'
    ? root.classList.add('dark')
    : root.classList.remove('dark');
};

const switchTheme = () => {
  const isDarkModeOn = document.documentElement.classList.contains('dark');
  const root = document.documentElement;
  root.classList.toggle('dark', !isDarkModeOn);
  // setting the theme in the localStorage
  localStorage.setItem('theme', isDarkModeOn ? 'light' : 'dark');
};

const handleClickOnSortPanel = () => {
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
          src="./src/assets/icons/${
            index < rating ? 'star-checked' : 'star'
          }.svg"
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
  if (listContainer === null) return;
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
    if (productInfo !== null) {
      productInfo.classList.remove('open-product-info');
    }
  }
};

const toggleCategoryContainer = (e: Event) => {
  const target = e.target as HTMLElement;
  const categorySwitcher = target.closest('.category_switcher');
  if (categorySwitcher === null) return;
  categorySwitcher.nextElementSibling?.classList.toggle('close-categories');
  // toggle rotation on arrow
  categorySwitcher.children[1].classList.toggle('rotate');
  if (categorySwitcher.parentElement === null) return;
  // fix this animation not done
  categorySwitcher.parentElement.classList.toggle('closed');
};

const displayNumberOfProductsOnCartLogo = (
  button: Element | null,
  numberOfProducts: number
) => {
  if (button === null) return;
  if (numberOfProducts > 0) {
    button.classList.remove('hidden');
    button.classList.add('flex');
    button.textContent = numberOfProducts.toString();
  } else {
    button.classList.add('hidden');
    button.classList.remove('flex');
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
        'flex justify-between items-center border-y border-light-border dark:border-dark-border gap-2 px-3 py-2 grid grid-cols-8'.split(
          ' '
        );
      tailwindClasses.forEach((className) => {
        cartPanel.classList.add(className);
      });
      cartPanel.id = `cart_panel-${product.id}`;
      const { id, name, price, cart, count, alt } = product;
      cartPanel.innerHTML = `
      <div class="flex items-center gap-4 col-span-5">
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

const calculateAndDisplayTotalPrice = (
  arrayOfObjects: CartObjectType[],
  totalPriceContainer: Element | null
) => {
  let totalPrice: number = 0;
  arrayOfObjects.forEach((object) => {
    const productTotal: number = object.price * object.count;
    totalPrice += productTotal;
  });
  if (totalPriceContainer === null) return;
  totalPriceContainer.textContent = `$ ${totalPrice.toString()}`;
};

const handleClickOnAddToCartButton = (e: Event) => {
  const target = e.target as HTMLElement;
  if (target === null) return;
  const cartButton = target.closest('.add_cart_button');
  if (cartButton === null) return;
  const id = Number(cartButton.id[cartButton.id.length - 1]);
  // locates the product in the productData that matches the id of the product clicked
  const product = productData.find((product) => product.id === id);
  if (product === undefined) return;
  // creates new object with key-value pairs i want from the productData
  const cartProduct = getCartObject(product);
  // checking if product exist in the cart already
  const doesObjectExistInArray = cartArrayOfObjects.some(
    (object) => object.id === cartProduct.id
  );
  if (!doesObjectExistInArray) {
    cartArrayOfObjects.push(cartProduct);
  }
  calculateAndDisplayTotalPrice(cartArrayOfObjects, totalPriceContainer);
  displayNumberOfProductsOnCartLogo(
    cartDisplayButton,
    cartArrayOfObjects.length
  );
  generateProductsInCartAsHTML(cartArrayOfObjects, cartContainer);
};

const handleclickOnRemove = (clickedId: number) => {
  cartArrayOfObjects = cartArrayOfObjects.filter(
    (product) => product.id !== clickedId
  );
  calculateAndDisplayTotalPrice(cartArrayOfObjects, totalPriceContainer);
  displayNumberOfProductsOnCartLogo(
    cartDisplayButton,
    cartArrayOfObjects.length
  );
  generateProductsInCartAsHTML(cartArrayOfObjects, cartContainer);
};

const handleclickOnPlusSign = (product: CartObjectType) => {
  if (product.count > 0) {
    product.count += 1;
    calculateAndDisplayTotalPrice(cartArrayOfObjects, totalPriceContainer);
    generateProductsInCartAsHTML(cartArrayOfObjects, cartContainer);
  }
};

const handleClickOnMinusSign = (product: CartObjectType) => {
  if (product.count > 1) {
    product.count -= 1;
    calculateAndDisplayTotalPrice(cartArrayOfObjects, totalPriceContainer);
    generateProductsInCartAsHTML(cartArrayOfObjects, cartContainer);
  }
};

const handleClickableItemsOnProducts = (e: Event) => {
  const target = e.target as HTMLElement;
  if (target === null) return;
  const wrapper = target.closest('.cart_wrapper');
  if (wrapper === null) return;
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

// CONTINUE HERE STILL NOT DONE!!!

// Måste se till så att båda filtren gäller / förenkla funktioner för att förhindra upprepningar

const filterByCategories = (e: Event) => {
  const target = e.target as HTMLElement;
  const checkbox = target.closest('.checkbox');
  if (checkbox === null) return;
  // which of the filter list is the clicked checkbox in
  const doesCategoryContainCheckbox = Array.from(categoryButtons).includes(checkbox);
  /* const doesPriceContainCheckbox = Array.from(priceButtons).includes(checkbox); */
  // looping through and removing all checkboxes before adding a checkbox so that only one can be checked at a time
  const buttons = doesCategoryContainCheckbox
    ? categoryButtons
    : priceButtons;
  hideAllCheckmarks(buttons, checkbox);

  // toggling the visiblity of the checkbox and adding check class to the box clicked
  const image = checkbox.firstElementChild;
  if (image === null) return;
  image.classList.toggle('hidden');
  checkbox.classList.toggle('checked');

  const isAnyCategoryChecked = Array.from(categoryButtons).some(button => button.classList.contains('checked'));
  const isAnyPriceChecked = Array.from(priceButtons).some(button => button.classList.contains('checked'));
  const noneChecked = !isAnyCategoryChecked && !isAnyPriceChecked; // if both are empty
  if (noneChecked) {
    productArrayOfObjects = productData;
    generateList(productData);
    // exiting the function with the original list of products when both lists are empty
    return;
  };

  const selectedCheckboxInCategories = Array.from(categoryButtons).find(button => button.classList.contains('checked'));
  const selectedCheckboxInPriceInterval = Array.from(priceButtons).find(button => button.classList.contains('checked'));

  const categoryText = selectedCheckboxInCategories?.nextElementSibling?.textContent ?? '';
  const priceText = selectedCheckboxInPriceInterval?.nextElementSibling?.textContent ?? '';
  // eslint wanted to explicitly check for not empty string
  const category: string | null = categoryText !== '' ? categoryText.toLowerCase() : null;
  console.log(category)
  // converting to an array of numbers for checking against the price of the products
  const price: number[] | null = priceText !== '' ? priceText.split('-').map(Number) : null;

  productArrayOfObjects = productData.filter((product) => {
    const doesProductMatchCategory = !category || product.category.toLowerCase() === category;
    const doesProductMatchPriceInterval = !price || (product.price >= price[0] && product.price <= price[1]);
    return doesProductMatchCategory && doesProductMatchPriceInterval;
  })

  generateList(productArrayOfObjects);
};

const handleClickOnSortButtons = (e: Event, arrayOfObjects: ProductType[]) => {
  const target = e.target as HTMLElement;
  const clickedText = target.textContent?.toLowerCase();
  if (target.tagName !== 'LI') return;
  if (clickedText === undefined) return;
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

/* Function Calls */

startTheme();
generateList(productData);

/* Event Listeners */

listContainer?.addEventListener('mouseover', handleMouseEnterOnAddToCart); // event delegation for mouse over cart button
listContainer?.addEventListener('mouseout', handleMouseLeaveOnProductContainer); // event delegation for mouse leaving product container
listContainer?.addEventListener('click', handleClickOnAddToCartButton); // event delegation for clicking on cart button
cartContainer?.addEventListener('click', handleClickableItemsOnProducts); // event delegation for pressing remove, plus and minus
filterModal?.addEventListener('click', toggleCategoryContainer); // event delegation
filterModal?.addEventListener('click', filterByCategories);
sortModal?.addEventListener('click', (e) => {
  handleClickOnSortButtons(e, productArrayOfObjects);
});
menuButton?.addEventListener('click', (e) => {
  toggleMenu(e, menuButton, menu);
});
filterButtonOpen?.addEventListener('click', () => {
  openSidebar('open-sidebar', filterModal);
});
filterButtonClose?.addEventListener('click', () => {
  closeSidebar('open-sidebar', filterModal);
});
addToCartButton?.addEventListener('click', () => {
  openSidebar('open-sidebar', cartModal);
});
closeCartButton?.addEventListener('click', () => {
  closeSidebar('open-sidebar', cartModal);
});
darkmodeButton?.addEventListener('click', switchTheme);
sortButton?.addEventListener('click', handleClickOnSortPanel);

