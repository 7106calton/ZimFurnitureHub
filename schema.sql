-- Create Collections Table
CREATE TABLE public.collections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Products Table
CREATE TABLE public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    collection_id UUID REFERENCES public.collections(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    image_url TEXT,
    stock_quantity INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Profiles Table (extends Supabase Auth users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create Orders Table
CREATE TABLE public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'pending' NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Order Items Table
CREATE TABLE public.order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE RESTRICT NOT NULL,
    quantity INTEGER NOT NULL,
    price_at_time NUMERIC(10, 2) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Policies for collections (Anyone can read, only admins can write - for simplicity, assuming read-only for public)
CREATE POLICY "Collections are viewable by everyone." ON public.collections FOR SELECT USING (true);

-- Policies for products
CREATE POLICY "Products are viewable by everyone." ON public.products FOR SELECT USING (true);

-- Policies for profiles
CREATE POLICY "Users can view their own profile." ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Policies for orders (Users can read their own orders, and create orders)
CREATE POLICY "Users can view their own orders." ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own orders." ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for order items (Users can read/insert items for their own orders)
CREATE POLICY "Users can view their own order items." ON public.order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE id = order_items.order_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert their own order items." ON public.order_items FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.orders WHERE id = order_items.order_id AND user_id = auth.uid())
);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call handle_new_user when an auth.user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Optional: Insert Mock Data
INSERT INTO public.collections (id, title, description, image_url) VALUES 
('11111111-1111-1111-1111-111111111111', 'The Sofa Collection', 'Timeless comfort', 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80'),
('22222222-2222-2222-2222-222222222222', 'Minimalist Dining', 'Where memories gather', 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80'),
('33333333-3333-3333-3333-333333333333', 'Premium Bedding', 'Restful luxury', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80');

INSERT INTO public.products (collection_id, name, price, image_url) VALUES
('11111111-1111-1111-1111-111111111111', 'Oslo Velvet Sofa', 2890, 'https://images.unsplash.com/photo-1550254478-ead40cc54513?w=600&q=80'),
('11111111-1111-1111-1111-111111111111', 'Nordic Lounge Chair', 1450, 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&q=80'),
('11111111-1111-1111-1111-111111111111', 'Haven Armchair', 1690, 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=80'),
('22222222-2222-2222-2222-222222222222', 'Zen Coffee Table', 890, 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=600&q=80'),
('22222222-2222-2222-2222-222222222222', 'Minimalist Bookshelf', 1290, 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=600&q=80'),
('22222222-2222-2222-2222-222222222222', 'Aurora Dining Table', 3450, 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=600&q=80'),
('33333333-3333-3333-3333-333333333333', 'Serene Bedframe', 2190, 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=600&q=80'),
('33333333-3333-3333-3333-333333333333', 'Aura Side Table', 590, 'https://images.unsplash.com/photo-1499933374294-4584851497cc?w=600&q=80');
