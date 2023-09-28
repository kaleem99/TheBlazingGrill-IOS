import React, { useState } from "react";
import { useEffect } from "react";

function YocoPaymentScreen({ amount, setPayUsingCard, payUsingCard }) {
  const [paymentStatus, setPaymentStatus] = useState(null);

  useEffect(() => {
    const handlePay = () => {
      const html = `
        <html>
          <body>
          <br><br><br><br>
          <br><br>
      
            <script src="https://js.yoco.com/sdk/v1/yoco-sdk-web.js"></script>
            <script>
              var yoco = new window.YocoSDK({
                publicKey: 'pk_live_614a9c065E1B474d8fa4',
              });
              var checkoutButton = document.querySelector('#checkout-button');
           
                yoco.showPopup({
                  amountInCents: ${parseInt(amount) * 100},
                  currency: 'ZAR',
                  name: 'Your Store or Product',
                  description: 'Awesome description',
                  callback: function (result) {
                    // This function returns a token that your server can use to capture a payment
                    if (result.error) {
                      console.log("err", result.error);
                      window.postMessage('paymentFailed');
                    } else {
                      console.log("payment complete");
                      window.postMessage('paymentComplete');
                    }
                  }
                })
            </script>
          </body>
        </html>
      `;

      return (
        <iframe
          srcDoc={html}
          style={{
            width: "200%",
            // height: "10%",
            // backgroundColor: "red",
            marginLeft: "-50%",
            marginRight: "auto",
            // marginTop: 10,
          }}
          sandbox="allow-scripts allow-same-origin"
        />
      );
    };

    const onMessage = (event) => {
      const { data } = event;
      if (data.includes("paymentComplete")) {
        setPaymentStatus("success");
      } else if (data.includes("paymentFailed")) {
        setPaymentStatus("failed");
      }
    };

    handlePay();
    window.addEventListener("message", onMessage);

    return () => {
      window.removeEventListener("message", onMessage);
    };
  }, [amount]);

  return (
    <div
      style={{
        width: "100%",
        height: "80%",
        backgroundColor: "white",
        position: "absolute",
        top: 10,
      }}
    >
      {/* <button onClick={handlePay}>Pay</button> */}
      {paymentStatus && (
        <p>
          {paymentStatus === "success"
            ? "Payment Successful"
            : "Payment Failed"}
        </p>
      )}
      <button onClick={() => setPayUsingCard(false)}>Cancel</button>
    </div>
  );
}

export default YocoPaymentScreen;
