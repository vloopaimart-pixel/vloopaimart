/**
 * VLOOP Phase 15 — Digital Academy & Care OS
 * Mock/demo data only. No backend, no auth, no payment.
 */

export type CourseCategory = {
  id: string;
  name: string;
  icon: string;
  desc: string;
  courseCount: number;
  color: string;
};

export const courseCategories: CourseCategory[] = [
  { id: 'electrical', name: 'Electrical', icon: 'Zap', desc: 'Wiring, circuits, and electrical safety fundamentals', courseCount: 12, color: 'from-amber-400 to-amber-600' },
  { id: 'plumbing', name: 'Plumbing', icon: 'Wrench', desc: 'Pipe fitting, drainage, and water systems', courseCount: 8, color: 'from-vloop-400 to-vloop-600' },
  { id: 'electronics', name: 'Electronics Repair', icon: 'Cpu', desc: 'Device repair, soldering, and component diagnostics', courseCount: 15, color: 'from-success-500 to-success-700' },
  { id: 'fire-safety', name: 'Fire & Safety', icon: 'Flame', desc: 'Fire prevention, evacuation, and emergency response', courseCount: 6, color: 'from-red-400 to-red-600' },
  { id: 'ai-basics', name: 'AI Basics', icon: 'BrainCircuit', desc: 'Introduction to AI, ML, and everyday applications', courseCount: 10, color: 'from-vloop-500 to-vloop-700' },
  { id: 'cyber-security', name: 'Cyber Security', icon: 'ShieldCheck', desc: 'Online safety, data protection, and threat awareness', courseCount: 14, color: 'from-gray-600 to-gray-800' },
  { id: 'digital-marketing', name: 'Digital Marketing', icon: 'Megaphone', desc: 'SEO, social media, and online business growth', courseCount: 11, color: 'from-gold-400 to-gold-600' },
  { id: 'driving', name: 'Driving & Road Safety', icon: 'Car', desc: 'Safe driving practices and traffic awareness', courseCount: 7, color: 'from-success-600 to-success-800' },
  { id: 'personality', name: 'Personality Development', icon: 'Smile', desc: 'Communication, confidence, and leadership skills', courseCount: 9, color: 'from-pink-400 to-pink-600' },
  { id: 'business', name: 'Business Skills', icon: 'Briefcase', desc: 'Entrepreneurship, finance, and management essentials', courseCount: 13, color: 'from-vloop-600 to-vloop-800' },
];

export type Course = {
  id: string;
  title: string;
  categoryId: string;
  category: string;
  instructor: string;
  duration: string;
  lessons: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  language: string;
  thumbnail: string;
  rating: number;
  students: number;
  progress: number;
  description: string;
  isFeatured: boolean;
  isPopular: boolean;
  recentlyAdded: boolean;
  hasCertificate: boolean;
};

export const courses: Course[] = [
  {
    id: 'c1', title: 'Home Electrical Wiring Basics', categoryId: 'electrical', category: 'Electrical',
    instructor: 'Rajesh Kumar', duration: '4h 30m', lessons: 18, difficulty: 'Beginner', language: 'Hindi + English',
    thumbnail: 'https://images.pexels.com/photos/8003/pexels-photo-8003.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.7, students: 1240, progress: 65, isFeatured: true, isPopular: true, recentlyAdded: false, hasCertificate: true,
    description: 'Learn safe residential wiring, circuit basics, and electrical safety protocols.',
  },
  {
    id: 'c2', title: 'Pipe Fitting & Drainage Systems', categoryId: 'plumbing', category: 'Plumbing',
    instructor: 'Suresh Patel', duration: '3h 15m', lessons: 12, difficulty: 'Beginner', language: 'Hindi',
    thumbnail: 'https://images.pexels.com/photos/8961346/pexels-photo-8961346.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.5, students: 890, progress: 30, isFeatured: false, isPopular: false, recentlyAdded: true, hasCertificate: true,
    description: 'Master pipe installation, leak repair, and drainage system design.',
  },
  {
    id: 'c3', title: 'Smartphone Repair Masterclass', categoryId: 'electronics', category: 'Electronics Repair',
    instructor: 'Anil Verma', duration: '6h 45m', lessons: 24, difficulty: 'Intermediate', language: 'Hindi + English',
    thumbnail: 'https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.8, students: 2100, progress: 0, isFeatured: true, isPopular: true, recentlyAdded: false, hasCertificate: true,
    description: 'Complete guide to smartphone diagnostics, screen replacement, and soldering.',
  },
  {
    id: 'c4', title: 'Fire Safety & Emergency Evacuation', categoryId: 'fire-safety', category: 'Fire & Safety',
    instructor: 'Mohan Reddy', duration: '2h 00m', lessons: 8, difficulty: 'Beginner', language: 'Hindi + English',
    thumbnail: 'https://images.pexels.com/photos/8961065/pexels-photo-8961065.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.6, students: 560, progress: 100, isFeatured: false, isPopular: false, recentlyAdded: true, hasCertificate: true,
    description: 'Fire prevention, extinguisher usage, and building evacuation procedures.',
  },
  {
    id: 'c5', title: 'AI for Everyday Life', categoryId: 'ai-basics', category: 'AI Basics',
    instructor: 'Dr. Priya Sharma', duration: '5h 20m', lessons: 20, difficulty: 'Beginner', language: 'English',
    thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.9, students: 3400, progress: 45, isFeatured: true, isPopular: true, recentlyAdded: false, hasCertificate: true,
    description: 'Understand AI, machine learning, and how they impact daily life.',
  },
  {
    id: 'c6', title: 'Cyber Security Essentials', categoryId: 'cyber-security', category: 'Cyber Security',
    instructor: 'Vikram Singh', duration: '4h 10m', lessons: 16, difficulty: 'Intermediate', language: 'Hindi + English',
    thumbnail: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.7, students: 1800, progress: 0, isFeatured: false, isPopular: true, recentlyAdded: true, hasCertificate: true,
    description: 'Protect yourself online — passwords, phishing, and data privacy.',
  },
  {
    id: 'c7', title: 'Digital Marketing Fundamentals', categoryId: 'digital-marketing', category: 'Digital Marketing',
    instructor: 'Kavya Nair', duration: '5h 50m', lessons: 22, difficulty: 'Beginner', language: 'English',
    thumbnail: 'https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.6, students: 1500, progress: 20, isFeatured: false, isPopular: true, recentlyAdded: false, hasCertificate: true,
    description: 'SEO, social media marketing, and growing your business online.',
  },
  {
    id: 'c8', title: 'Safe Driving Practices', categoryId: 'driving', category: 'Driving & Road Safety',
    instructor: 'Arjun Das', duration: '2h 30m', lessons: 10, difficulty: 'Beginner', language: 'Hindi',
    thumbnail: 'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.4, students: 720, progress: 0, isFeatured: false, isPopular: false, recentlyAdded: true, hasCertificate: false,
    description: 'Traffic rules, defensive driving, and road safety awareness.',
  },
  {
    id: 'c9', title: 'Confidence & Communication Skills', categoryId: 'personality', category: 'Personality Development',
    instructor: 'Meena Iyer', duration: '3h 40m', lessons: 14, difficulty: 'Beginner', language: 'Hindi + English',
    thumbnail: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.8, students: 2600, progress: 80, isFeatured: true, isPopular: true, recentlyAdded: false, hasCertificate: true,
    description: 'Build confidence, improve communication, and develop leadership qualities.',
  },
  {
    id: 'c10', title: 'Business Startup Essentials', categoryId: 'business', category: 'Business Skills',
    instructor: 'Ramesh Gupta', duration: '6h 00m', lessons: 25, difficulty: 'Intermediate', language: 'Hindi + English',
    thumbnail: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.7, students: 1900, progress: 0, isFeatured: false, isPopular: true, recentlyAdded: true, hasCertificate: true,
    description: 'From idea to execution — planning, finance, and launching your business.',
  },
];

export type Lesson = {
  id: string;
  courseId: string;
  title: string;
  duration: string;
  completed: boolean;
  isCurrent?: boolean;
};

export const courseLessons: Record<string, Lesson[]> = {
  c1: [
    { id: 'l1', courseId: 'c1', title: 'Introduction to Electrical Safety', duration: '12 min', completed: true },
    { id: 'l2', courseId: 'c1', title: 'Understanding Circuits', duration: '18 min', completed: true },
    { id: 'l3', courseId: 'c1', title: 'Wire Types & Gauges', duration: '15 min', completed: true },
    { id: 'l4', courseId: 'c1', title: 'Installing Switches & Sockets', duration: '22 min', completed: false, isCurrent: true },
    { id: 'l5', courseId: 'c1', title: 'Circuit Breakers & Fuses', duration: '20 min', completed: false },
    { id: 'l6', courseId: 'c1', title: 'Grounding & Earthing', duration: '16 min', completed: false },
    { id: 'l7', courseId: 'c1', title: 'Safety Gear & Best Practices', duration: '14 min', completed: false },
  ],
};

export type Certificate = {
  id: string;
  courseId: string;
  courseName: string;
  issuedDate: string;
  score: number;
};

export const certificates: Certificate[] = [
  { id: 'cert1', courseId: 'c4', courseName: 'Fire Safety & Emergency Evacuation', issuedDate: 'Jul 2, 2026', score: 92 },
  { id: 'cert2', courseId: 'c9', courseName: 'Confidence & Communication Skills', issuedDate: 'Jun 28, 2026', score: 88 },
];

// ============================================================
// CARE OS DATA
// ============================================================

export type CareMetric = {
  id: string;
  label: string;
  value: string;
  sub: string;
  icon: string;
  color: string;
};

export const careMetrics: CareMetric[] = [
  { id: 'food', label: 'Food Bank', value: '12,450', sub: 'Meals sponsored', icon: 'Utensils', color: 'from-success-500 to-success-700' },
  { id: 'mental', label: 'Mental Health', value: '340', sub: 'Sessions booked', icon: 'HeartPulse', color: 'from-pink-400 to-pink-600' },
  { id: 'disaster', label: 'Disaster Response', value: '85', sub: 'Active volunteers', icon: 'Siren', color: 'from-red-400 to-red-600' },
  { id: 'skill', label: 'Skill to Job', value: '156', sub: 'Members placed', icon: 'Briefcase', color: 'from-vloop-500 to-vloop-700' },
  { id: 'community', label: 'Community Volunteers', value: '420', sub: 'Active members', icon: 'Users', color: 'from-gold-400 to-gold-600' },
  { id: 'impact', label: 'Social Impact', value: '₹4.2L', sub: 'Value created', icon: 'TrendingUp', color: 'from-vloop-600 to-vloop-800' },
];

export const foodBankStats = {
  mealsSponsored: 12450,
  mealsDelivered: 11890,
  familiesHelped: 820,
  liveCounter: 3,
  donationGoal: 50000,
  donationCurrent: 37500,
};

export type SupportCard = {
  id: string;
  title: string;
  desc: string;
  icon: string;
  available: string;
  color: string;
};

export const mentalHealthSupport: SupportCard[] = [
  { id: 'm1', title: 'Psychologist', desc: 'One-on-one therapy sessions with certified psychologists', icon: 'Brain', available: '12 available', color: 'from-pink-400 to-pink-600' },
  { id: 'm2', title: 'Psychiatrist', desc: 'Medical consultation and treatment plans', icon: 'Stethoscope', available: '5 available', color: 'from-vloop-500 to-vloop-700' },
  { id: 'm3', title: 'Student Counseling', desc: 'Academic stress, career guidance, and emotional support', icon: 'GraduationCap', available: '8 available', color: 'from-success-500 to-success-700' },
  { id: 'm4', title: 'Family Counseling', desc: 'Relationship and family conflict resolution', icon: 'Users', available: '6 available', color: 'from-gold-400 to-gold-600' },
  { id: 'm5', title: 'Emergency Support', desc: '24/7 crisis helpline and immediate intervention', icon: 'PhoneCall', available: 'Always available', color: 'from-red-500 to-red-700' },
];

export const disasterResponse = {
  registered: true,
  trainingStatus: 'Certified',
  trainingProgress: 100,
  badge: 'Rescue Volunteer Level 2',
  emergencyContact: '+91 1800 555 911',
  responseAreas: ['Bengaluru Urban', 'Bengaluru Rural', 'Mysuru', 'Mandya'],
  trainingModules: [
    { id: 'dm1', title: 'Basic Rescue Operations', completed: true },
    { id: 'dm2', title: 'First Aid & CPR', completed: true },
    { id: 'dm3', title: 'Flood Response Training', completed: true },
    { id: 'dm4', title: 'Fire Emergency Protocol', completed: true },
    { id: 'dm5', title: 'Advanced Disaster Management', completed: false },
  ],
};

export type JobListing = {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  posted: string;
  status: 'available' | 'applied' | 'interview' | 'offered';
  matchScore: number;
};

export const jobListings: JobListing[] = [
  { id: 'j1', title: 'Electrician (Residential)', company: 'PowerHome Services', location: 'Bengaluru', salary: '₹18,000 - ₹25,000', type: 'Full-time', posted: '2 days ago', status: 'available', matchScore: 92 },
  { id: 'j2', title: 'Plumbing Technician', company: 'AquaFix Solutions', location: 'Bengaluru', salary: '₹15,000 - ₹22,000', type: 'Full-time', posted: '1 day ago', status: 'applied', matchScore: 88 },
  { id: 'j3', title: 'Mobile Repair Specialist', company: 'FixIt Mobile', location: 'Mysuru', salary: '₹20,000 - ₹28,000', type: 'Full-time', posted: '3 days ago', status: 'interview', matchScore: 95 },
  { id: 'j4', title: 'Fire Safety Officer', company: 'SecureBuild Corp', location: 'Bengaluru', salary: '₹25,000 - ₹35,000', type: 'Full-time', posted: '5 days ago', status: 'offered', matchScore: 90 },
  { id: 'j5', title: 'Digital Marketing Executive', company: 'GrowthLab Digital', location: 'Remote', salary: '₹22,000 - ₹30,000', type: 'Remote', posted: '1 week ago', status: 'available', matchScore: 85 },
  { id: 'j6', title: 'Field Sales Representative', company: 'VLOOP Mart', location: 'Bengaluru', salary: '₹16,000 - ₹24,000', type: 'Full-time', posted: '4 days ago', status: 'available', matchScore: 78 },
];

export const skillToJobStats = {
  availableJobs: 142,
  certifiedMembers: 380,
  nearbyOpportunities: 28,
  employerRequests: 15,
};
