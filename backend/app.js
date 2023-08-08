const express = require('express');
const cors = require('cors');
const Iyzipay = require('iyzipay');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());
const port = 4000;

// Sunucu Test
app.get('/', (req, res) => {
  res.send('Sunucu Çalışıyor');
});

const iyzipay = new Iyzipay({
  apiKey: 'sandbox-kauF6Mzxe905engohmMGbJIGFWqVfKLZ',
  secretKey: 'sandbox-CjV99vE9F85AqEQG95N8wBNRyXSZiPm5',
  uri: 'https://sandbox-api.iyzipay.com'
});

// Sipariş verilerini veritabanına ekleyen fonksiyon
function saveOrderToDatabase(totalPrice, basketItems, counter) {
  // MySQL bağlantısı
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Samet@44',
    database: 'siparisler',
  });

  // Sipariş verilerini hazırla
  const orderData = {
    toplam_fiyat: totalPrice,
    durum: 'başarılı', // Ödeme başarılı kabul edildi varsayalım
  };

  // Siparişi veritabanına ekle
  connection.query('INSERT INTO siparisler SET ?', orderData, (err, orderResult) => {
    if (err) {
      console.error('Sipariş eklenirken bir hata oluştu:', err);
      connection.end();
      return;
    }

    const siparisId = orderResult.insertId;
    //console.log(basketItems)
    //const len = basketItems.length()
    const orderItemsData = basketItems.map(item => [
      siparisId,
      item.name,
      item.price,
      item.price/item.onlyPrice
    ]);


    // Sipariş ürünlerini veritabanına ekle
    connection.query(`INSERT INTO siparis_urunleri (siparis_id, urun_adi, urun_fiyati, adet) VALUE ?`,[orderItemsData], (err) => {
      if (err) {
        console.error('Sipariş ürünleri eklenirken bir hata oluştu:', err);
      } else {
        console.log('Sipariş Eklendı')
      }

      connection.end();
    });
  });
}

app.post('/pay', (req, res) => {
  console.log('ım here maın route')
  const totalPrice = req.body.paidPrice;
  const cardDetails = req.body.cardDetails;
  const basketItems = req.body.basketItems;
  let counter = req.body.arrlength;

  const request = {
    locale: Iyzipay.LOCALE.TR,
    conversationId: '123456789',
    price: totalPrice,
    paidPrice: totalPrice,
    currency: Iyzipay.CURRENCY.TRY,
    installment: '1',
    basketId: 'B67832',
    paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
    paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
    paymentCard: {
      cardHolderName: cardDetails.cardHolderName,
      cardNumber: cardDetails.cardNumber,
      expireMonth: cardDetails.expireMonth,
      expireYear: cardDetails.expireYear,
      cvc: cardDetails.cvc,
      registerCard: '0'
    },
    buyer: {
      id: 'BY789',
      name: 'John',
      surname: 'Doe',
      gsmNumber: '+905350000000',
      email: 'email@email.com',
      identityNumber: '74300864791',
      lastLoginDate: '2015-10-05 12:43:35',
      registrationDate: '2013-04-21 15:12:09',
      registrationAddress: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
      ip: '85.34.78.112',
      city: 'Istanbul',
      country: 'Turkey',
      zipCode: '34732'
    },
    shippingAddress: {
      contactName: 'Jane Doe',
      city: 'Istanbul',
      country: 'Turkey',
      address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
      zipCode: '34742'
    },
    billingAddress: {
      contactName: 'Jane Doe',
      city: 'Istanbul',
      country: 'Turkey',
      address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
      zipCode: '34742'
    },
    basketItems: basketItems
  };

  // İyzipay üzerinden ödeme işlemini gerçekleştir
  iyzipay.payment.create(request, function (err, result) {
    if (err) {
      console.error('Ödeme işlemi sırasında bir hata oluştu:', err);
      return res.status(500).send({ status: 'error' });
    }

    if (result.status === 'success') {
      // Ödeme başarılı, siparişi ve ürünleri veritabanına kaydet
      saveOrderToDatabase(totalPrice, basketItems, counter);

      return res.send({ status: 'success' });
    } else {
      // Ödeme başarısız
      return res.send({ status: 'failure' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server burada çalışıyor: http://localhost:${port}`);
});
