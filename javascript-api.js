let productsContainer=document.getElementById("products")

async function getProduct(){
    let response= await fetch('https://fakestoreapi.com/products');
     let products= await response.json();

     displayProducts(products);

}

function displayProducts(products){
   

    products.forEach(product => {
         let card= document.createElement('div')
    card.classList.add('product-card');

    card.innerHTML=`
    <img
        src="${product.image}"
        class="product-image"
      />

      <h3 class="product-title">
        ${product.title}
      </h3>

      <p class="product-price">
        $${product.price}
      </p>

      <p class="product-description">
        ${product.description.substring(0, 80)}...
      </p>

      <button class="add-btn">
        Add To Cart
      </button>
    `
    productsContainer.appendChild(card)
    });
}

getProduct()