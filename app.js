let cartItems = {};
let cartIsOpen = false;

// Sepet görünümünü güncellemek için fonksiyon
function updateCartView() {
  const cartContainer = $(".cart-items");
  cartContainer.empty();

  // Sepet boşsa mesaj gösteriyoruz
  if (Object.keys(cartItems).length === 0) {
    cartContainer.append("<p>Sepetiniz boş.</p>");
    return;
  }

  let totalPrice = 0;

  // Her ürün için adet bilgisini de göstererek sepeti güncelliyoruz
  for (const [itemId, itemInfo] of Object.entries(cartItems)) {
    const itemQuantity = itemInfo.quantity;
    const itemTotalPrice = itemInfo.price * itemQuantity;

    cartContainer.append(
      `<div class="cart-item">
        <span>${itemQuantity} Adet ${itemInfo.name}</span></span>
        <span>| <span><b>Ürün Fiyatı: </b>${itemTotalPrice}₺</span>
        <br/>
        <button class="btn btn-danger btn-remove" data-id="${itemId}">Kaldır</button>
        <button class="btn btn-primary btn-decrease" data-id="${itemId}">Azalt</button>
      </div>`
    );
    totalPrice += itemTotalPrice;
  }

  cartContainer.append(`<h5><b>Toplam Fiyat:</b> ${totalPrice} ₺</h5>`);
}

// Öğeler için benzersiz bir kimlik oluşturmak için fonksiyon
function generateID() {
  return Math.random().toString(36).substr(2, 9);
}

function payTotalPrice() {
    const totalAmount = calculateTotalPrice(); // Toplam fiyatı hesaplıyoruz
    alert(`Toplam Fiyat: ${totalAmount} ₺\nÖdemeniz başarıyla gerçekleştirildi.`);
    cartItems = {}; // Ödeme yapıldığında sepeti sıfırlıyoruz
    updateCartView(); // Sepet görünümünü güncelliyoruz
  }

  function calculateTotalPrice() {
    let totalPrice = 0;
    for (const itemInfo of Object.values(cartItems)) {
      totalPrice += itemInfo.price * itemInfo.quantity;
    }
    return totalPrice;
  }

  // Satın alma düğmesi tıklamasını işleyen fonksiyon
  $(".btn-purchase").on("click", function () {
  const itemName = $(this).data("name");
  const itemPrice = $(this).data("price");

  // Eğer ürün daha önce eklenmişse, adet bilgisini artırıyoruz; aksi halde yeni bir ürün olarak ekliyoruz
  if (cartItems[itemName]) {
    cartItems[itemName].quantity += 1;
  } else {
    const itemId = generateID(); // Öğe için benzersiz bir kimlik oluşturuyoruz
    cartItems[itemName] = {
      id: itemId,
      name: itemName,
      price: itemPrice,
      quantity: 1,
    };
  }

  // Sepet görünümünü güncelliyoruz
  updateCartView();

  // Sepeti açık hale getiriyoruz
  cartIsOpen = true;
  $(".cart-overlay").fadeIn();
});

// Kaldır düğmesi tıklamasını işleyen fonksiyon
$(".cart-items").on("click", ".btn-remove", function () {
  const itemId = $(this).data("id");

  // Öğeyi kimlik kullanarak sepetten bulup ve kaldırıyoruz
  delete cartItems[itemId];

  // Sepet görünümünü güncelliyoruz
  updateCartView();
});

// Azalt düğmesi tıklamasını işleyen fonksiyonumuz
$(".cart-items").on("click", ".btn-decrease", function () {
  const itemId = $(this).data("id");

  // Eğer ürün daha önce eklenmişse ve adeti 1'den büyükse, adet bilgisini azaltıyoruz
  if (cartItems[itemId] && cartItems[itemId].quantity > 1) {
    cartItems[itemId].quantity -= 1;
  } else {
    // Eğer adet 1 veya daha azsa, ürünü tamamen kaldırıyoruz
    delete cartItems[itemId];
  }

  // Sepet görünümünü güncelliyoruz
  updateCartView();
});

// Sayfa dışına tıklandığında veya sepet kapatma butonuna tıklandığında sepeti kapatan fonksiyon
$(".cart-overlay").on("click", function (e) {
  if (!cartIsOpen) return;

  if ($(e.target).hasClass("cart-overlay") || $(e.target).hasClass("btn-close-cart")) {
    $(".cart-overlay").fadeOut();
    cartIsOpen = false;
  }
});