// Phase 17 — SmartCode Intelligence & Analytics Foundation (Mock Data)
// UI architecture only. No backend, no real calculations.

export type SmartCodeMatrixEntry = {
  code: string;
  entryCount: number;
  totalSmartPoints: number;
  validEntries: number;
  weeklyRank: number;
  lastUsed: string;
  trend: 'up' | 'down' | 'stable';
};

// Generate a representative sample of the 000-999 matrix (mock)
function generateMatrix(): SmartCodeMatrixEntry[] {
  const codes: SmartCodeMatrixEntry[] = [];
  const seedCodes = [
    '000', '007', '042', '100', '111', '123', '222', '303', '404',
    '505', '606', '707', '808', '909', '999', '314', '420', '555',
    '666', '777', '888', '147', '258', '369', '159', '357', '753',
    '951', '246', '864', '135', '791', '468', '213', '546', '879',
  ];
  for (const code of seedCodes) {
    const entryCount = Math.floor(Math.random() * 500) + 10;
    const validEntries = Math.floor(entryCount * (0.7 + Math.random() * 0.25));
    codes.push({
      code,
      entryCount,
      totalSmartPoints: entryCount * Math.floor(Math.random() * 50 + 10),
      validEntries,
      weeklyRank: 0,
      lastUsed: ['2 hrs ago', '5 hrs ago', '1 day ago', '3 days ago', '1 week ago'][Math.floor(Math.random() * 5)],
      trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable',
    });
  }
  codes.sort((a, b) => b.entryCount - a.entryCount);
  codes.forEach((c, i) => { c.weeklyRank = i + 1; });
  return codes;
}

export const smartCodeMatrix: SmartCodeMatrixEntry[] = generateMatrix();

// Live Statistics Cards
export const liveStats = {
  totalSubmitted: 12847,
  validated: 11203,
  pendingVerification: 1644,
  weeklyEligible: 3200,
  avgSmartPointsPerEntry: 34.5,
  mostActiveCode: '7 4 1',
  leastUsedCode: '0 0 0',
  highestGrowthCode: '5 5 5',
};

// Heat Map data — 100 cells (10x10 grid representing 000-999 ranges)
export type HeatCell = {
  range: string;
  intensity: 'low' | 'medium' | 'high' | 'extreme';
  value: number;
};

export const heatMapData: HeatCell[] = Array.from({ length: 100 }, (_, i) => {
  const start = i * 10;
  const ranges = ['low', 'medium', 'high', 'extreme'] as const;
  const r = Math.random();
  const intensity = r < 0.4 ? 'low' : r < 0.7 ? 'medium' : r < 0.9 ? 'high' : 'extreme';
  return {
    range: `${start.toString().padStart(3, '0')}-${(start + 9).toString().padStart(3, '0')}`,
    intensity: intensity as HeatCell['intensity'],
    value: Math.floor(Math.random() * 500),
  };
});

// Weekly Distribution Summary
export const weeklyDistribution = {
  primeWinner: '7 4 1',
  premiumWinner: '3 8 2',
  standardWinner: '6 0 9',
  totalParticipants: 12847,
  eligibleEntries: 3200,
  distributionStatus: 'Completed',
  vcosVerified: true,
};

// SmartCode Trends
export const codeTrends = {
  mostPopular: [
    { code: '7 4 1', count: 487, change: '+12%' },
    { code: '5 5 5', count: 412, change: '+8%' },
    { code: '3 1 4', count: 389, change: '+5%' },
    { code: '1 2 3', count: 356, change: '+3%' },
    { code: '9 9 9', count: 334, change: '+1%' },
  ],
  leastPopular: [
    { code: '0 0 0', count: 12, change: '-2%' },
    { code: '0 0 1', count: 18, change: '-1%' },
    { code: '0 1 0', count: 22, change: '0%' },
    { code: '1 0 0', count: 28, change: '-1%' },
    { code: '0 0 2', count: 31, change: '0%' },
  ],
  fastestGrowing: [
    { code: '5 5 5', growth: '+42%' },
    { code: '7 7 7', growth: '+35%' },
    { code: '8 8 8', growth: '+28%' },
    { code: '4 2 0', growth: '+22%' },
    { code: '3 1 4', growth: '+18%' },
  ],
  weeklyActivity: [
    { day: 'Mon', value: 1820 },
    { day: 'Tue', value: 2104 },
    { day: 'Wed', value: 1950 },
    { day: 'Thu', value: 2230 },
    { day: 'Fri', value: 2680 },
    { day: 'Sat', value: 1843 },
    { day: 'Sun', value: 220 },
  ],
  monthlyActivity: [
    { month: 'Jan', value: 8200 },
    { month: 'Feb', value: 9100 },
    { month: 'Mar', value: 10400 },
    { month: 'Apr', value: 11200 },
    { month: 'May', value: 12800 },
    { month: 'Jun', value: 12847 },
  ],
};

// Geographic Statistics
export type GeoStat = {
  id: string;
  country: string;
  state: string;
  district: string;
  city: string;
  entries: number;
  participation: string;
  rewardDistribution: string;
};

export const geoStats: GeoStat[] = [
  { id: 'g1', country: 'India', state: 'Karnataka', district: 'Bengaluru Urban', city: 'Bengaluru', entries: 3420, participation: '27%', rewardDistribution: '₹2,40,000' },
  { id: 'g2', country: 'India', state: 'Karnataka', district: 'Mysuru', city: 'Mysuru', entries: 1840, participation: '14%', rewardDistribution: '₹1,20,000' },
  { id: 'g3', country: 'India', state: 'Tamil Nadu', district: 'Chennai', city: 'Chennai', entries: 2230, participation: '18%', rewardDistribution: '₹1,80,000' },
  { id: 'g4', country: 'India', state: 'Maharashtra', district: 'Mumbai', city: 'Mumbai', entries: 2890, participation: '23%', rewardDistribution: '₹2,10,000' },
  { id: 'g5', country: 'India', state: 'Delhi', district: 'New Delhi', city: 'Delhi', entries: 1560, participation: '12%', rewardDistribution: '₹95,000' },
  { id: 'g6', country: 'India', state: 'Telangana', district: 'Hyderabad', city: 'Hyderabad', entries: 907, participation: '7%', rewardDistribution: '₹65,000' },
];

// Fraud Monitoring
export const fraudMonitoring = {
  status: 'Monitoring Active',
  duplicateDetection: { count: 0, status: 'Clear' },
  rapidEntryAlerts: { count: 2, status: 'Reviewing' },
  abnormalPatterns: { count: 0, status: 'Clear' },
  aiReviewQueue: { count: 2, status: 'Pending' },
};
