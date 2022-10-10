import { Stripe } from "stripe";
import { v4 as uuidv4 } from "uuid";

const stripe = new Stripe("sk_test_1dUyrTmAxBReyDjHKSbQYCw500eT574kD1", {
  apiVersion: "2022-08-01",
});

interface Product {
  description: string;
  amount: number;
}
export const Payment = async (data: any) => {
  const { email, product, authToken } = data;
  const { token } = authToken;
  const { card } = token;

  console.log(card);
  const userProduct = product as Product;

  // unique ID generated by client
  const idempotencyKey = uuidv4();

  try {
    const customer = await stripe.customers.create({
      email: email,
      source: token.id,
    });

    console.log("Customer Created.....");
    console.log(customer);

    const response = await stripe.charges.create(
      {
        amount: userProduct.amount * 100,
        currency: "INR",
        customer: customer.id,
        receipt_email: email,
        description: userProduct.description,
        shipping: {
          name: card.name,
          address: {
            line1: "Mumbai",
            country: card.address_country,
          },
        },
      },
      { idempotencyKey: idempotencyKey }
    );
    return response;
  } catch (error) {
    throw error;
  }
};
