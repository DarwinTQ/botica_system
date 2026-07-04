-- =====================================================================
-- Botica Nova Salud — Esquema PostgreSQL para Supabase
-- =====================================================================
-- Ejecutar en el SQL Editor de Supabase (o vía `supabase db push`).
-- Diseñado para reemplazar la capa mock de server/src/services/*
-- sin cambiar controladores ni frontend.
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- USUARIOS (complementa a Supabase Auth: auth.users)
-- ---------------------------------------------------------------------
create table if not exists usuarios (
  id            uuid primary key default gen_random_uuid(),
  auth_user_id  uuid references auth.users (id) on delete cascade,
  nombre        text not null,
  email         text not null unique,
  rol           text not null check (rol in ('ADMINISTRADOR', 'VENDEDOR')),
  creado_en     timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- CATEGORIAS
-- ---------------------------------------------------------------------
create table if not exists categorias (
  id      serial primary key,
  nombre  text not null unique
);

-- ---------------------------------------------------------------------
-- PRODUCTOS
-- ---------------------------------------------------------------------
create table if not exists productos (
  id                  serial primary key,
  codigo              text not null unique,
  nombre              text not null,
  categoria_id        integer references categorias (id) on delete set null,
  laboratorio         text,
  presentacion        text,
  precio_compra       numeric(10, 2) not null check (precio_compra >= 0),
  precio_venta        numeric(10, 2) not null check (precio_venta >= 0),
  stock_actual        integer not null default 0 check (stock_actual >= 0),
  stock_minimo        integer not null default 0 check (stock_minimo >= 0),
  fecha_vencimiento   date,
  requiere_receta     boolean not null default false,
  imagen_url          text,
  creado_en           timestamptz not null default now(),
  actualizado_en      timestamptz not null default now()
);

create index if not exists idx_productos_categoria on productos (categoria_id);
create index if not exists idx_productos_vencimiento on productos (fecha_vencimiento);

-- ---------------------------------------------------------------------
-- CLIENTES
-- ---------------------------------------------------------------------
create table if not exists clientes (
  id         serial primary key,
  nombre     text not null,
  dni        text unique,
  telefono   text,
  correo     text,
  creado_en  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- VENTAS
-- ---------------------------------------------------------------------
create table if not exists ventas (
  id               serial primary key,
  fecha            timestamptz not null default now(),
  cliente_id       integer references clientes (id) on delete set null,
  vendedor_id      uuid references usuarios (id) on delete set null,
  metodo_pago      text not null check (metodo_pago in ('Efectivo', 'Yape', 'Plin', 'Tarjeta')),
  subtotal         numeric(10, 2) not null check (subtotal >= 0),
  igv              numeric(10, 2) not null check (igv >= 0),
  total            numeric(10, 2) not null check (total >= 0)
);

create index if not exists idx_ventas_fecha on ventas (fecha);
create index if not exists idx_ventas_cliente on ventas (cliente_id);

-- ---------------------------------------------------------------------
-- DETALLE_VENTAS
-- ---------------------------------------------------------------------
create table if not exists detalle_ventas (
  id                serial primary key,
  venta_id          integer not null references ventas (id) on delete cascade,
  producto_id       integer not null references productos (id),
  cantidad          integer not null check (cantidad > 0),
  precio_unitario   numeric(10, 2) not null check (precio_unitario >= 0),
  subtotal          numeric(10, 2) not null check (subtotal >= 0)
);

create index if not exists idx_detalle_ventas_venta on detalle_ventas (venta_id);
create index if not exists idx_detalle_ventas_producto on detalle_ventas (producto_id);

-- ---------------------------------------------------------------------
-- ALERTAS (opcional: puede calcularse al vuelo, pero se persiste
-- para historial/auditoría de reposición y vencimientos)
-- ---------------------------------------------------------------------
create table if not exists alertas (
  id               serial primary key,
  tipo             text not null check (tipo in ('STOCK_BAJO', 'VENCIMIENTO')),
  nivel            text not null check (nivel in ('advertencia', 'critico')),
  producto_id      integer not null references productos (id) on delete cascade,
  mensaje          text not null,
  atendida         boolean not null default false,
  creado_en        timestamptz not null default now()
);

create index if not exists idx_alertas_producto on alertas (producto_id);
create index if not exists idx_alertas_atendida on alertas (atendida);

-- ---------------------------------------------------------------------
-- Trigger: actualizar "actualizado_en" en productos
-- ---------------------------------------------------------------------
create or replace function set_actualizado_en()
returns trigger as $$
begin
  new.actualizado_en = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_productos_actualizado_en on productos;
create trigger trg_productos_actualizado_en
  before update on productos
  for each row
  execute function set_actualizado_en();

-- ---------------------------------------------------------------------
-- Seed mínimo de categorías (coincide con server/src/data/mock/categorias.json)
-- ---------------------------------------------------------------------
insert into categorias (nombre) values
  ('Analgésicos'),
  ('Antibióticos'),
  ('Antiinflamatorios'),
  ('Gastrointestinal'),
  ('Vitaminas y Suplementos'),
  ('Cuidado Personal'),
  ('Insumos Médicos'),
  ('Respiratorio y Alergias'),
  ('Nutrición'),
  ('Cardio y Metabólico')
on conflict (nombre) do nothing;

-- ---------------------------------------------------------------------
-- Row Level Security (habilitar cuando se conecte Supabase Auth)
-- ---------------------------------------------------------------------
alter table productos enable row level security;
alter table categorias enable row level security;
alter table clientes enable row level security;
alter table ventas enable row level security;
alter table detalle_ventas enable row level security;
alter table alertas enable row level security;
alter table usuarios enable row level security;

-- Lectura abierta a usuarios autenticados (ajustar según roles reales)
create policy "lectura_autenticados_productos" on productos
  for select using (auth.role() = 'authenticated');
create policy "lectura_autenticados_categorias" on categorias
  for select using (auth.role() = 'authenticated');
create policy "lectura_autenticados_clientes" on clientes
  for select using (auth.role() = 'authenticated');
create policy "lectura_autenticados_ventas" on ventas
  for select using (auth.role() = 'authenticated');
create policy "lectura_autenticados_detalle_ventas" on detalle_ventas
  for select using (auth.role() = 'authenticated');
create policy "lectura_autenticados_alertas" on alertas
  for select using (auth.role() = 'authenticated');
create policy "lectura_autenticados_usuarios" on usuarios
  for select using (auth.role() = 'authenticated');

-- Escritura solo para el rol ADMINISTRADOR (ejemplo, requiere función helper)
-- create policy "escritura_admin_productos" on productos
--   for all using (
--     exists (
--       select 1 from usuarios u
--       where u.auth_user_id = auth.uid() and u.rol = 'ADMINISTRADOR'
--     )
--   );
