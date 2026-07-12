# WEEKLY SMARTCODE AI CORE ENGINE

**Phase 40 — VLOOP Weekly SmartCode Challenge FINAL CORE**
**Version:** 40.0.0
**Date:** 2026-07-02
**Status:** COMPLETE — PERMANENT FOUNDATION

---

## LOCKED BASE RULES

These rules are **PERMANENTLY LOCKED** and cannot be modified:

| Rule | Formula | Status |
|------|---------|--------|
| Purchase Points | **₹40 = 1 SmartPoint** | LOCKED |
| Care Club Points | **₹10 = 5 SmartPoints** | LOCKED |
| SmartCode Range | **000–999** | LOCKED |

All SmartCode features must use ONLY these conversion rules.

---

## ARCHITECTURE SUMMARY

### Database Migration 069
- **Tables Created:** 14 new tables
- **RLS Policies:** 20+ policies across all tables
- **Indexes:** 15+ indexes for query optimization
- **Triggers:** 5 triggers for auto-updating timestamps
- **Functions:** `calculate_smartpoints_from_purchase()`, `calculate_smartpoints_from_careclub()`, `get_current_week_period()`, `validate_smartcode()`, `register_smartcode()`, `get_smartcode_dashboard_stats()`

---

## SECTION 1: SMARTCODE ENTRY METHODS

### Method 1: AI Automatic SmartCode
- System creates SmartCodes automatically
- Uses available SmartPoints
- No user intervention required
- Priority: 1

### Method 2: Manual SmartCode
- Customer creates unlimited SmartCodes
- Support duplicate codes with different point allocations
- Examples:
  - `542 = 2 Points`
  - `764 = 5 Points`
  - `010 = 10 Points`
  - `542 = 20 Points` (duplicate allowed)
  - `999 = 1 Point`
- Priority: 2

### Method 3: Offline OCR SmartCode
- Customer writes SmartCodes on plain paper
- Takes photo and uploads
- AI OCR reads:
  - SmartCode (000-999)
  - Point allocation
  - Receipt verification
  - Customer verification
  - Duplicate detection
- Automatic registration
- Max 100 entries per day
- Priority: 3

### Method 4: Voice SmartCode (Future)
- Customer speaks "Five Four Two"
- Converts to `542`
- Multi-language support:
  - English (en)
  - Malayalam (ml)
  - Hindi (hi)
  - Arabic (ar)
- Max 50 entries per day
- Priority: 4

### Method 5: WhatsApp SmartCode (Future)
- Customer sends `542 = 10`
- AI automatically registers SmartCode
- Max 50 entries per day
- Priority: 5

---

## SECTION 2: MULTI SMARTCODE ENGINE

### Features
- Unlimited SmartCodes
- Unlimited Entries
- Unlimited Point Distribution
- 000–999 range support
- Repeated codes allowed
- Different point values allowed
- One-point entries allowed
- Large-point entries allowed
- AI validates everything

### Database Structure

**smartcode_entries Table:**

| Field | Type | Purpose |
|-------|------|---------|
| user_id | uuid | User reference |
| week_period | text | ISO week (YYYY-WW) |
| smartcode | text | 3-digit code (000-999) |
| point_allocation | integer | Points assigned |
| entry_method | enum | 5 methods |
| source_reference | text | Reference ID |
| receipt_url | text | Receipt image |
| receipt_verified | boolean | OCR verification |
| is_duplicate | boolean | Duplicate flag |
| ai_validation_status | enum | pending/validated/rejected/requires_review |
| ai_confidence_score | numeric | AI confidence |
| fraud_score | numeric | 0-100 |
| fraud_flags | jsonb | Flag details |
| requires_manual_review | boolean | Review needed |
| is_winner | boolean | Winner status |
| winner_pool_type | enum | prime/premium/standard |

---

## SECTION 3: LOCKED REWARD POOLS

### AI ASSIGNS ONLY — USERS NEVER SELECT

| Pool | Amount | Position | Status |
|------|--------|----------|--------|
| **Prime Reward** | ₹400 | First Prize | LOCKED |
| **Premium Reward** | ₹200 | Second Prize | LOCKED |
| **Standard Reward** | ₹100 | Third Prize | LOCKED |

**Rules:**
- Reward pools assigned ONLY by AI
- Never manually selectable by users
- is_locked = true
- ai_assignable_only = true

---

## SECTION 4: AI WEEKLY REWARD ENGINE

### AI Evaluation Factors

| Factor | Weight | Description |
|--------|--------|-------------|
| SmartCode | High | Code entries and validation |
| SmartPoints | High | Total points accumulated |
| Purchase Activity | Medium | Purchase history |
| Care Club Activity | Medium | Contribution history |
| Weekly Activity | Medium | Platform engagement |
| Performance | High | Overall performance score |
| Rule Compliance | High | Adherence to rules |
| Fraud Check | Critical | Fraud detection results |
| Manual Review Status | High | Review completion |

### AI Scoring Formula
```
overall_score = (
  smartcode_score × 0.20 +
  smartpoints_score × 0.20 +
  purchase_activity_score × 0.10 +
  careclub_activity_score × 0.10 +
  weekly_activity_score × 0.10 +
  performance_score × 0.15 +
  rule_compliance_score × 0.10 +
  (100 - fraud_risk_score) × 0.05
)
```

---

## SECTION 5: AI WEEKLY DRAW

### Weekly Draw Process

1. **Validation**
   - All entries validated
   - Code format check (000-999)
   - Point allocation verification

2. **Duplicate Analysis**
   - Same user duplicate detection
   - Cross-user duplicate detection
   - OCR duplicate matching

3. **Fraud Analysis**
   - Behavior pattern analysis
   - Velocity checks
   - Location anomalies
   - Device fingerprints

4. **Weightage Calculation**
   - AI score applied
   - Performance factor
   - Activity factor

5. **Weekly Rule Validation**
   - Compliance check
   - Eligibility verification

6. **Winner Selection**
   - Random weighted selection
   - AI confidence scoring
   - Pool assignment

### Draw Session Structure

| Field | Type | Purpose |
|-------|------|---------|
| week_period | text | ISO week |
| draw_status | enum | pending/processing/completed/failed/cancelled |
| total_entries | integer | All entries |
| total_participants | integer | Unique users |
| validation_passed | integer | Passed validation |
| validation_failed | integer | Failed validation |
| duplicates_detected | integer | Duplicates found |
| fraud_flagged | integer | Fraud cases |
| prime_winner_id | uuid | First prize winner |
| premium_winner_id | uuid | Second prize winner |
| standard_winner_id | uuid | Third prize winner |

---

## SECTION 6: ADMIN CONTROL

### Large Reward Cases
- Automatic flagging for review
- Threshold-based escalation
- Manual approval queue

### Approval Queue Fields

| Field | Type | Purpose |
|-------|------|---------|
| week_period | text | ISO week |
| assignment_id | uuid | Reward assignment |
| user_id | uuid | User reference |
| pool_type | enum | Reward pool |
| reward_amount | numeric | ₹100/₹200/₹400 |
| priority | enum | low/medium/high/urgent |
| status | enum | pending/approved/rejected/escalated |

### Admin Actions
- Pending verification review
- Manual approval
- Audit log entry
- Reward release

---

## SECTION 7: AI SECURITY

### Security Validation Types

| Type | Description |
|------|-------------|
| OCR Verification | Validate OCR accuracy |
| Receipt Matching | Match receipt to entry |
| Customer Verification | Verify user identity |
| Duplicate Detection | Find duplicates |
| Behavior Analysis | Analyze patterns |
| Fraud Detection | Detect fraud attempts |
| Pattern Analysis | Identify anomalies |
| Velocity Check | Rate limiting |
| Location Check | GPS/IP validation |
| Device Check | Device fingerprinting |

### Security Fields

| Field | Type | Purpose |
|-------|------|---------|
| validation_type | enum | 10 types |
| validation_status | enum | pending/passed/failed/requires_review |
| validation_score | numeric | 0-100 |
| flags | jsonb | Flag array |
| requires_manual_override | boolean | Needs manual action |
| override_applied | boolean | Override done |

---

## SECTION 8: WEEKLY WORKFLOW

```
┌─────────────────────────────────────────────┐
│           WEEKLY SMARTCODE FLOW              │
├─────────────────────────────────────────────┤
│                                              │
│  1. USER ENTRY                               │
│     ├── AI Automatic                        │
│     ├── Manual Entry                         │
│     ├── Offline OCR                          │
│     ├── Voice (Future)                       │
│     └── WhatsApp (Future)                    │
│                                              │
│  2. VALIDATION                               │
│     ├── Code Format (000-999)               │
│     ├── Point Allocation                     │
│     ├── Duplicate Check                     │
│     └── Receipt Verification                 │
│                                              │
│  3. SECURITY                                 │
│     ├── OCR Score                            │
│     ├── Fraud Score                          │
│     ├── Behavior Analysis                    │
│     └── Manual Review Flag                   │
│                                              │
│  4. AI EVALUATION                            │
│     ├── SmartCode Score                      │
│     ├── Activity Score                       │
│     ├── Compliance Score                     │
│     └── Overall Score                        │
│                                              │
│  5. WEEKLY DRAW                             │
│     ├── Validation Pass                      │
│     ├── Fraud Filter                         │
│     ├── Weightage Apply                      │
│     └── Winner Selection                     │
│                                              │
│  6. REWARD ASSIGNMENT                        │
│     ├── Prime (₹400)                         │
│     ├── Premium (₹200)                       │
│     └── Standard (₹100)                      │
│                                              │
│  7. ADMIN APPROVAL                           │
│     ├── Large Reward Review                  │
│     ├── Fraud Cases                          │
│     └── Manual Override                     │
│                                              │
│  8. PAYOUT                                   │
│     ├── Wallet Credit                        │
│     └── Audit Log                           │
│                                              │
└─────────────────────────────────────────────┘
```

---

## SECTION 9: AI DECISION FLOW

```
┌─────────────────────────────────────────────┐
│          AI DECISION ARCHITECTURE            │
├─────────────────────────────────────────────┤
│                                              │
│  USER ENTRY                                  │
│       │                                      │
│       ▼                                      │
│  ┌─────────────┐                             │
│  │ FORMAT      │── Invalid ──► REJECT       │
│  │ VALIDATION  │                             │
│  └─────┬───────┘                             │
│        │ Valid                               │
│        ▼                                      │
│  ┌─────────────┐                             │
│  │ DUPLICATE   │── Duplicate ──► FLAG       │
│  │ CHECK       │                             │
│  └─────┬───────┘                             │
│        │ Unique                               │
│        ▼                                      │
│  ┌─────────────┐                             │
│  │ RECEIPT     │── No Receipt ──► REVIEW     │
│  │ VERIFY      │                             │
│  └─────┬───────┘                             │
│        │ Verified                            │
│        ▼                                      │
│  ┌─────────────┐                             │
│  │ FRAUD       │── High Risk ──► REJECT     │
│  │ ANALYSIS    │                             │
│  └─────┬───────┘                             │
│        │ Low Risk                            │
│        ▼                                      │
│  ┌─────────────┐                             │
│  │ AI SCORE    │                             │
│  │ CALCULATION │                             │
│  └─────┬───────┘                             │
│        │                                      │
│        ▼                                      │
│  ┌─────────────┐                             │
│  │ WEEKLY      │                             │
│  │ EVALUATION  │                             │
│  └─────┬───────┘                             │
│        │                                      │
│        ▼                                      │
│  ┌─────────────┐                             │
│  │ DRAW        │── Not Selected ──► END     │
│  │ SELECTION   │                             │
│  └─────┬───────┘                             │
│        │ Selected                            │
│        ▼                                      │
│  ┌─────────────┐                             │
│  │ POOL        │── Prime ──► ₹400           │
│  │ ASSIGNMENT  │-- Premium ──► ₹200         │
│  │             │-- Standard ──► ₹100         │
│  └─────┬───────┘                             │
│        │                                      │
│        ▼                                      │
│  ┌─────────────┐                             │
│  │ ADMIN       │── Needs Approval ──► QUEUE │
│  │ REVIEW      │                             │
│  └─────┬───────┘                             │
│        │ Approved                            │
│        ▼                                      │
│  ┌─────────────┐                             │
│  │ PAYOUT      │──► WALLET CREDIT           │
│  └─────────────┘                             │
│                                              │
└─────────────────────────────────────────────┘
```

---

## SECTION 10: ENTERPRISE READY

### Unlimited Scale

| Capability | Status |
|------------|--------|
| Unlimited Users | UUID indexed |
| Unlimited SmartCodes | No limit per user |
| Unlimited Weekly Entries | Auto-scaling |
| Unlimited Countries | No geographic limits |
| Unlimited Languages | Architecture ready |
| Unlimited Future Reward Pools | Extendable |

---

## SECTION 11: FUTURE EXPANSION

### Voice Engine Roadmap
- English (en) — Ready
- Malayalam (ml) — Architecture
- Hindi (hi) — Architecture
- Arabic (ar) — Architecture
- Future languages — Extensible

### WhatsApp Engine Roadmap
- Text messages — Architecture
- Image messages — Architecture
- Voice messages — Architecture
- Multi-account support — Future

### Future Reward Pools
- Structure supports adding new pools
- is_locked = false for new pools
- ai_assignable_only = true
- No user selection

---

## SECURITY STATUS

### RLS Enabled Tables
- smartcode_core_config (public read)
- smartcode_entry_methods (public read)
- smartcode_entries (user can see own)
- smartcode_reward_pools (public read)
- weekly_reward_assignments (user can see own)
- ai_weekly_evaluations (user can see own)
- ai_weekly_draw_sessions (public read)
- voice_smartcode_sessions (user can see own)
- whatsapp_smartcode_sessions (admin only)
- smartcode_multi_entries (user can see own)
- smartcode_security_validation (admin only)
- smartcode_point_audit (user can see own)
- admin_reward_approval_queue (admin only)

---

## BUILD STATUS

| Component | Status |
|-----------|--------|
| Database Migration 069 | PASSED |
| WeeklySmartCodeCoreEngine.ts | COMPLETE |
| TypeScript Compilation | PASSED |
| Vite Build | PASSED (10.86s) |
| Bundle Size | 1,427.54 kB (288.44 kB gzip) |

**Overall Build Status: COMPLETE**

---

## DATABASE STRUCTURE

### New Tables (Phase 40)

| Table | Purpose |
|-------|---------|
| smartcode_core_config | Locked base rules |
| smartcode_entry_methods | 5 entry methods |
| smartcode_entries | Core entry table |
| smartcode_reward_pools | Locked rewards |
| weekly_reward_assignments | AI assignments |
| ai_weekly_evaluations | AI scoring |
| ai_weekly_draw_sessions | Weekly draws |
| voice_smartcode_sessions | Voice architecture |
| whatsapp_smartcode_sessions | WhatsApp architecture |
| smartcode_multi_entries | Batch entries |
| smartcode_security_validation | Security checks |
| smartcode_point_audit | Point audit trail |
| admin_reward_approval_queue | Approval workflow |

---

## PERMANENT CORE SPECIFICATION

This document is the **PERMANENT FOUNDATION** of the VLOOP Weekly SmartCode Challenge Engine.

### Immutable Rules
1. **₹40 Purchase = 1 SmartPoint** — Never changes
2. **₹10 Care Club = 5 SmartPoints** — Never changes
3. **SmartCode Range 000–999** — Never changes
4. **Prime Reward ₹400** — Never changes
5. **Premium Reward ₹200** — Never changes
6. **Standard Reward ₹100** — Never changes
7. **AI Assigns Rewards Only** — Users never select

### Locked Flags
- `is_locked = true` in smartcode_core_config
- `is_locked = true` in smartcode_reward_pools
- `ai_assignable_only = true` in reward pools

---

**END OF PERMANENT CORE SPECIFICATION**
