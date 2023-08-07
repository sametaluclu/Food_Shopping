const express = require('express'); // sunucuyu başlatmak için get post işlemleri
const cors = require('cors'); // localden veri çekebilmek için
const Iyzipay = require('iyzipay');
const { request } = require('http');

const app = express();
app.use(cors());
const port = 4000;





// Sunucu Test
app.get('/', (req,res) =>{
    res.send("Sunucu Çalışıyor")
})








app.use(express.json()); 
app.post('/pay', (req, res) => {
    const totalPrice = req.body.paidPrice;
    const cardDetails = req.body.cardDetails;
    const basketItems = req.body.basketItems;

    console.log(req.body, "body")


    // Ödeme işlemini yapmak için gerekli parametreleri hazırla
    var iyzipay = new Iyzipay({
        apiKey: "sandbox-kauF6Mzxe905engohmMGbJIGFWqVfKLZ",
        secretKey: "sandbox-CjV99vE9F85AqEQG95N8wBNRyXSZiPm5",
        uri: 'https://sandbox-api.iyzipay.com'
    });

    var request = {
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
            // Ödeme başarılı
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
