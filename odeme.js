//Form ile verileri alıyoruz
document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("form");

    form.addEventListener("submit", function(event) {
      event.preventDefault();

      const cardNumber = document.getElementById("cardNumber").value;
      const expiryDate = document.getElementById("expiryDate").value;
      const cvv = document.getElementById("cvv").value;
      const nameOnCard = document.getElementById("nameOnCard").value;

      const formDataList = [
        `Kredi Kartı Numarası: ${cardNumber}`,
        `Son Kullanma Tarihi: ${expiryDate}`,
        `CVV: ${cvv}`,
        `Kart Üzerindeki İsim: ${nameOnCard}`,
      ];

      console.log("Form Data:");
      formDataList.forEach(item => console.log(item));
      // Formu temizle
      document.getElementById("cardNumber").value = "";
      document.getElementById("expiryDate").value = "";
      document.getElementById("cvv").value = "";
      document.getElementById("nameOnCard").value = "";
    });
  });