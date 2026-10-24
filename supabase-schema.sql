-- =========================================================================
-- RENELLE ROBIE D. LOPEZ PORTFOLIO - SUPABASE DATABASE SCHEMA & DATA SEED
-- =========================================================================
-- Instructions:
-- 1. Go to your Supabase Project Dashboard -> SQL Editor (in the left sidebar).
-- 2. Click "New Query", paste this entire script, and click "Run".
-- 3. Everything will be created automatically (Tables, Storage Bucket, Policies, and Data).
-- =========================================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------------------------------------
-- 1. TABLE: PROFILE
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profile (
  id TEXT PRIMARY KEY DEFAULT 'default',
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  bio TEXT,
  location TEXT,
  email TEXT NOT NULL,
  github_url TEXT,
  linkedin_url TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  onlinejobs_url TEXT,
  status TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 2. TABLE: WEB PROJECTS
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.web_projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  image TEXT NOT NULL,
  live_url TEXT,
  github_url TEXT,
  tools TEXT[] DEFAULT '{}',
  badge TEXT DEFAULT 'Active',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 3. TABLE: VIDEO EDITS
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.video_edits (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  duration TEXT DEFAULT '0:30',
  software TEXT[] DEFAULT '{}',
  description TEXT,
  thumbnail TEXT,
  preview_video TEXT NOT NULL,
  highlight TEXT,
  badge TEXT DEFAULT 'Featured',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 4. TABLE: POSTERS & GRAPHIC DESIGNS
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.posters (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  software TEXT[] DEFAULT '{}',
  description TEXT,
  image TEXT NOT NULL,
  dimensions TEXT DEFAULT '3:4',
  aspect TEXT DEFAULT '3:4',
  badge TEXT DEFAULT 'Artwork',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 5. TABLE: CERTIFICATES & CREDENTIALS
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.certificates (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date TEXT NOT NULL,
  credential_id TEXT,
  category TEXT NOT NULL,
  skills TEXT[] DEFAULT '{}',
  description TEXT,
  image TEXT NOT NULL,
  badge TEXT DEFAULT 'Verified Certificate',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 6. TABLE: CONTACT INQUIRIES & MESSAGES
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

-- Enable RLS on all tables
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.web_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_edits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- 1. PUBLIC READ: Allow everyone (anonymous visitors) to view portfolio data
CREATE POLICY "Public profile read" ON public.profile FOR SELECT USING (true);
CREATE POLICY "Public web_projects read" ON public.web_projects FOR SELECT USING (true);
CREATE POLICY "Public video_edits read" ON public.video_edits FOR SELECT USING (true);
CREATE POLICY "Public posters read" ON public.posters FOR SELECT USING (true);
CREATE POLICY "Public certificates read" ON public.certificates FOR SELECT USING (true);

-- 2. PUBLIC WRITE ON CONTACT MESSAGES: Allow visitors to send inquiries
CREATE POLICY "Public contact message insert" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public contact message read" ON public.contact_messages FOR SELECT USING (true);

-- 3. ADMIN / ANON WRITE: Allow write operations via frontend (secured by frontend PIN)
CREATE POLICY "Allow anon update profile" ON public.profile FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all web_projects" ON public.web_projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all video_edits" ON public.video_edits FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all posters" ON public.posters FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all certificates" ON public.certificates FOR ALL USING (true) WITH CHECK (true);

-- =========================================================================
-- SUPABASE STORAGE BUCKET: portfolio-media
-- =========================================================================
-- Creates public bucket for images and video uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS Policies
CREATE POLICY "Public storage read"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-media');

CREATE POLICY "Public storage upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portfolio-media');

CREATE POLICY "Public storage update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'portfolio-media');

CREATE POLICY "Public storage delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'portfolio-media');

-- =========================================================================
-- INITIAL SEED DATA (FROM PORTFOLIO.JSON)
-- =========================================================================

-- Seed Profile
INSERT INTO public.profile (
  id, name, title, subtitle, bio, location, email, github_url, linkedin_url, facebook_url, instagram_url, onlinejobs_url, status
) VALUES (
  'default',
  'Renelle Robie D. Lopez',
  'Full-Stack Developer & Creative Designer',
  'Web Development • Video Editing • Graphic Design & Posters',
  'Multi-disciplinary developer and visual creator crafting clean web applications with React, cinematic video edits in Premiere & After Effects, and high-impact graphic posters with Photoshop & Illustrator.',
  'Philippines',
  'renellerobieF16@gmail.com',
  'https://github.com/renellerobief16-source',
  'https://www.linkedin.com/in/renelle-robie-lopez-a458b1267/?isSelfProfile=true',
  'https://www.facebook.com/renellerobie.flordeliz',
  'https://www.instagram.com/redmhor/?hl=en',
  'https://v2.onlinejobs.ph/jobseekers/info/5027504',
  'Open for Web & Creative Freelance Projects'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  bio = EXCLUDED.bio,
  location = EXCLUDED.location,
  email = EXCLUDED.email,
  github_url = EXCLUDED.github_url,
  linkedin_url = EXCLUDED.linkedin_url,
  facebook_url = EXCLUDED.facebook_url,
  instagram_url = EXCLUDED.instagram_url,
  onlinejobs_url = EXCLUDED.onlinejobs_url,
  status = EXCLUDED.status,
  updated_at = NOW();

-- Seed Web Projects
INSERT INTO public.web_projects (id, title, category, description, image, live_url, github_url, tools, badge, order_index)
VALUES
  (
    'libralink',
    'Libralink — Digital Library & Catalog',
    'Full-Stack Web App',
    'Modern digital library management system with book catalog search, member borrowing workflows, and responsive interface.',
    'https://images.unsplash.com/photo-1507842229451-7973a987d609?auto=format&fit=crop&w=1200&q=80',
    'https://libralinkkk.vercel.app',
    'https://github.com/renellerobief16-source/Libralink',
    ARRAY['React', 'JavaScript', 'Tailwind CSS', 'Vercel'],
    'Live Deployed',
    1
  ),
  (
    'dayrit-clinic',
    'Dayrit Clinic — Patient Healthcare Portal',
    'Medical Web App',
    'Healthcare appointment booking portal with clinical service breakdowns, doctor availability, and patient inquiries.',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    'https://dayrit-clinic.vercel.app',
    'https://github.com/renellerobief16-source/dayrit-clinic',
    ARRAY['JavaScript', 'HTML5', 'CSS3', 'Vercel'],
    'Live Deployed',
    2
  ),
  (
    'devpulse',
    'DevPulse — Developer Portfolio & Code Hub',
    'Frontend UI/UX',
    'Interactive portfolio with GitHub REST API real-time stats, glassmorphism design, and modern dark aesthetics.',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    'https://github.com/renellerobief16-source',
    'https://github.com/renellerobief16-source',
    ARRAY['React 19', 'Vite', 'Tailwind CSS', 'GitHub API'],
    'Active',
    3
  ),
  (
    'partyneeds',
    'PartyNeeds — Event Logistics & Supply Hub',
    'Web Application',
    'Event planning and party rental catalog with packages, equipment rentals, and booking estimates.',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    'https://github.com/renellerobief16-source/partyneeds',
    'https://github.com/renellerobief16-source/partyneeds',
    ARRAY['JavaScript', 'HTML5', 'CSS3'],
    'Repository',
    4
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  live_url = EXCLUDED.live_url,
  github_url = EXCLUDED.github_url,
  tools = EXCLUDED.tools,
  badge = EXCLUDED.badge,
  order_index = EXCLUDED.order_index;

-- Seed Video Edits
INSERT INTO public.video_edits (id, title, category, duration, software, description, thumbnail, preview_video, highlight, badge, order_index)
VALUES
  (
    'cinematic-reel',
    'Cinematic Brand Commercial Reel',
    'Commercial & Promo',
    '0:45',
    ARRAY['Premiere Pro', 'After Effects', 'DaVinci Resolve'],
    'Fast-paced kinetic edit featuring dramatic speed ramps, sound design, LUT color grading, and dynamic audio-visual synchronizations.',
    'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1200&q=80',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'Speed ramping & Sound design',
    'Featured',
    1
  ),
  (
    'social-media-promo',
    'High-Energy Social Media Reel & Shorts',
    'Social Media / TikTok',
    '0:30',
    ARRAY['Premiere Pro', 'CapCut Pro', 'After Effects'],
    'Engaging 9:16 vertical video edit with animated kinetic subtitles, beat-matching zoom transitions, and vibrant overlays designed for maximum retention.',
    'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'Kinetic subtitles & Beat sync',
    'Viral Format',
    2
  ),
  (
    'motion-graphics-vfx',
    '3D Motion Graphics & Logo Intro',
    'Visual Effects (VFX)',
    '0:15',
    ARRAY['After Effects', 'Blender', 'Illustrator'],
    'Futuristic glowing logo animation with particle trails, neon displacement maps, and custom sci-fi sound effects.',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    'Particle simulation & 3D Lighting',
    '3D Animation',
    3
  ),
  (
    'event-highlight',
    'Event Celebration & Festival Highlight',
    'Event Documentary',
    '1:20',
    ARRAY['Premiere Pro', 'DaVinci Resolve'],
    'Emotional storytelling edit capturing live event crowds, celebration atmosphere, stage lighting, and synchronized orchestral-electronic audio.',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    'Multicam editing & Audio mix',
    'Documentary',
    4
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  duration = EXCLUDED.duration,
  software = EXCLUDED.software,
  description = EXCLUDED.description,
  thumbnail = EXCLUDED.thumbnail,
  preview_video = EXCLUDED.preview_video,
  highlight = EXCLUDED.highlight,
  badge = EXCLUDED.badge,
  order_index = EXCLUDED.order_index;

-- Seed Posters
INSERT INTO public.posters (id, title, category, software, description, image, dimensions, aspect, badge, order_index)
VALUES
  (
    'tech-summit-poster',
    'Cyberpunk Tech Summit 2026',
    'Event Poster',
    ARRAY['Photoshop', 'Illustrator'],
    'High-contrast futuristic event poster with holographic glass typography, neon wireframes, and modern grid layout.',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    'A3 • 300 DPI Print Ready',
    '3:4',
    'Featured Artwork',
    1
  ),
  (
    'healthcare-poster',
    'Clinic Health & Wellness Campaign',
    'Healthcare / Commercial',
    ARRAY['Photoshop', 'Figma'],
    'Clean, trustworthy medical promotional poster highlighting patient consultation services, preventive care, and emergency hotlines.',
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
    '1080 x 1350px • Social & Print',
    '3:4',
    'Commercial',
    2
  ),
  (
    'music-festival-poster',
    'Neon Pulse Music Festival',
    'Entertainment Poster',
    ARRAY['Photoshop', 'Illustrator'],
    'Vibrant festival artwork with fluid 3D abstract waves, electric cyan and magenta gradients, and expressive display typography.',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    'A2 • 300 DPI',
    '3:4',
    'Festival Art',
    3
  ),
  (
    'minimalist-brand-poster',
    'Modern Minimalist Studio Branding',
    'Brand Identity',
    ARRAY['Illustrator', 'InDesign'],
    'Swiss-inspired editorial poster showcasing balanced negative space, refined serif and sans-serif pairings, and monochrome geometry.',
    'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1200&q=80',
    'A3 • Editorial Series',
    '3:4',
    'Branding',
    4
  ),
  (
    'partyneeds-promo-poster',
    'PartyNeeds Grand Event Expo',
    'Advertising Poster',
    ARRAY['Photoshop', 'Canva Pro'],
    'Festive commercial advertising poster featuring party rental packages, balloon arch graphics, and promotional discount badges.',
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
    '1080 x 1920px • Story & Print',
    '3:4',
    'Marketing',
    5
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  software = EXCLUDED.software,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  dimensions = EXCLUDED.dimensions,
  aspect = EXCLUDED.aspect,
  badge = EXCLUDED.badge,
  order_index = EXCLUDED.order_index;

-- Seed Certificates
INSERT INTO public.certificates (id, title, issuer, issue_date, credential_id, category, skills, description, image, badge, order_index)
VALUES
  (
    'cert-fullstack',
    'Full-Stack Web Development & React Architecture',
    'FreeCodeCamp & OpenJS Foundation',
    '2025',
    'FCC-FSWD-98214',
    'Software Engineering',
    ARRAY['React.js', 'JavaScript (ES6+)', 'Node.js', 'REST APIs', 'Git'],
    'Comprehensive certification covering component architecture, reactive state management, asynchronous REST APIs, and production deployment standards.',
    'https://images.unsplash.com/photo-1523289333742-be1143f6b766?auto=format&fit=crop&w=1200&q=80',
    'Verified Certificate',
    1
  ),
  (
    'cert-react',
    'React Specialist & Modern Frontend Development',
    'Meta Frontend Professional Certification',
    '2024',
    'META-FRONTEND-55421',
    'Frontend Specialization',
    ARRAY['React 18/19', 'Hooks', 'Context API', 'Tailwind CSS', 'Vite'],
    'Specialized certification validating proficiency in reusable UI design systems, performance optimization, and responsive mobile-first interfaces.',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    'Verified Specialist',
    2
  ),
  (
    'cert-video-motion',
    'Video Editing & Motion Graphics Masterclass',
    'Adobe Certified Professional (ACP)',
    '2024',
    'ACP-PR-AE-77192',
    'Multimedia & Video',
    ARRAY['Premiere Pro', 'After Effects', 'Color Grading', 'Sound Design', 'VFX'],
    'Industry credential demonstrating mastery of non-linear video editing, multi-camera syncing, keyframe animations, and cinematic color correction.',
    'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
    'Professional Credential',
    3
  ),
  (
    'cert-graphic-design',
    'Graphic Design, Typography & Brand Identity',
    'Adobe Creative Cloud Certification',
    '2023',
    'ADOBE-PS-AI-38291',
    'Visual Design',
    ARRAY['Photoshop', 'Illustrator', 'Poster Design', 'Layout', 'Print Preparation'],
    'Advanced certification covering vector illustration, visual balance, print-ready typography, raster photo manipulation, and advertising poster layouts.',
    'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80',
    'Certified Designer',
    4
  ),
  (
    'cert-academic',
    'Academic Excellence & Dean''s Honor Recognition',
    'College of Computer Studies',
    '2023 — 2024',
    'CCS-HONOR-10928',
    'Academic & Tech Seminars',
    ARRAY['Algorithm Design', 'Database Systems', 'Software Engineering', 'Team Leadership'],
    'Conferred for maintaining top academic standing in Computer Science / Information Technology, software engineering capstone projects, and campus tech leadership.',
    'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=1200&q=80',
    'Dean''s Honor',
    5
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  issuer = EXCLUDED.issuer,
  issue_date = EXCLUDED.issue_date,
  credential_id = EXCLUDED.credential_id,
  category = EXCLUDED.category,
  skills = EXCLUDED.skills,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge,
  order_index = EXCLUDED.order_index;
