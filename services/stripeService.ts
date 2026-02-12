
import { supabase } from './supabase';

export const stripeService = {
  /**
   * Obtém a base URL correta mesmo em ambientes de iframe/preview.
   */
  getOrigin() {
    return window.location.origin;
  },

  /**
   * Cria uma sessão de checkout do Stripe e abre em nova aba.
   */
  async createCheckoutSession(priceId: string) {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("Sua sessão expirou. Por favor, faça login novamente.");
    }

    console.log(`Iniciando checkout para o Price ID: ${priceId}`);

    // Chamada para a Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: { 
        priceId,
        origin: this.getOrigin()
      }
    });

    if (error) {
      console.error("Erro detalhado da Edge Function:", error);
      // O erro 'Failed to send a request' geralmente significa que a URL da função está errada ou a rede está bloqueada
      throw new Error(`Erro de conexão com o servidor de pagamentos: ${error.message || 'Verifique sua conexão e as chaves do Supabase.'}`);
    }

    if (data?.error) {
      throw new Error(`Stripe Error: ${data.error}`);
    }

    if (data?.url) {
      window.open(data.url, "_blank");
    } else {
      throw new Error("Não foi possível gerar o link de pagamento.");
    }
  },

  /**
   * Abre o portal de gerenciamento de assinatura do Stripe em nova aba.
   */
  async createPortalSession() {
    const { data, error } = await supabase.functions.invoke('create-portal-session', {
      body: { 
        origin: this.getOrigin() + '/#/dashboard'
      }
    });

    if (error) {
      console.error("Erro ao abrir portal:", error);
      throw new Error("Não foi possível abrir o portal de gerenciamento.");
    }

    if (data?.url) {
      window.open(data.url, "_blank");
    }
  },

  /**
   * Consulta o status real da assinatura no banco de dados.
   */
  async getSubscription(userId: string) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('plan, status, current_period_end')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }
};
