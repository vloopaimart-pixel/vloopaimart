# SELLER, PARTNER & FRANCHISE ECOSYSTEM REPORT

**Phase 35 — VLOOP Global Seller, Partner & Franchise Ecosystem**
**Version:** 35.0.0
**Date:** 2026-07-02
**Status:** COMPLETE

---

## ARCHITECTURE SUMMARY

### Database Migration 064
- **Tables Created:** 11 new tables
- **Columns Added:** 15 columns to sellers table
- **RLS Policies:** 25+ policies across all tables
- **Indexes:** 20+ indexes for query optimization
- **Triggers:** 7 triggers for auto-updating timestamps
- **Functions:** `calculate_seller_trust_score()`, `get_partner_dashboard_stats()`

---

## SECTION 1: SELLER TYPES

### Supported Seller Models (12 Types)

| Type | Description | Use Case |
|------|-------------|----------|
| Individual Seller | Personal sellers | C2C marketplace |
| Local Shop | Nearby stores | Hyper-local delivery |
| Home Business | Home-based sellers | Micro inventory |
| Manufacturer | Direct factory | Factory prices |
| Distributor | Regional distribution | B2B bulk |
| Wholesaler | Bulk sellers | Wholesale pricing |
| Importer | International import | Global trading |
| Exporter | International export | Global trading |
| Brand Owner | Official brand store | Verified products |
| Service Provider | Service-based offerings | Services marketplace |
| Affiliate Partner | External platform | Commission-based |
| Home Cloud Store | Home delivery partners | Same-day hyper-local |

### No demo data. Enterprise architecture only.

---

## SECTION 2: PARTNER MANAGEMENT

### Partner Profiles Table (`partner_profiles`)

| Field | Type | Purpose |
|-------|------|---------|
| Partner ID | uuid | Unique identifier |
| Partner Code | text | Business reference code |
| Business Name | text | Official business name |
| Owner Name | text | Owner/contact person |
| Business Category | text | Category classification |
| GST / Tax ID | text | Tax registration (optional by country) |
| Country | text | ISO country code |
| State | text | State/province |
| District | text | District/region |
| City | text | City |
| Location | lat/lng | GPS coordinates |
| Trust Status | enum | new/building/trusted/verified/flagged/suspended |
| Active Status | boolean | Account status |

### Partner Types (12)
- Matches all 12 Seller Types
- Each partner type has specific verification requirements
- Configurable commission rates per type

---

## SECTION 3: SELLER VERIFICATION ENGINE

### Verification Workflow Stages

| Stage | Description | Transition |
|-------|-------------|------------|
| Pending | Initial application | → Document Review |
| Document Review | Admin verifies documents | → Manual Approval / Rejected |
| Manual Approval | Human verifies details | → AI Verification |
| AI Verification | System validates data | → Verified / Flagged |
| Verified | Full verification complete | Active status |
| Rejected | Application declined | Can reapply |
| Suspended | Account suspended | Admin review |

### Verification Documents Table (`seller_verification_documents`)

| Document Type | Required For |
|---------------|--------------|
| Identity Proof | All sellers |
| Address Proof | All sellers |
| Business Registration | Businesses |
| GST Certificate | Tax registered businesses |
| PAN Card | Indian businesses |
| Bank Statement | All sellers (payouts) |
| Cancelled Cheque | Banking verification |
| Business Photo | Physical businesses |
| Product Catalog | Product sellers |
| Other | Additional verification |

### Verification Workflow Table (`seller_verification_workflow`)
- Tracks each verification stage
- AI review score
- Manual review notes
- Escalation support
- Stage timestamps

---

## SECTION 4: HOME CLOUD STORE NETWORK

### Home Cloud Store Profiles Table (`home_cloud_store_profiles`)

| Field | Type | Purpose |
|-------|------|---------|
| Store Name | text | Display name |
| Store Code | text | Unique identifier |
| Inventory Limit | integer | Max products (default: 50) |
| Current Inventory | integer | Active products |
| Radius | km | Delivery coverage |
| Working Hours | time | Operating hours |
| Working Days | array | Active days |
| Delivery Areas | jsonb | Covered areas |
| Trust Score | numeric | Partner trust level |
| Performance Score | numeric | Delivery metrics |
| Orders | integer | Total/completed/cancelled |
| Settlement Balance | numeric | Pending payouts |
| Verification | boolean | Verified status |

### Features
- Verified members become Home Cloud Store Partners
- Micro inventory management
- Hyper-local delivery (configurable radius)
- Same-day and express delivery options
- Performance tracking
- Trust score integration

---

## SECTION 5: FRANCHISE HIERARCHY

### Franchise Levels (5 Tiers)

| Level | Territory | Commission |
|-------|-----------|------------|
| Country Master | Entire country | Highest revenue share |
| State Partner | State/province | State-level commission |
| District Partner | District/region | District-level commission |
| City Partner | City | City-level commission |
| Local Partner | Local area | Base commission |

### Franchise Hierarchy Table (`franchise_hierarchy`)

| Field | Type | Purpose |
|-------|------|---------|
| Franchise Code | text | Unique identifier |
| Franchise Name | text | Display name |
| Franchise Level | enum | Hierarchy tier |
| Parent Franchise | uuid | Upstream franchise |
| Country | text | Country code |
| State | text | State/province |
| District | text | District |
| City | text | City |
| Territory Code | text | Area identifier |
| Territory Bounds | jsonb | Geographic bounds |
| Owner Seller | uuid | Assigned seller |
| Commission Rate | numeric | Franchise commission |
| Revenue Share | numeric | Revenue percentage |
| Partners Under | integer | Downstream partners |
| Contract Dates | date | Start/end dates |
| Contract Terms | jsonb | Agreement details |

### Future Global Expansion
- Multi-country support
- Regional master franchises
- Hierarchical commission distribution
- Territory conflict resolution

---

## SECTION 6: COMMISSION ENGINE

### Commission Types (7+ Types)

| Type | Source | Description |
|------|--------|-------------|
| Marketplace Sales | Direct orders | Standard marketplace commission |
| Affiliate Sales | External platforms | Affiliate link commissions |
| Private Label Sales | VLOOP brands | Private label revenue share |
| Referral Rewards | Referrals | Customer referral bonuses |
| Franchise Revenue | Franchise network | Downstream franchise share |
| Service Revenue | Service orders | Service-specific commission |
| Trading Commission | Import/Export | Trading transaction fees |
| Other | Custom | Configurable rules |

### Commission Rules Table (`commission_rules`)

| Field | Type | Purpose |
|-------|------|---------|
| Rule Name | text | Display name |
| Rule Code | text | Unique identifier |
| Commission Type | enum | Commission category |
| Seller Type | text | Seller type filter |
| Product Category | uuid | Category filter |
| Min/Max Order Value | numeric | Value thresholds |
| Commission Percent | numeric | Percentage rate |
| Fixed Commission | numeric | Fixed amount |
| Tiered | boolean | Tier-based pricing |
| Tier Config | jsonb | Tier definitions |
| Priority | integer | Rule precedence |
| Valid From/To | date | Time validity |

### Commission Transactions Table (`commission_transactions`)
- Transaction tracking per order
- Settlement status (pending/settled/failed/refunded)
- Period-based aggregation
- Full audit trail

---

## SECTION 7: PARTNER DASHBOARD

### Dashboard Architecture

| Module | Metrics |
|--------|---------|
| Orders | Total, pending, completed, cancelled |
| Revenue | Total revenue, average order value |
| Products | Active products, inventory status |
| Inventory | Stock levels, reorder alerts |
| Performance | Delivery times, completion rate |
| Ratings | Customer rating, review count |
| Trust Score | Current score, trend |
| Settlement | Pending balance, last settlement |
| Analytics | Daily/weekly/monthly trends |

### Partner Analytics Table (`partner_analytics`)

| Metric | Type | Description |
|--------|------|-------------|
| total_orders | integer | Orders for the day |
| completed_orders | integer | Successfully delivered |
| cancelled_orders | integer | Cancelled/returned |
| total_revenue | numeric | Day's revenue |
| total_commission | numeric | Commission earned |
| avg_order_value | numeric | Average transaction |
| avg_delivery_time | integer | Minutes |
| customer_rating_avg | numeric | Daily rating |
| new_customers | integer | First-time buyers |
| returning_customers | integer | Repeat buyers |
| product_views | integer | Product impressions |
| conversion_rate | numeric | View-to-order rate |
| return_rate | numeric | Return percentage |

---

## SECTION 8: AI PARTNER INTELLIGENCE

### AI Intelligence Types

| Type | Description | Factors |
|------|-------------|---------|
| Seller Quality | Overall quality score | order_completion, rating, return_rate, response_time |
| Delivery Performance | Delivery metrics | on_time_rate, avg_time, damage_rate |
| Customer Satisfaction | Happiness score | avg_rating, sentiment, complaint_rate |
| Fraud Detection | Risk monitoring | patterns, age, verification |
| Business Growth | Trajectory analysis | revenue_trend, expansion, acquisition |
| Inventory Suggestions | Stock recommendations | velocity, seasonality, lead_time |
| Pricing Optimization | Dynamic pricing | competitors, elasticity, margins |
| Product Recommendation | Selection suggestions | category_performance, trends |

### AI Partner Intelligence Table (`ai_partner_intelligence`)
- Current and previous scores
- Score trend tracking
- Factor breakdown
- Recommendations array
- Predictions storage
- Model version tracking
- Computation scheduling

---

## SECTION 9: ENTERPRISE READY

### Unlimited Scale

| Capability | Status |
|------------|--------|
| Unlimited Sellers | UUID + indexed queries |
| Unlimited Partners | Separate profiles table |
| Unlimited Franchises | Hierarchical design |
| Unlimited Countries | Country field indexes |
| Unlimited Products | Product reference FK |
| Unlimited Businesses | No hard limits |

### Partner Trust Events Table (`partner_trust_events`)
- Event type tracking (14 event types)
- Trust points change
- Score before/after
- Reference tracking
- Audit compliance

---

## SECURITY STATUS

### RLS Enabled Tables
- sellers (extended)
- seller_verification_documents
- seller_verification_workflow
- partner_profiles
- home_cloud_store_profiles
- franchise_hierarchy
- commission_rules
- commission_transactions
- partner_settlements
- partner_analytics
- ai_partner_intelligence
- partner_trust_events

### Access Control
- Sellers: Read own data, write own data
- Partners: Full CRUD on own profile
- Home Cloud: Verified profile required
- Commission: Admin full access, seller read own
- Settlements: Admin full access, seller read own
- Analytics: Admin full access, seller read own
- AI Intelligence: Admin full access, seller read own

---

## BUILD STATUS

| Component | Status |
|-----------|--------|
| Database Migration 064 | PASSED |
| SellerPartnerEcosystemEngine.ts | COMPLETE |
| TypeScript Compilation | PASSED |
| Vite Build | PASSED (8.79s) |
| Bundle Size | 1,427.54 kB (288.44 kB gzip) |

**Overall Build Status: COMPLETE**

---

## DATABASE STRUCTURE SUMMARY

### New Tables (Phase 35)

| Table | Records | RLS | Purpose |
|-------|---------|-----|---------|
| seller_verification_documents | Variable | Yes | Document storage |
| seller_verification_workflow | Variable | Yes | Verification tracking |
| partner_profiles | Variable | Yes | Partner accounts |
| home_cloud_store_profiles | Variable | Yes | Home stores |
| franchise_hierarchy | Variable | Yes | Franchise tree |
| commission_rules | Variable | Yes | Commission config |
| commission_transactions | Variable | Yes | Commission log |
| partner_settlements | Variable | Yes | Payout records |
| partner_analytics | Variable | Yes | Daily metrics |
| ai_partner_intelligence | Variable | Yes | AI scores |
| partner_trust_events | Variable | Yes | Trust audit |

### Extended Tables
- **sellers**: 15 new columns for verification, trust, franchise

---

## FUTURE EXPANSION

### Planned Integrations
- AI verification automation
- Real-time trust score updates
- Automated settlement processing
- Franchise onboarding workflow
- Partner mobile app API
- Multi-currency settlements
- Tax compliance automation
- Document OCR verification

### Architecture Ready
- All tables support future expansion
- No hardcoded limits
- JSONB for flexible configuration
- Comprehensive indexing
- Audit trail architecture
