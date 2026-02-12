
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
    // Tenta pegar a sessão ativa
    const { data: { session } } = await supabase.auth.getSession();
    
    // Se não houver sessão no cache, tenta validar o usuário diretamente (mais lento, mas mais preciso)
    if (!session) {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("Sua sessão expirou ou você não está logado. Por favor, entre na sua conta novamente.");
      }
    }

    // Chamada para a Supabase Edge Function
    // O Supabase SDK adiciona automaticamente o header de autorização se houver uma sessão
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: { 
        priceId,
        origin: this.getOrigin()
      }
    });

    if (error) {
      console.error("Erro na Edge Function:", error);
      throw new Error("Erro ao processar sua requisição de pagamento. Verifique se os IDs de preço do Stripe estão configurados.");
    }

    if (data?.url) {
      // Abre em nova aba para evitar restrições de iFrame (X-Frame-Options) do Stripe no preview
      window.open(data.url, "_blank");
    } else {
      throw new Error("Não foi possível gerar o link de pagamento.");
    }
  },

  /**
   * Abre o portal de gerenciamento de assinatura do Stripe em nova aba.
   */
  async createPortalSession() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");
    }

    const { data, error } = await supabase.functions.invoke('create-portal-session', {
      body: { 
        origin: this.getOrigin() + '/#/dashboard'
      }
    });

    if (error) throw error;
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
