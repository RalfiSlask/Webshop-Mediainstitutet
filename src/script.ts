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
const menuButton = document.querySelector('#menu_button') as HTMLImageElement;
const categoryButtons = document.querySelectorAll('#category_container .checkbox');
const priceButtons = document.querySelectorAll('#price_container .checkbox');
const addToCartButton = document.querySelector('#add_cart_button');
// Modals
const filterModal = document.querySelector('#filter_modal');
const sortModal = document.querySelector('#sort_modal');
const menu = document.querySelector('#menu');
// Local Storage
const storedTheme = localStorage.getItem('theme'); 
// Other
const productInfo = document.querySelector('#product_info');
const userDark = window.matchMedia('(prefers-color-scheme: dark').matches; // user theme preferences

const hideAllCheckmarks = (buttons: NodeListOf<Element>, checkbox: Element | null) => {
  buttons.forEach(button => {
    if (button.firstElementChild !== checkbox?.firstElementChild) {
      button.firstElementChild?.classList.add('hidden');
    } 
  });
};

const handleMouseEnterOnAddToCart = () => {
  productInfo?.classList.add('open-product-info');
};

const handleMouseLeaveOnAddToCart = (e: Event) => {
  productInfo?.classList.remove('open-product-info');
};

addToCartButton?.addEventListener('mouseenter', handleMouseEnterOnAddToCart);
addToCartButton?.addEventListener('mouseleave', handleMouseLeaveOnAddToCart);

// Måste se till så att båda filtren gäller / förenkla funktioner för att förhindra upprepningar

const clickOnCategoryButtons = (e: Event) => {
  const checkbox = (e.target as HTMLElement).closest('.checkbox');
  hideAllCheckmarks(categoryButtons, checkbox);
  if (checkbox !== null) {
    const image = checkbox.firstElementChild;

    if (image !== null) {
      image.classList.toggle('hidden')
    } 
    const noneChecked = Array.from(categoryButtons).every(button => button.firstElementChild?.classList.contains('hidden'));
    if (noneChecked) {
      generateList(productData)
    } else {
      const categoryName = checkbox.nextElementSibling?.textContent;
      const filteredArray = productData.filter(object => object.category.toLowerCase() === categoryName?.toLowerCase());
      generateList(filteredArray)
    }
  }
}; 

const clickOnPriceButtons = (e: Event) => {
  const checkbox = (e.target as HTMLElement).closest('.checkbox');
  hideAllCheckmarks(priceButtons, checkbox);
  if (checkbox !== null) {
    const image = checkbox.firstElementChild;

    if (image !== null) {
      image.classList.toggle('hidden')
    }
    const noneChecked = Array.from(priceButtons).every(button => button.firstElementChild?.classList.contains('hidden'));
    if (noneChecked) {
      generateList(productData);
    } else {
      const categoryName = checkbox.nextElementSibling?.textContent;
      if (categoryName !== null && categoryName !== undefined) {
        const numberArray = categoryName.split('-').map(string => Number(string));
        const filteredArray = productData.filter(object => object.price > numberArray[0] && object.price < numberArray[1]);
        generateList(filteredArray);
      }
    }
  }
};

const lightbox = document.querySelector('#lightbox');

categoryButtons.forEach(button => {
  button.addEventListener('click', clickOnCategoryButtons);
});
priceButtons.forEach(button => {
  button.addEventListener('click', clickOnPriceButtons);
}); 

const toggleMenu = (e: Event) => {
  menu?.classList.toggle('hidden');
  if (e.target === menuButton) {
    const isIconHamburger = menuButton.src.includes('hamburger');
    let source = menuButton.src;
    source = isIconHamburger ? source.replace('hamburger', 'close') : source.replace('close', 'hamburger');
    menuButton.src = source;
  }
};

const openFilterModal = () => {
  filterModal?.classList.remove('hidden');
  filterModal?.classList.add('flex');
  lightbox?.classList.remove('hidden');
};

const closeFilterModal = () => {
  filterModal?.classList.add('hidden');
  filterModal?.classList.remove('flex');
  lightbox?.classList.add('hidden');
};



const startTheme = () => {
  userDark ? root.classList.add('dark') : root.classList.remove('dark');
  if (storedTheme !== null) {
    storedTheme === 'dark' ? root.classList.add('dark') : root.classList.remove('dark');
  }
};

const switchTheme = () => {
  const isDarkModeOn = document.documentElement.classList.contains('dark');
  const root = document.documentElement;
  console.log(root)
  root.classList.toggle('dark', !isDarkModeOn);
  // setting the theme in the localStorage
  localStorage.setItem('theme', isDarkModeOn ? 'light' : 'dark');
};

const handleClickOnSortPanel = () => {
  sortModal?.classList.toggle('hidden');
};

/* Event Listeners */

menuButton?.addEventListener('click', toggleMenu);
filterButtonOpen?.addEventListener('click', openFilterModal);
filterButtonClose?.addEventListener('click', closeFilterModal);
darkmodeButton?.addEventListener('click', switchTheme);
sortButton?.addEventListener('click', handleClickOnSortPanel);


const generateList = (productData: ProductType[]) => {
  if (listContainer !== null) {
    listContainer.innerHTML = '';
  }
  productData.forEach((product) => {
    const productContainer = document.createElement('div');
    // Making the tailwind classes into an array so i can add these to the product container
    const tailwindClasses: string[] = 'grid grid-cols-4 gap-4 col-span-4 w-full'.split(' ');
    tailwindClasses.forEach(className => { productContainer.classList.add(className) });
    const { id, name, price, category, species, rating, image, alt, reviews, online, shop, count } = product;
/*   const stars = Array.from( {length: 5} , (_, index) => {
    ´<img
      src="/src/assets/icons/${rating > 0 ? 'star-checked' : 'star'}.svg"
      width="20"
      height="20"
      alt="star icon"
    />´}
    ).join(''); */
    productContainer.innerHTML = `
    <div class="col-span-4 grid grid-cols-4 gap-3">
    <div class="col-span-4 xl:col-span-2 p-2 border border-black xl:h-[300px]">
      <img
        src=${image.tablet}
        width="300"
        height="300"
        alt="${alt}"
        class="w-full h-full object-cover rounded-md"
      />
    </div>
    <div
      class="col-span-4 xl:col-span-2 border-b border-black pb-1 flex flex-col justify-between"
    >
      <h2 class="xl:text-[2rem] font-garamond">${name}</h2>
    
      <div class="flex flex-col gap-2 w-full">
        <div class="flex flex-col gap-1">
          <div class="flex gap-1">
            <p>Species:</p>
            <p>${species}</p>
          </div>
          <div class="flex gap-2">
            <p>Category:</p>
            <p>${category}</p>
          </div>
        </div>
        <p class="font-bold">$${price}</p>
        <div class="flex gap-2">
          <div
            class="flex gap-2 main-button rounded-md py-1 w-24 justify-center"
          >
            <span>-</span>
            <span>${count}</span>
            <span>+</span>
          </div>
          <button id="addToCart" class="secondary-button py-1 w-28 rounded-md">
            Add to Cart
          </button>
        </div>
        <p class="uppercase font-bold">Description</p>
      </div>
    </div>
  </div>
  <div class="grid grid-cols-4 col-span-4 gap-3 w-full">
    <div class="col-span-2 flex flex-col gap-4 px-2">
      <div class="flex items-center gap-2">
        <div class="flex items-center">
          <img
            src="/src/assets/icons/${rating > 0 ? 'star-checked' : 'star'}.svg"
            width="20"
            height="20"
            alt="star icon"
          />
          <img
            src="/src/assets/icons/${rating > 1 ? 'star-checked' : 'star'}.svg"
            width="20"
            height="20"
            alt="star icon"
          />
          <img
            src="/src/assets/icons/${rating > 2 ? 'star-checked' : 'star'}.svg"
            width="20"
            height="20"
            alt="star icon"
          />
          <img
            src="/src/assets/icons/${rating > 3 ? 'star-checked' : 'star'}.svg"
            width="20"
            height="20"
            alt="star icon"
          />
          <img
            src="/src/assets/icons/${rating > 4 ? 'star-checked' : 'star'}.svg"
            width="20"
            height="20"
            alt="star icon"
          />
        </div>
        <p>(${reviews} reviews)</p>
      </div>
      <div class="flex gap-2">
        <p class="text-green-700">In store online (${online}+)</p>
        <p>| In store in ${shop} shop(s)</p>
      </div>
    </div>
    <p class="col-span-2">
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. A,
      nihil iusto molestias odit voluptat.
    </p>
  </div>
    `;
    listContainer?.append(productContainer);
  });
};

startTheme();
/* generateList(productData); */


