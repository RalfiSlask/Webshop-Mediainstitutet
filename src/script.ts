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
 * Click Event for opening Filter Modal
 * Function/s for sorting the products
 * Function/s for filtering products based on price interval and category
 * Animation for Menu
 * Add to Cart functionality
 */

import productData from './json/data.json';
import type { ProductType } from './assets/utils/types';

/* Selectors */

// Containers
const root = document.documentElement;
const listContainer = document.querySelector('#list_container'); // list for products
// Buttons
const darkmodeButton = document.querySelector('#darkmode');
const sortButton = document.querySelector('#sort_button');
const filterButtonOpen = document.querySelector('#filter_button');
const filterButtonClose = document.querySelector('#filter_close');
const checkoutButton = document.querySelector('#checkout_button');
const menuButton = document.querySelector('#menu_button') as HTMLImageElement;
const categoryButtons = document.querySelectorAll(
  '#category_container .checkbox'
);
const priceButtons = document.querySelectorAll('#price_container .checkbox');
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

const hideAllCheckmarks = (
  buttons: NodeListOf<Element>,
  checkbox: Element | null
) => {
  buttons.forEach((button) => {
    if (button.firstElementChild !== checkbox?.firstElementChild) {
      button.firstElementChild?.classList.add('hidden');
    }
  });
};

// Måste se till så att båda filtren gäller / förenkla funktioner för att förhindra upprepningar

const clickOnCategoryButtons = (e: Event) => {
  const checkbox = (e.target as HTMLElement).closest('.checkbox');
  hideAllCheckmarks(categoryButtons, checkbox);
  if (checkbox !== null) {
    const image = checkbox.firstElementChild;
    if (image !== null) {
      image.classList.toggle('hidden');
    }
    const noneChecked = Array.from(categoryButtons).every(
      (button) => button.firstElementChild?.classList.contains('hidden')
    );
    if (noneChecked) {
      // if no category is checked generate original full list
      generateList(productData);
    } else {
      const categoryName = checkbox.nextElementSibling?.textContent;
      // filter and generate list depending on if the category name coresponds to the object.category name
      const filteredArray = productData.filter(
        (object) =>
          object.category.toLowerCase() === categoryName?.toLowerCase()
      );
      generateList(filteredArray);
    }
  }
};

const clickOnPriceButtons = (e: Event) => {
  const checkbox = (e.target as HTMLElement).closest('.checkbox');
  hideAllCheckmarks(priceButtons, checkbox);
  if (checkbox !== null) {
    const image = checkbox.firstElementChild;

    if (image !== null) {
      image.classList.toggle('hidden');
    }
    const noneChecked = Array.from(priceButtons).every(
      (button) => button.firstElementChild?.classList.contains('hidden')
    );
    if (noneChecked) {
      generateList(productData);
    } else {
      const categoryName = checkbox.nextElementSibling?.textContent;
      if (categoryName !== null && categoryName !== undefined) {
        const numberArray = categoryName
          .split('-')
          .map((string) => Number(string));
        const filteredArray = productData.filter(
          (object) =>
            object.price > numberArray[0] && object.price < numberArray[1]
        );
        generateList(filteredArray);
      }
    }
  }
};

const toggleMenu = (e: Event) => {
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

const openModal = (animationClass: string, modal: Element | null) => {
  modal?.classList.add(animationClass);
  modal?.classList.add('flex');
  lightbox?.classList.remove('hidden');
};

const closeModal = (animationClass: string, modal: Element | null) => {
  modal?.classList.remove(animationClass);
  modal?.classList.remove('flex');
  lightbox?.classList.add('hidden');
};

const startTheme = () => {
  userDark ? root.classList.add('dark') : root.classList.remove('dark');
  if (storedTheme !== null) {
    storedTheme === 'dark'
      ? root.classList.add('dark')
      : root.classList.remove('dark');
  }
};

const switchTheme = () => {
  const isDarkModeOn = document.documentElement.classList.contains('dark');
  const root = document.documentElement;
  console.log(root);
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
  // Creating an Array for the stars icons using map and join methods, also checking which star icon i should have based on rating score
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
  const starsHtml = Array.from({ length: 5 }, (_) => {
    return `
        <img
          src="/src/assets/icons/${rating > 0 ? 'star-checked' : 'star'}.svg"
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

  <div class="w-full h-[400px] relative overflow-y-hidden">
    <img
      src=${image.desktop}
      width="300"
      height="300"
      alt=${alt}
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
    class="h-16 flex justify-center items-center main-button cursor-pointer absolute bottom-0 w-full"
    id="add_cart_button"
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
  if (listContainer !== null) {
    listContainer.innerHTML = '';
  }
  productData.forEach((product) => {
    const productContainer = document.createElement('div');
    productContainer.id = 'product';
    // Making the tailwind classes into an array so i can add these to the product container
    const tailwindClasses: string[] =
      'col-span-4 md:col-span-3 xl:col-span-3 flex flex-col w-full h-[600px] bg-light-Secondary dark:bg-dark-Secondary dark:border-dark-border rounded-sm'.split(
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
  if (target.id === 'add_cart_button') {
    target.previousElementSibling?.classList.add('open-product-info');
  }
};

const handleMouseLeaveOnProductContainer = (event: Event) => {
  const e = event as MouseEvent;
  const target = e.target as HTMLElement;
  const relatedTarget = e.relatedTarget as HTMLElement;
  const productContainer = target.closest('#product');

  if (productContainer !== null && !productContainer.contains(relatedTarget)) {
    const productInfo = productContainer.querySelector('.open-product-info');
    if (productInfo !== null) {
      productInfo.classList.remove('open-product-info');
    }
  }
};

/* Function Calls */

startTheme();
generateList(productData);

const toggleCategoryContainer = (e: Event) => {
  const target = e.target as HTMLElement;
  const categorySwitcher = target.closest('#category_switcher');
  if (categorySwitcher !== null) {
    categorySwitcher.nextElementSibling?.classList.toggle('close-categories');
    // toggle rotation on arrow
    categorySwitcher.children[1].classList.toggle('rotate');

    if (categorySwitcher.parentElement !== null) {
      // fix this animation not done
      categorySwitcher.parentElement.classList.toggle('closed');
    }
  }
};

/* Event Listeners */

listContainer?.addEventListener('mouseover', handleMouseEnterOnAddToCart); // event delegation on listcontainer
listContainer?.addEventListener('mouseout', handleMouseLeaveOnProductContainer); // event delegation on listcontainer
filterModal?.addEventListener('click', toggleCategoryContainer);
menuButton?.addEventListener('click', toggleMenu);
filterButtonOpen?.addEventListener('click', () => {
  openModal('open-sidebar', filterModal);
});
filterButtonClose?.addEventListener('click', () => {
  closeModal('open-sidebar', filterModal);
});
addToCartButton?.addEventListener('click', () => { openModal('open-sidebar', cartModal) })
darkmodeButton?.addEventListener('click', switchTheme);
sortButton?.addEventListener('click', handleClickOnSortPanel);
categoryButtons.forEach((button) => {
  button.addEventListener('click', clickOnCategoryButtons);
});
priceButtons.forEach((button) => {
  button.addEventListener('click', clickOnPriceButtons);
});
