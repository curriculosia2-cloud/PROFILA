
-- 1. TABELA DE PERFIS (Dados do usuário)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  plan text not null default 'free' check (plan in ('free', 'pro', 'premium')),
  updated_at timestamptz default now()
);

-- 2. TABELA DE ASSINATURAS (Status de pagamento)
create table public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'pro', 'premium')),
  status text not null default 'inactive' check (status in ('active', 'past_due', 'canceled', 'trialing', 'inactive')),
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  updated_at timestamptz default now()
);

-- 3. TABELA DE CURRÍCULOS
create table public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text,
  content jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Habilitar RLS (Row Level Security) em todas
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.resumes enable row level security;

-- POLÍTICAS DE ACESSO (O usuário só vê o que é dele)
create policy "Usuários podem ver seu próprio perfil" on public.profiles for select using (auth.uid() = id);
create policy "Usuários podem atualizar seu próprio perfil" on public.profiles for update using (auth.uid() = id);

create policy "Usuários podem ver sua própria assinatura" on public.subscriptions for select using (auth.uid() = user_id);

create policy "Usuários podem ver seus próprios currículos" on public.resumes for select using (auth.uid() = user_id);
create policy "Usuários podem criar seus próprios currículos" on public.resumes for insert with check (auth.uid() = user_id);
create policy "Usuários podem atualizar seus próprios currículos" on public.resumes for update using (auth.uid() = user_id);
create policy "Usuários podem deletar seus próprios currículos" on public.resumes for delete using (auth.uid() = user_id);

-- TRIGGER PARA CRIAR PERFIL E ASSINATURA AO CADASTRAR
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, plan)
  values (new.id, new.raw_user_meta_data->>'full_name', 'free');
  
  insert into public.subscriptions (user_id, plan, status)
  values (new.id, 'free', 'inactive');
  
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
