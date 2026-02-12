
-- Tabela de assinaturas vinculada ao auth.users
create table public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'pro', 'premium')),
  status text not null default 'inactive' check (status in ('active', 'past_due', 'canceled', 'trialing', 'inactive')),
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  updated_at timestamptz default now()
);

-- Habilitar RLS
alter table public.subscriptions enable row level security;

-- Políticas de acesso
create policy "Users can view their own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- Função para criar entrada na tabela ao registrar usuário
create function public.handle_new_user_subscription()
returns trigger as $$
begin
  insert into public.subscriptions (user_id, plan, status)
  values (new.id, 'free', 'inactive');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger para novos usuários
create trigger on_auth_user_created_subscription
  after insert on auth.users
  for each row execute procedure public.handle_new_user_subscription();
