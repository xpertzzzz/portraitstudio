
-- roles
CREATE TYPE public.app_role AS ENUM ('admin','user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own roles readable" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- categories
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'camera',
  is_active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.photographers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  profile_image text NOT NULL DEFAULT '',
  cover_image text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  experience_years int NOT NULL DEFAULT 1,
  description text NOT NULL DEFAULT '',
  specializations text[] NOT NULL DEFAULT '{}',
  languages text[] NOT NULL DEFAULT '{}',
  portfolio text[] NOT NULL DEFAULT '{}',
  rating numeric(2,1) NOT NULL DEFAULT 4.5,
  reviews_count int NOT NULL DEFAULT 0,
  starting_price int NOT NULL DEFAULT 10000,
  availability text NOT NULL DEFAULT 'Available',
  is_verified boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  photographer_id uuid REFERENCES public.photographers(id) ON DELETE SET NULL,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  price int NOT NULL DEFAULT 0,
  duration text NOT NULL DEFAULT '',
  photographers_count int NOT NULL DEFAULT 1,
  photos_count int NOT NULL DEFAULT 100,
  video_included boolean NOT NULL DEFAULT false,
  album_included boolean NOT NULL DEFAULT false,
  drone_included boolean NOT NULL DEFAULT false,
  description text NOT NULL DEFAULT '',
  features text[] NOT NULL DEFAULT '{}',
  image_url text NOT NULL DEFAULT '',
  badge text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_ref text NOT NULL UNIQUE DEFAULT ('PH-' || upper(substr(md5(random()::text),1,6))),
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  photographer_id uuid REFERENCES public.photographers(id) ON DELETE SET NULL,
  package_id uuid REFERENCES public.packages(id) ON DELETE SET NULL,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL DEFAULT '',
  event_date date NOT NULL,
  event_time text NOT NULL DEFAULT '',
  event_location text NOT NULL DEFAULT '',
  guests int NOT NULL DEFAULT 0,
  notes text NOT NULL DEFAULT '',
  amount int NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  payment_status text NOT NULL DEFAULT 'unpaid',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  photographer_id uuid REFERENCES public.photographers(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  rating int NOT NULL DEFAULT 5,
  body text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL DEFAULT 'contact',
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  subject text NOT NULL DEFAULT '',
  booking_id uuid REFERENCES public.bookings(id) ON DELETE CASCADE,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER t_cat BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER t_pho BEFORE UPDATE ON public.photographers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER t_pak BEFORE UPDATE ON public.packages FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER t_boo BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

GRANT SELECT ON public.categories, public.photographers, public.packages, public.reviews TO anon;
GRANT INSERT ON public.bookings, public.messages, public.reviews, public.customers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories, public.photographers, public.packages, public.reviews, public.bookings, public.messages, public.customers TO authenticated;
GRANT ALL ON public.categories, public.photographers, public.packages, public.reviews, public.bookings, public.messages, public.customers TO service_role;

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photographers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read categories" ON public.categories FOR SELECT TO anon, authenticated USING (is_active OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin write categories" ON public.categories FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE POLICY "public read photographers" ON public.photographers FOR SELECT TO anon, authenticated USING (is_active OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin write photographers" ON public.photographers FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE POLICY "public read packages" ON public.packages FOR SELECT TO anon, authenticated USING (is_active OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin write packages" ON public.packages FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE POLICY "public read approved reviews" ON public.reviews FOR SELECT TO anon, authenticated USING (status = 'approved' OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "anyone submit review" ON public.reviews FOR INSERT TO anon, authenticated WITH CHECK (status = 'pending');
CREATE POLICY "admin write reviews" ON public.reviews FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE POLICY "anyone create booking" ON public.bookings FOR INSERT TO anon, authenticated WITH CHECK (status = 'pending' AND payment_status = 'unpaid');
CREATE POLICY "admin manage bookings" ON public.bookings FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE POLICY "anyone create customer" ON public.customers FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admin manage customers" ON public.customers FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE POLICY "anyone create message" ON public.messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admin manage messages" ON public.messages FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- ============ DEMO DATA ============
INSERT INTO public.categories (slug, name, description, image_url, icon, sort_order) VALUES
('wedding','Wedding Photography','Full-day cinematic coverage of your big day','https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80','heart',1),
('pre-wedding','Pre-Wedding Photography','Romantic outdoor and studio couple shoots','https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80','sparkles',2),
('engagement','Engagement Photography','Capture the moment you said yes','https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80','gem',3),
('portrait','Portrait Photography','Studio and lifestyle portraits with character','https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=1200&q=80','user',4),
('event','Event Photography','Conferences, parties and celebrations','https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80','party-popper',5),
('fashion','Fashion Photography','Editorial and lookbook photography','https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80','shirt',6),
('product','Product Photography','E-commerce and catalogue imagery','https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80','package',7),
('corporate','Corporate Photography','Headshots, offices and brand stories','https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80','briefcase',8),
('maternity','Maternity Photography','Elegant maternity and newborn sessions','https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1200&q=80','baby',9),
('birthday','Birthday Photography','Candid celebration coverage','https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1200&q=80','cake',10),
('travel','Travel Photography','Destination and landscape storytelling','https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80','plane',11),
('food','Food Photography','Restaurant menus and culinary styling','https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80','utensils',12),
('drone','Drone Photography','Aerial cinematography and stills','https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1200&q=80','plane-takeoff',13),
('cinematic','Cinematic Videography','Films that feel like cinema','https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80','clapperboard',14),
('baby','Baby Photography','Gentle newborn and toddler portraits','https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=80','baby',15);

INSERT INTO public.photographers (slug,name,profile_image,cover_image,location,phone,email,experience_years,description,specializations,languages,portfolio,rating,reviews_count,starting_price) VALUES
('arjun-photography','Arjun Photography','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80','https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80','Bhubaneswar, Odisha','+91 98765 43210','arjun@photographerhub.in',9,'Award-winning wedding storyteller known for candid, emotion-first frames across Odisha and East India.','{"Wedding","Pre-Wedding","Events"}','{"English","Hindi","Odia"}','{"https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80","https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80","https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1000&q=80","https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80","https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1000&q=80","https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=1000&q=80"}',4.9,128,15000),
('meera-lens-studio','Meera Lens Studio','https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80','https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=80','Kolkata, West Bengal','+91 98311 22334','meera@photographerhub.in',7,'Fashion and portrait specialist with an editorial eye and a fully equipped Kolkata studio.','{"Fashion","Portrait","Product"}','{"English","Bengali","Hindi"}','{"https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1000&q=80","https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=1000&q=80","https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=80","https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&w=1000&q=80"}',4.8,96,12000),
('rohit-frames','Rohit Frames','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80','https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80','Mumbai, Maharashtra','+91 99200 55667','rohit@photographerhub.in',12,'Corporate and event photographer trusted by Mumbai startups and Fortune 500 offices alike.','{"Corporate","Event","Portrait"}','{"English","Hindi","Marathi"}','{"https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80","https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80","https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80"}',4.7,142,18000),
('sneha-clicks','Sneha Clicks','https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80','https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1600&q=80','Cuttack, Odisha','+91 94370 11223','sneha@photographerhub.in',6,'Maternity, newborn and family sessions with warm natural light and gentle direction.','{"Maternity","Baby","Portrait"}','{"English","Odia","Hindi"}','{"https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1000&q=80","https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1000&q=80","https://images.unsplash.com/photo-1476703993599-0035a21b17a9?auto=format&fit=crop&w=1000&q=80"}',4.9,74,9000),
('vikram-visuals','Vikram Visuals','https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=400&q=80','https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1600&q=80','Delhi NCR','+91 98110 44556','vikram@photographerhub.in',11,'Drone cinematography and destination wedding films shot across India.','{"Drone","Cinematic","Wedding"}','{"English","Hindi","Punjabi"}','{"https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1000&q=80","https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1000&q=80","https://images.unsplash.com/photo-1506947411487-a56738267384?auto=format&fit=crop&w=1000&q=80"}',4.8,110,25000),
('ananya-studio','Ananya Studio','https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80','https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1600&q=80','Bengaluru, Karnataka','+91 98450 77889','ananya@photographerhub.in',8,'Pre-wedding and engagement specialist blending documentary and fine-art styles.','{"Pre-Wedding","Engagement","Wedding"}','{"English","Kannada","Hindi"}','{"https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1000&q=80","https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80","https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=1000&q=80"}',4.9,88,14000),
('kabir-studio','Kabir Studio','https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80','https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80','Hyderabad, Telangana','+91 90000 33445','kabir@photographerhub.in',5,'Food and product photography built for menus, brands and marketplaces.','{"Food","Product","Corporate"}','{"English","Telugu","Hindi"}','{"https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80","https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80"}',4.6,52,8000),
('priyanka-photoworks','Priyanka Photoworks','https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80','https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1600&q=80','Pune, Maharashtra','+91 90280 66778','priyanka@photographerhub.in',6,'Birthdays, anniversaries and family celebrations captured with joyful candid energy.','{"Birthday","Event","Portrait"}','{"English","Marathi","Hindi"}','{"https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1000&q=80","https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1000&q=80"}',4.7,63,7500),
('sarthak-media','Sarthak Media','https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=400&q=80','https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1600&q=80','Chennai, Tamil Nadu','+91 98400 99001','sarthak@photographerhub.in',10,'Cinematic wedding films and highlight reels with a dedicated editing team.','{"Cinematic","Wedding","Event"}','{"English","Tamil","Hindi"}','{"https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1000&q=80","https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80"}',4.8,101,22000),
('nisha-portraits','Nisha Portraits','https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80','https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=1600&q=80','Bhubaneswar, Odisha','+91 94371 55667','nisha@photographerhub.in',4,'Fresh portrait and travel photography for creators, couples and brands.','{"Portrait","Travel","Fashion"}','{"English","Odia","Hindi"}','{"https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=1000&q=80","https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1000&q=80"}',4.6,41,6500);

INSERT INTO public.packages (name, photographer_id, category_id, price, duration, photographers_count, photos_count, video_included, album_included, drone_included, description, features, image_url, badge)
SELECT v.name, p.id, c.id, v.price, v.duration, v.pc, v.photos, v.video, v.album, v.drone, v.descr, v.features::text[], v.img, v.badge
FROM (VALUES
 ('Essential Wedding','arjun-photography','wedding',25000,'6 Hours Coverage',1,300,false,true,false,'Perfect for intimate weddings and single-day ceremonies.','{"1 Photographer","6 Hours Coverage","300 Edited Photos","Online Gallery","Basic Album"}','https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',NULL),
 ('Premium Wedding','arjun-photography','wedding',50000,'10 Hours Coverage',2,700,true,true,true,'Our most booked wedding package with cinematic video and drone.','{"2 Photographers","10 Hours Coverage","700 Edited Photos","Cinematic Video","Premium Album","Drone Coverage"}','https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80','Most Popular'),
 ('Luxury Wedding','sarthak-media','wedding',90000,'Full Day Coverage',3,1200,true,true,true,'Full-scale luxury production with a dedicated film crew.','{"3 Photographers","Full Day Coverage","1200+ Edited Photos","Cinematic Film","Premium Album","Drone Coverage","Pre-Wedding Session"}','https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80','Luxury'),
 ('Pre-Wedding Classic','ananya-studio','pre-wedding',18000,'4 Hours',1,150,false,true,false,'One location couple shoot with styling guidance.','{"1 Photographer","4 Hours","150 Edited Photos","1 Location","Mini Album"}','https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80','Best Value'),
 ('Pre-Wedding Cinematic','ananya-studio','pre-wedding',35000,'Full Day',2,300,true,true,false,'Two locations with a cinematic teaser film.','{"2 Photographers","Full Day","300 Edited Photos","2 Locations","Teaser Film"}','https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=1200&q=80',NULL),
 ('Engagement Essentials','ananya-studio','engagement',15000,'3 Hours',1,120,false,false,false,'Ceremony coverage with fast turnaround.','{"1 Photographer","3 Hours","120 Edited Photos","Online Gallery"}','https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',NULL),
 ('Studio Portrait Session','nisha-portraits','portrait',6500,'90 Minutes',1,40,false,false,false,'Studio portraits with two outfit changes.','{"1 Photographer","90 Minutes","40 Edited Photos","2 Outfits"}','https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=1200&q=80',NULL),
 ('Personal Branding Shoot','rohit-frames','portrait',14000,'Half Day',1,80,false,false,false,'Portraits built for LinkedIn, press and websites.','{"1 Photographer","Half Day","80 Edited Photos","Retouching"}','https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&w=1200&q=80',NULL),
 ('Corporate Event Coverage','rohit-frames','corporate',22000,'8 Hours',2,400,true,false,false,'Conference and townhall coverage with same-day previews.','{"2 Photographers","8 Hours","400 Edited Photos","Same-Day Previews","Event Recap Video"}','https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80','Most Booked'),
 ('Birthday Celebration','priyanka-photoworks','birthday',7500,'3 Hours',1,100,false,false,false,'Candid birthday coverage for kids and adults.','{"1 Photographer","3 Hours","100 Edited Photos","Online Gallery"}','https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1200&q=80',NULL),
 ('Grand Event Package','priyanka-photoworks','event',19000,'6 Hours',2,250,true,false,false,'Large celebrations with two shooters and a highlight reel.','{"2 Photographers","6 Hours","250 Edited Photos","Highlight Reel"}','https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',NULL),
 ('Fashion Lookbook','meera-lens-studio','fashion',28000,'Full Day',1,120,false,false,false,'Editorial lookbook with studio, lighting and retouching.','{"1 Photographer","Full Day","120 Retouched Images","Studio + Lighting"}','https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80',NULL),
 ('Product Catalogue','kabir-studio','product',12000,'Per 50 Products',1,50,false,false,false,'Clean e-commerce imagery on white and lifestyle sets.','{"50 Products","White + Lifestyle Sets","Web-Ready Exports"}','https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80','Best Value'),
 ('Maternity Glow','sneha-clicks','maternity',9000,'2 Hours',1,60,false,true,false,'Soft natural-light maternity session with gowns provided.','{"1 Photographer","2 Hours","60 Edited Photos","Gowns Provided","Mini Album"}','https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1200&q=80',NULL),
 ('Aerial Cinematic Add-On','vikram-visuals','drone',25000,'Full Day',1,80,true,false,true,'Licensed drone crew for aerial stills and cinematic footage.','{"Licensed Drone Pilot","Full Day","4K Aerial Footage","80 Aerial Stills"}','https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1200&q=80',NULL)
) AS v(name, pslug, cslug, price, duration, pc, photos, video, album, drone, descr, features, img, badge)
JOIN public.photographers p ON p.slug = v.pslug
JOIN public.categories c ON c.slug = v.cslug;

INSERT INTO public.customers (name,email,phone) VALUES
('Rahul Sharma','rahul.sharma@example.com','+91 98111 20001'),
('Priya Nayak','priya.nayak@example.com','+91 94370 20002'),
('Aditya Mohanty','aditya.mohanty@example.com','+91 90900 20003'),
('Sanjana Iyer','sanjana.iyer@example.com','+91 98400 20004'),
('Karan Mehta','karan.mehta@example.com','+91 99200 20005');

INSERT INTO public.bookings (customer_id, photographer_id, package_id, category_id, customer_name, customer_email, customer_phone, event_date, event_time, event_location, guests, notes, amount, status, payment_status)
SELECT cu.id, pk.photographer_id, pk.id, pk.category_id, v.cname, cu.email, cu.phone, v.edate::date, v.etime, v.loc, v.guests, v.notes, pk.price, v.status, v.pay
FROM (VALUES
 ('Rahul Sharma','Premium Wedding','2026-09-20','5:00 PM','Mayfair Convention, Bhubaneswar',400,'Please cover the sangeet as well.','pending','unpaid'),
 ('Priya Nayak','Pre-Wedding Classic','2026-10-05','7:00 AM','Konark Beach, Puri',2,'Sunrise shoot preferred.','confirmed','advance_paid'),
 ('Aditya Mohanty','Corporate Event Coverage','2026-08-28','10:00 AM','HITEC City, Hyderabad',180,'Need same-day previews for press.','confirmed','advance_paid'),
 ('Sanjana Iyer','Birthday Celebration','2026-07-12','6:30 PM','Koregaon Park, Pune',60,'Kids birthday, lots of candids.','completed','fully_paid'),
 ('Karan Mehta','Fashion Lookbook','2026-09-02','11:00 AM','Studio, Kolkata',8,'Autumn collection shoot.','cancelled','refunded')
) AS v(cname, pname, edate, etime, loc, guests, notes, status, pay)
JOIN public.customers cu ON cu.name = v.cname
JOIN public.packages pk ON pk.name = v.pname;

INSERT INTO public.messages (type,title,body,name,email,booking_id,is_read)
SELECT 'booking','New Booking Received', b.customer_name || ' requested ' || COALESCE(pk.name,'a package') || ' for ' || to_char(b.event_date,'DD Mon YYYY') || ' — ₹' || b.amount, b.customer_name, b.customer_email, b.id, b.status <> 'pending'
FROM public.bookings b LEFT JOIN public.packages pk ON pk.id = b.package_id;

INSERT INTO public.messages (type,title,body,name,email,phone,subject) VALUES
('contact','New Contact Enquiry','Do you cover destination weddings in Goa during December?','Neha Kapoor','neha.kapoor@example.com','+91 98220 33445','Destination wedding'),
('contact','New Contact Enquiry','Looking for a product photographer for a jewellery catalogue of 200 items.','Vivek Agarwal','vivek.agarwal@example.com','+91 98300 44556','Product catalogue quote');

INSERT INTO public.reviews (photographer_id, customer_name, rating, body, status)
SELECT p.id, v.cname, v.rating, v.body, v.status FROM (VALUES
 ('arjun-photography','Priya & Rahul',5,'Photographer Hub made finding our wedding photographer incredibly easy. The entire booking process was smooth and professional.','approved'),
 ('arjun-photography','Debasish Panda',5,'Arjun captured every emotion of our wedding. The album is stunning.','approved'),
 ('ananya-studio','Sneha & Vikas',5,'Our pre-wedding shoot felt effortless and the photos look like a magazine spread.','approved'),
 ('rohit-frames','Ritika Malhotra',4,'Very professional corporate coverage, delivered previews the same evening.','approved'),
 ('meera-lens-studio','Ayesha Khan',5,'Meera understood our brand instantly. The lookbook exceeded expectations.','approved'),
 ('sneha-clicks','Anjali Das',5,'The maternity session was so comfortable and the images are beautiful.','approved'),
 ('vikram-visuals','Harpreet Singh',5,'The aerial footage gave our wedding film a whole new dimension.','approved'),
 ('sarthak-media','Lakshmi Raman',4,'Cinematic film was delivered on time and everyone loved it.','approved'),
 ('priyanka-photoworks','Manish Joshi',5,'Wonderful candid shots from my daughter''s birthday.','approved'),
 ('kabir-studio','Rohan Reddy',4,'Clean product images that boosted our listings.','pending')
) AS v(pslug,cname,rating,body,status)
JOIN public.photographers p ON p.slug = v.pslug;
