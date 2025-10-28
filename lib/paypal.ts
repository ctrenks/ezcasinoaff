import paypal from "@paypal/checkout-server-sdk";

/**
 * PayPal Configuration
 * Set up PayPal environment and client
 */

function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID || "";
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET || "";

  // Use sandbox for development, live for production
  if (
    process.env.NODE_ENV === "production" &&
    process.env.PAYPAL_MODE === "live"
  ) {
    return new paypal.core.LiveEnvironment(clientId, clientSecret);
  }
  return new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

function client() {
  return new paypal.core.PayPalHttpClient(environment());
}

export { client, paypal };
