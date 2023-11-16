/**
 * Import productData
 * Setup Selectors
 * Get darkmode button as selector x
 * Add Event Listener x
 * Create startTheme function and use localStorage and user preferences x
 * Create SwitchTheme function and toggle Theme based on if root contains dark, set LocalStorage x
 * Create a function for generating the products x
 * 
 * Click Event for opening Sort Modal
 * Click Event for opening Filter Modal
 * Function/s for sorting the products
 * Function/s for filtering products based on price interval and category
 */


import productData from './json/data.json';


type ProductType = {
  id: number
  name: string
  price: number
  category: string
  rating: number
  reviews: number
  species: string
  image: {
    mobile: string
    tablet: string
    desktop: string
  }
  alt: string
  cart: string
  online: number
  shop: number
  count: number 
}


const categories = document.querySelectorAll('.categories button');
categories.forEach(button => {
  button.addEventListener('click', () => {
    const category = button.textContent?.toLowerCase();
    if (category !== undefined) {
      filterByCategory(category)
    }
  })
})


const filterByCategory = (category: string) => {
  const filteredProductData = productData.filter(object => { return object.category.toLowerCase() === category })
  generateList(filteredProductData)
};

/* Selectors */

const listContainer = document.querySelector('#list_container'); // list for products
const darkmodeButton = document.querySelector('#darkmode');

const root = document.documentElement; 
const userDark = window.matchMedia('(prefers-color-scheme: dark').matches; // user theme preferences
const storedTheme = localStorage.getItem('theme'); 

/**
 * 
 */
const startTheme = () => {
  userDark ? root.classList.add('dark') : root.classList.remove('dark');
  if (storedTheme !== null) {
    storedTheme === 'dark' ? root.classList.add('dark') : root.classList.remove('dark');
  }
}

startTheme();

const switchTheme = () => {
  const isDarkModeOn = document.documentElement.classList.contains('dark');
  const root = document.documentElement;
  console.log(root)
  root.classList.toggle('dark', !isDarkModeOn);
  // setting the theme in the localStorage
  localStorage.setItem('theme', isDarkModeOn ? 'light' : 'dark');
};

/* Event Listeners */

darkmodeButton?.addEventListener('click', switchTheme);

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
            class="flex gap-2 bg-orange-500 rounded-md py-1 w-24 justify-center"
          >
            <span>-</span>
            <span>${count}</span>
            <span>+</span>
          </div>
          <button id="addToCart" class="bg-lime-300 py-1 w-28 rounded-md">
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


generateList(productData)



const addToCartButtons = document.querySelectorAll('#addToCart');
addToCartButtons.forEach((button, index) => { 
  button.addEventListener('click', () => {
    console.log(index)
  })
  console.log(index)
 });
console.log(addToCartButtons)