
import { supabase } from './supabase';

export const stripeService = {
  /**
   * Obtém a base URL correta mesmo em ambientes de iframe/preview.
   */
  getOrigin() {
    // Em SPAs com HashRouter, pegamos a parte antes do '#' para garantir que as URLs de retorno funcionem
    return window.location.href.split('#')[0].replace(/\/$/, '');
  },

  /**
   * Cria uma sessão de checkout do Stripe e abre em nova aba.
   */
  async createCheckoutSession(priceId: string) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Usuário não autenticado");

    // Chamada para a Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: { 
        priceId,
        origin: this.getOrigin()
      }
    });

    if (error) throw error;
    if (data?.url) {
      // CRITICAL: Abrir em nova aba para evitar erros de conexão recusada/frame-options no AI Studio preview
      window.open(data.url, "_blank");
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

    if (error) throw error;
    if (data?.url) {
      // CRITICAL: Abrir em nova aba para evitar erros de conexão recusada/frame-options no AI Studio preview
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
