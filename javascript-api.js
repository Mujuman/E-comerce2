const productsContainer = document.getElementById("products");

// Cart helpers using localStorage
function getCart(){
  return JSON.parse(localStorage.getItem('muju_cart') || '[]');
}

function saveCart(cart){
  localStorage.setItem('muju_cart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount(){
  const count = getCart().reduce((s,i)=>s + (i.quantity||0), 0);
  const el = document.querySelector('.cart-count');
  if(el) el.textContent = count;
}

function addToCart(product){
  const cart = getCart();
  const idx = cart.findIndex(p => p.id === product.id);
  if(idx > -1){
    cart[idx].quantity = (cart[idx].quantity || 0) + 1;
  } else {
    cart.push({ id: product.id, title: product.title, price: product.price, image: product.image, quantity: 1 });
  }
  saveCart(cart);
  if(window && window.showToast){ window.showToast(`${product.title} added to cart`); }
  else alert(`${product.title} added to cart`);
}

function removeFromCart(id){
  const cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
}

function setQuantity(id, qty){
  const cart = getCart();
  const idx = cart.findIndex(i=>i.id === id);
  if(idx > -1){
    cart[idx].quantity = Math.max(1, Number(qty) || 1);
    saveCart(cart);
  }
}

// Expose helpers to other pages
window.getCart = getCart;
window.saveCart = saveCart;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.setQuantity = setQuantity;
window.updateCartCount = updateCartCount;

// Product listing
async function getProduct(){
    try{
      const response = await fetch('https://fakestoreapi.com/products');
      const products = await response.json();
      displayProducts(products);
    }catch(e){
      console.error('Failed to fetch products', e);
    }
}

function displayProducts(products){
    if(!productsContainer) return;
    productsContainer.innerHTML = '';
    products.forEach(product => {
         const card = document.createElement('div');
         card.classList.add('product-card');

         card.innerHTML = `
    <img src="${product.image}" class="product-image" />
      <h3 class="product-title">${product.title}</h3>
      <p class="product-price">$${product.price}</p>
      <p class="product-description">${product.description.substring(0, 80)}...</p>
      <button class="add-btn">Add To Cart</button>
    `;
         productsContainer.appendChild(card);

         const addBtn = card.querySelector('.add-btn');
         if(addBtn){
           addBtn.addEventListener('click', ()=> addToCart(product));
         }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', ()=>{
  updateCartCount();
  if(productsContainer) getProduct();
});