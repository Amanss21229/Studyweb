-- AimAi Database Setup Script for Neon PostgreSQL
-- This script creates all necessary tables and initial data
-- Run this in your Neon SQL Editor if tables are missing

-- ============================================
-- PART 0: ENABLE REQUIRED EXTENSIONS
-- ============================================

-- Enable pgcrypto extension for gen_random_uuid() function
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================
-- PART 1: CREATE TABLES
-- ============================================

-- Sessions table for storing user sessions
CREATE TABLE IF NOT EXISTS sessions (
  sid VARCHAR NOT NULL PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions(expire);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email VARCHAR UNIQUE,
  first_name VARCHAR,
  last_name VARCHAR,
  profile_image_url VARCHAR,
  name TEXT,
  gender VARCHAR(10),
  class VARCHAR(20),
  stream VARCHAR(50),
  is_profile_complete BOOLEAN NOT NULL DEFAULT false,
  language VARCHAR(10) NOT NULL DEFAULT 'english',
  theme VARCHAR(10) NOT NULL DEFAULT 'light',
  daily_usage_minutes INTEGER NOT NULL DEFAULT 0,
  last_usage_reset TIMESTAMP NOT NULL DEFAULT NOW(),
  conversation_preferences JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id VARCHAR REFERENCES users(id),
  title TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  conversation_id VARCHAR NOT NULL REFERENCES conversations(id),
  question_text TEXT NOT NULL,
  input_type VARCHAR(10) NOT NULL,
  subject VARCHAR(100),
  chapter TEXT,
  topic TEXT,
  image_url TEXT,
  audio_url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Solutions table
CREATE TABLE IF NOT EXISTS solutions (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  question_id VARCHAR NOT NULL REFERENCES questions(id),
  solution_text TEXT NOT NULL,
  explanation TEXT,
  subject VARCHAR(100) NOT NULL,
  chapter TEXT,
  topic TEXT,
  neet_jee_pyq JSONB,
  language VARCHAR(10) NOT NULL,
  share_url TEXT NOT NULL UNIQUE,
  is_public BOOLEAN NOT NULL DEFAULT false,
  is_bookmarked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Exam Updates table
CREATE TABLE IF NOT EXISTS exam_updates (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  exam_type VARCHAR(10) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  source_url TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT true,
  published_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(exam_type, title)
);

-- Exam Criteria table
CREATE TABLE IF NOT EXISTS exam_criteria (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  exam_type VARCHAR(10) NOT NULL UNIQUE,
  pattern TEXT NOT NULL,
  criteria TEXT NOT NULL,
  syllabus JSONB NOT NULL,
  last_updated TIMESTAMP NOT NULL DEFAULT NOW()
);

-- API Keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id VARCHAR REFERENCES users(id),
  key VARCHAR(64) NOT NULL UNIQUE,
  name TEXT NOT NULL,
  last_used TIMESTAMP,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================
-- PART 2: INSERT INITIAL EXAM DATA
-- ============================================

-- Clear existing exam data (optional - comment out if you want to keep existing data)
-- DELETE FROM exam_updates;
-- DELETE FROM exam_criteria;

-- Insert NEET Criteria (idempotent - will update if exists)
INSERT INTO exam_criteria (exam_type, pattern, criteria, syllabus, last_updated)
VALUES (
  'neet',
  'NEET (UG) Exam Pattern 2025:

• Mode of Exam: Pen and Paper (Offline)
• Duration: 3 hours 20 minutes
• Total Questions: 200 (180 to be attempted)
• Total Marks: 720
• Medium: 13 Languages (English, Hindi, Assamese, Bengali, Gujarati, Kannada, Malayalam, Marathi, Odia, Punjabi, Tamil, Telugu, Urdu)
• Marking Scheme: +4 for correct answer, -1 for incorrect answer
• Question Paper Distribution:
  - Physics: 50 questions (45 to be attempted)
  - Chemistry: 50 questions (45 to be attempted)
  - Biology (Botany): 50 questions (45 to be attempted)
  - Biology (Zoology): 50 questions (45 to be attempted)
• Each section has two parts: Section A (35 questions - all compulsory) and Section B (15 questions - attempt any 10)',
  
  'NEET Eligibility Criteria 2025:

• Age Limit:
  - Minimum: 17 years as of 31st December 2025
  - Maximum: No upper age limit (as per Supreme Court directive)

• Educational Qualification:
  - Must have passed 10+2 or equivalent with Physics, Chemistry, Biology/Biotechnology and English
  - Minimum marks: 50% for General category, 40% for SC/ST/OBC, 45% for PwD
  - Students appearing in 12th can also apply

• Nationality:
  - Indian Nationals
  - NRIs
  - OCIs
  - PIOs
  - Foreign Nationals

• Number of Attempts: No restriction on number of attempts

• Subjects Requirement: Physics, Chemistry, Biology (Botany & Zoology) as compulsory subjects in 10+2',
  
  '{"subjects":[{"name":"Physics","topics":["Physical World and Measurement","Kinematics","Laws of Motion","Work, Energy and Power","Motion of System of Particles and Rigid Body","Gravitation","Properties of Bulk Matter","Thermodynamics","Kinetic Theory of Gases","Oscillations and Waves","Electrostatics","Current Electricity","Magnetic Effects of Current and Magnetism","Electromagnetic Induction and Alternating Currents","Electromagnetic Waves","Optics","Dual Nature of Matter and Radiation","Atoms and Nuclei","Electronic Devices","Communication Systems"]},{"name":"Chemistry","topics":["Some Basic Concepts of Chemistry","Structure of Atom","Classification of Elements and Periodicity","Chemical Bonding and Molecular Structure","States of Matter","Thermodynamics","Equilibrium","Redox Reactions","Hydrogen","s-Block Elements","p-Block Elements","Organic Chemistry (Basic Principles)","Hydrocarbons","Environmental Chemistry","Solid State","Solutions","Electrochemistry","Chemical Kinetics","Surface Chemistry","d and f Block Elements","Coordination Compounds","Haloalkanes and Haloarenes","Alcohols, Phenols and Ethers","Aldehydes, Ketones and Carboxylic Acids","Organic Compounds Containing Nitrogen","Biomolecules","Polymers","Chemistry in Everyday Life"]},{"name":"Biology (Botany)","topics":["Diversity in Living World","Structural Organisation in Plants","Cell Structure and Function","Plant Physiology","Reproduction in Plants","Genetics and Evolution","Biology and Human Welfare","Biotechnology and its Applications","Ecology and Environment"]},{"name":"Biology (Zoology)","topics":["Diversity in Living World","Structural Organisation in Animals","Cell Structure and Function","Human Physiology","Reproduction in Organisms","Genetics and Evolution","Biology and Human Welfare","Biotechnology and its Applications","Ecology and Environment"]}]}',
  NOW()
)
ON CONFLICT (exam_type) DO UPDATE SET
  pattern = EXCLUDED.pattern,
  criteria = EXCLUDED.criteria,
  syllabus = EXCLUDED.syllabus,
  last_updated = EXCLUDED.last_updated;

-- Insert JEE Criteria (idempotent - will update if exists)
INSERT INTO exam_criteria (exam_type, pattern, criteria, syllabus, last_updated)
VALUES (
  'jee',
  'JEE Main Exam Pattern 2025:

• Mode of Exam: Computer Based Test (CBT)
• Number of Papers: 2 (Paper 1 for B.E./B.Tech, Paper 2 for B.Arch/B.Planning)
• Duration: 3 hours (4 hours for PwD candidates)
• Total Questions (Paper 1): 90 questions
• Total Marks (Paper 1): 300
• Medium: 13 Languages
• Sessions per year: 2 (January and April)
• Negative Marking: -1 for incorrect answer in MCQs

Paper 1 (B.E./B.Tech) Distribution:
  - Physics: 30 questions (20 MCQs + 10 Numerical)
  - Chemistry: 30 questions (20 MCQs + 10 Numerical)
  - Mathematics: 30 questions (20 MCQs + 10 Numerical)
  
• MCQ Section: 4 options, 1 correct (+4 for correct, -1 for incorrect)
• Numerical Section: No negative marking, answer as integer value 0-9999',
  
  'JEE Main Eligibility Criteria 2025:

• Age Limit:
  - No age limit for appearing in JEE Main
  - For NITs, IIITs: Born on or after October 1, 2000 (5-year relaxation for SC/ST/PwD)

• Educational Qualification:
  - Must have passed 10+2 or equivalent with Physics, Chemistry and Mathematics
  - Minimum 75% marks in 12th (65% for SC/ST) or top 20 percentile in respective board
  - Students appearing in 12th can also apply

• Number of Attempts:
  - Can appear for JEE Main in any number of years
  - Maximum 6 attempts allowed (can appear in consecutive years after passing 12th)

• Subjects Requirement: Physics and Mathematics compulsory + Chemistry/Biology/Biotechnology/Technical Vocational Subject

• Nationality: Indian, NRI, OCI, PIO, Foreign Nationals eligible',
  
  '{"subjects":[{"name":"Mathematics","topics":["Sets, Relations and Functions","Complex Numbers and Quadratic Equations","Matrices and Determinants","Permutations and Combinations","Mathematical Induction","Binomial Theorem","Sequences and Series","Limit, Continuity and Differentiability","Integral Calculus","Differential Equations","Coordinate Geometry","Three Dimensional Geometry","Vector Algebra","Statistics and Probability","Trigonometry","Mathematical Reasoning"]},{"name":"Physics","topics":["Physics and Measurement","Kinematics","Laws of Motion","Work, Energy and Power","Rotational Motion","Gravitation","Properties of Solids and Liquids","Thermodynamics","Kinetic Theory of Gases","Oscillations and Waves","Electrostatics","Current Electricity","Magnetic Effects of Current","Magnetism and Matter","Electromagnetic Induction and AC","Electromagnetic Waves","Optics","Dual Nature of Matter","Atoms and Nuclei","Electronic Devices","Communication Systems","Experimental Skills"]},{"name":"Chemistry","topics":["Some Basic Concepts in Chemistry","States of Matter","Atomic Structure","Chemical Bonding and Molecular Structure","Chemical Thermodynamics","Solutions","Equilibrium","Redox Reactions and Electrochemistry","Chemical Kinetics","Surface Chemistry","Classification of Elements","General Principles of Extraction of Metals","Hydrogen","s-Block Elements","p-Block Elements","d and f Block Elements","Coordination Compounds","Environmental Chemistry","Purification and Characterisation of Organic Compounds","Hydrocarbons","Organic Compounds with Functional Groups","Organic Compounds Containing Nitrogen","Biomolecules","Principles Related to Practical Chemistry","Polymers","Chemistry in Everyday Life"]}]}',
  NOW()
)
ON CONFLICT (exam_type) DO UPDATE SET
  pattern = EXCLUDED.pattern,
  criteria = EXCLUDED.criteria,
  syllabus = EXCLUDED.syllabus,
  last_updated = EXCLUDED.last_updated;

-- Insert NEET Updates (idempotent - will skip if exists)
INSERT INTO exam_updates (exam_type, title, description, source_url, is_verified, published_at)
VALUES 
(
  'neet',
  'NEET UG 2025 Registration Expected to Begin in January 2025',
  'NTA is expected to release the NEET UG 2025 application form in the first week of January 2025. Key points:

• Online registration will be available on the official NTA website
• Last date to apply is expected to be in February 2025
• Application fee: ₹1700 for General/OBC, ₹1600 for SC/ST/PwD, ₹9000 for candidates from abroad
• Candidates must upload recent photographs and signature in specified format
• Corrections window will be provided after form submission',
  'https://nta.ac.in/',
  true,
  '2025-10-01 10:00:00+05:30'
),
(
  'neet',
  'NEET 2025 Exam Date Announced - First Sunday of May 2025',
  'NTA has announced that NEET UG 2025 will be conducted on the first Sunday of May 2025. Important highlights:

• Exam Date: First Sunday of May 2025
• Exam will be conducted in single shift from 2:00 PM to 5:20 PM
• Admit cards will be released 15 days before the exam
• No changes will be made to exam cities after form submission
• Result is expected to be declared within 3-4 weeks of exam',
  'https://nta.ac.in/',
  true,
  '2025-09-28 11:30:00+05:30'
),
(
  'neet',
  'NEET 2025 Syllabus Remains Unchanged - Based on NCERT',
  'NTA confirms that NEET 2025 syllabus will remain the same as previous year:

• Syllabus based on Class XI and XII NCERT curriculum
• No changes in exam pattern or marking scheme
• Physics: 45 questions from Class XI and XII
• Chemistry: 45 questions from Class XI and XII (Physical, Organic, Inorganic)
• Biology: 90 questions (45 Botany + 45 Zoology)
• All questions will be MCQ based with single correct answer',
  'https://nta.ac.in/',
  true,
  '2025-09-25 09:00:00+05:30'
)
ON CONFLICT (exam_type, title) DO NOTHING;

-- Insert JEE Updates (idempotent - will skip if exists)
INSERT INTO exam_updates (exam_type, title, description, source_url, is_verified, published_at)
VALUES 
(
  'jee',
  'JEE Main 2025 Session 1 Registration Starts from October 28, 2024',
  'NTA has announced the registration schedule for JEE Main 2025 Session 1:

• Registration Start Date: October 28, 2024
• Last Date to Apply: November 22, 2024 (up to 9 PM)
• Correction Window: November 24-25, 2024
• Exam Dates: January 22-31, 2025
• Application Fee: ₹1000 for General/OBC (Male), ₹800 for General/OBC (Female), ₹500 for SC/ST/PwD/Transgender
• Choice of 7 exam cities can be selected during registration',
  'https://jeemain.nta.nic.in/',
  true,
  '2025-10-15 10:00:00+05:30'
),
(
  'jee',
  'JEE Main 2025 Session 2 Dates Announced - April 2025',
  'NTA has released the schedule for JEE Main 2025 Session 2:

• Registration Period: February 1-28, 2025
• Exam Dates: April 1-15, 2025
• Admit Card Release: 3 days before exam date
• Result Declaration: By April 25, 2025
• Candidates can appear in both sessions to improve their scores
• Best of two NTA scores will be considered for JEE Advanced qualification',
  'https://jeemain.nta.nic.in/',
  true,
  '2025-10-10 14:00:00+05:30'
),
(
  'jee',
  'New Pattern for JEE Main 2025 - Section B Optional Questions Increased',
  'Important changes in JEE Main 2025 exam pattern:

• Section A: 20 MCQs (all compulsory) from each subject
• Section B: 10 Numerical questions (attempt any 5) from each subject
• Total questions per subject: 30 (25 to be attempted)
• No negative marking in Section B numerical questions
• Numerical answers to be filled as integer value (0-9999)
• This pattern gives more flexibility to candidates
• Focus on conceptual understanding and problem-solving ability',
  'https://jeemain.nta.nic.in/',
  true,
  '2025-10-05 09:30:00+05:30'
)
ON CONFLICT (exam_type, title) DO NOTHING;

-- ============================================
-- PART 3: VERIFICATION QUERIES
-- ============================================

-- Run these queries to verify the setup:

-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check exam criteria count (should be 2: NEET and JEE)
SELECT exam_type, COUNT(*) as count 
FROM exam_criteria 
GROUP BY exam_type;

-- Check exam updates count (should be 3 for each exam)
SELECT exam_type, COUNT(*) as count 
FROM exam_updates 
GROUP BY exam_type;

-- ============================================
-- PART 4: USEFUL MAINTENANCE QUERIES
-- ============================================

-- To delete all data (use with caution):
-- TRUNCATE TABLE api_keys, solutions, questions, conversations, exam_updates, exam_criteria, users CASCADE;

-- To check session count:
-- SELECT COUNT(*) FROM sessions;

-- To clean old sessions (older than 7 days):
-- DELETE FROM sessions WHERE expire < NOW();
