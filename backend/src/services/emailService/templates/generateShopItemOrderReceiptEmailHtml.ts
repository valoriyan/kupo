export function generateShopItemOrderReceiptEmailHtml({
  homepageUrl,
  transactionId,
  shopItemTitle,
  price,
}: {
  homepageUrl: string;
  transactionId: string;
  shopItemTitle: string;
  price: string;
}) {
  return `
  <a href="${homepageUrl}">Kupo<a/>

  Your order receipt

  Confirmation Id: ${transactionId}

  Name: ${shopItemTitle}
  Price: ${price}

  `;
}
