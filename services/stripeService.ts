
export const stripeService = {
  async createCheckoutSession(priceId: string) {
    console.log("Mock Checkout para:", priceId);
    alert("Iniciando processo de pagamento simulado...");
    return { url: "#/billing/success" };
  },

  async createPortalSession() {
    alert("Abrindo gerenciamento de assinatura...");
  },

  async getSubscription(userId: string) {
    return { plan: 'free', status: 'active' };
  }
};
