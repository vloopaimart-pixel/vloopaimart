# VLOOP Wallet Engine Verification Report

**Phase 22B - Wallet System Verification**
**Date:** 2026-06-28
**Status:** COMPLETE

---

## Executive Summary

This report documents the audit of the VLOOP Wallet 1 and Wallet 2 business logic. Critical issues were found in the SmartCode purchase flow where wallet credits are not applied. All other wallet flows are functioning correctly.

---

## Issues Found

### CRITICAL ISSUES

#### 1. SmartCode Purchase Flow - Wallet Credits NOT Applied
**Location:** `SmartCodePage.tsx:86-112` (handleFinalConfirm)
**Severity:** CRITICAL
**Status:** REQUIRES FIX

**Issue:** When a user confirms SmartCode participation:
- `points_earned` is recorded in `participation` table
- `smartcode` is recorded
- BUT neither `wallet1_balance` nor `wallet2_balance` are updated!

**Current Code (lines 86-112):**
```typescript
const handleFinalConfirm = async () => {
  // ... inserts participation
  // ... updates vloop_code
  // ❌ NO WALLET UPDATES
};
```

**Expected Behavior:**
```typescript
// Should add:
await supabase.from('profiles').update({
  points: profile.points + pointsEarned,
  wallet1_balance: profile.wallet1_balance + calcWallet1Credit(pointsEarned),
  wallet1_total_earned: (profile.wallet1_total_earned || 0) + calcWallet1Credit(pointsEarned),
  wallet2_balance: profile.wallet2_balance + calcWallet2Credit(pointsEarned),
}).eq('id', profile.id);
```

---

### WARNINGS

#### 2. No Duplicate Credit Prevention
**Location:** All wallet update operations
**Severity:** MEDIUM
**Status:** WARNING

**Issue:** No idempotency checks. If the same order/process runs twice, credits will be duplicated.

**Recommendation:** Add transaction IDs or use database constraints to prevent duplicate credits.

#### 3. No Negative Balance Prevention
**Location:** Benefit redemption / wallet debit operations
**Severity:** MEDIUM
**Status:** WARNING

**Issue:** No validation to prevent wallet from going negative during redemption.

**Recommendation:** Add check before any wallet debit:
```typescript
if (amount > wallet_balance) {
  throw new Error('Insufficient wallet balance');
}
```

#### 4. Point History Amount Column Not Always Populated
**Location:** `auth.tsx:82-88`, various files
**Severity:** LOW
**Status:** WARNING

**Issue:** The `point_history.amount` column exists but is sometimes left as 0 or not populated.

---

## Validated Flows

### ✅ Wallet 1 Credit Calculation - VERIFIED CORRECT

**Formula:** `points × ₹100`

| Source | Implementation | Status |
|--------|---------------|--------|
| CartDrawer.tsx | `calcWallet1Credit(pointsEarned)` | ✓ CENTRALIZED |
| CartPage.tsx | `calcWallet1Credit(pointsEarned)` | ✓ CENTRALIZED |
| vloopCalculations.ts | `points * 100` | ✓ DEFINED |

### ✅ Wallet 2 Credit Calculation - VERIFIED CORRECT

**Formula:** `points × ₹50`

| Source | Implementation | Status |
|--------|---------------|--------|
| CareClubPage.tsx | `calcWallet2Credit(points)` | ✓ CENTRALIZED |
| SmartCodePage.tsx | `calcWallet2Credit(pointsEarned)` | ✓ CENTRALIZED (but not saved) |
| vloopCalculations.ts | `points * 50` | ✓ DEFINED |

### ✅ Purchase → Wallet 1 Flow - VERIFIED (Cart only)

**Cart/CartDrawer Flow:**
1. User checks out
2. Points calculated: `calcPurchasePoints(total)`
3. Profile updated:
   - `points: profile.points + pointsEarned`
   - `wallet1_balance: profile.wallet1_balance + calcWallet1Credit(pointsEarned)`
   - `wallet1_total_earned: profile.wallet1_total_earned + calcWallet1Credit(pointsEarned)`

**Status:** ✓ WORKING for Cart Checkout

### ✅ Care Club → Wallet 2 Flow - VERIFIED

**CareClubPage Flow:**
1. User contributes
2. Points calculated: `calcCareClubPoints(amount)`
3. Profile updated:
   - `points: profile.points + points`
   - `wallet2_balance: profile.wallet2_balance + calcWallet2Credit(points)`

**Status:** ✓ WORKING

### ❌ SmartCode Purchase → Wallet Flow - NOT IMPLEMENTED

**SmartCodePage Flow:**
1. User confirms participation
2. Points displayed but...
3. Wallet balances NOT updated!

**Status:** ❌ BUG - Wallet credits not applied

---

## Wallet Transaction History - Verified

| Table | Purpose | Status |
|-------|---------|--------|
| `point_history` | Records all point transactions | ✓ EXISTS |
| `benefits_history` | Records benefit claims | ✓ EXISTS |
| `orders` | Records purchases with points_earned | ✓ EXISTS |
| `care_club` | Records contributions with points_earned | ✓ EXISTS |
| `participation` | Records SmartCode participation | ✓ EXISTS |

**Balance Tracking Fields in `profiles`:**
- `wallet1_balance` - Current Wallet 1 balance ✓
- `wallet1_total_earned` - Lifetime Wallet 1 earnings ✓
- `wallet1_total_used` - Wallet 1 used amount ✓
- `wallet2_balance` - Current Wallet 2 balance ✓
- `wallet2_activation_date` - Wallet 2 activation ✓
- `wallet2_support_status` - Support status ✓
- `wallet2_eligibility_status` - Eligibility ✓

---

## Monthly Reset Rules

**Finding:** NO monthly reset rules implemented.

**Current Behavior:**
- Points carry forward indefinitely
- Wallet balances accumulate
- No automatic reset mechanism

**Recommendation:** If monthly reset is business requirement, implement:
1. Monthly cron job to snapshot and reset
2. Database trigger for auto-archival
3. UI to display "This month's earnings" vs "Total balance"

---

## Simulations

### Test Configuration
- Purchase Amount: Variable
- Care Club Contribution: ₹100 (default)
- Points Earned: floor(purchase/40) + floor(100/20)

---

### Simulation: ₹100 Purchase

| Field | Calculation | Value |
|-------|-------------|-------|
| Purchase Amount | Input | ₹100 |
| Care Club Contribution | Default | ₹100 |
| Purchase Points | floor(100/40) | 2 |
| Care Club Points | floor(100/20) | 5 |
| **Total Points** | 2 + 5 | **7** |
| Wallet 1 Credit | 7 × ₹100 | ₹700 |
| Wallet 2 Credit | 7 × ₹50 | ₹350 |
| **Total Wallet Credit** | ₹700 + ₹350 | **₹1,050** |

**Starting Balance:** ₹0 + ₹0 = ₹0
**Final Wallet 1 Balance:** ₹700
**Final Wallet 2 Balance:** ₹350

---

### Simulation: ₹500 Purchase

| Field | Calculation | Value |
|-------|-------------|-------|
| Purchase Amount | Input | ₹500 |
| Care Club Contribution | Default | ₹100 |
| Purchase Points | floor(500/40) | 12 |
| Care Club Points | floor(100/20) | 5 |
| **Total Points** | 12 + 5 | **17** |
| Wallet 1 Credit | 17 × ₹100 | ₹1,700 |
| Wallet 2 Credit | 17 × ₹50 | ₹850 |
| **Total Wallet Credit** | ₹1,700 + ₹850 | **₹2,550** |

**Starting Balance:** ₹0 + ₹0 = ₹0
**Final Wallet 1 Balance:** ₹1,700
**Final Wallet 2 Balance:** ₹850

---

### Simulation: ₹2,100 Purchase

| Field | Calculation | Value |
|-------|-------------|-------|
| Purchase Amount | Input | ₹2,100 |
| Care Club Contribution | Default | ₹100 |
| Purchase Points | floor(2,100/40) | 52 |
| Care Club Points | floor(100/20) | 5 |
| **Total Points** | 52 + 5 | **57** |
| Wallet 1 Credit | 57 × ₹100 | ₹5,700 |
| Wallet 2 Credit | 57 × ₹50 | ₹2,850 |
| **Total Wallet Credit** | ₹5,700 + ₹2,850 | **₹8,550** |

**Starting Balance:** ₹0 + ₹0 = ₹0
**Final Wallet 1 Balance:** ₹5,700
**Final Wallet 2 Balance:** ₹2,850

---

### Simulation: ₹5,000 Purchase

| Field | Calculation | Value |
|-------|-------------|-------|
| Purchase Amount | Input | ₹5,000 |
| Care Club Contribution | Default | ₹100 |
| Purchase Points | floor(5,000/40) | 125 |
| Care Club Points | floor(100/20) | 5 |
| **Total Points** | 125 + 5 | **130** |
| Wallet 1 Credit | 130 × ₹100 | ₹13,000 |
| Wallet 2 Credit | 130 × ₹50 | ₹6,500 |
| **Total Wallet Credit** | ₹13,000 + ₹6,500 | **₹19,500** |

**Starting Balance:** ₹0 + ₹0 = ₹0
**Final Wallet 1 Balance:** ₹13,000
**Final Wallet 2 Balance:** ₹6,500

---

### Simulation: ₹10,000 Purchase

| Field | Calculation | Value |
|-------|-------------|-------|
| Purchase Amount | Input | ₹10,000 |
| Care Club Contribution | Default | ₹100 |
| Purchase Points | floor(10,000/40) | 250 |
| Care Club Points | floor(100/20) | 5 |
| **Total Points** | 250 + 5 | **255** |
| Wallet 1 Credit | 255 × ₹100 | ₹25,500 |
| Wallet 2 Credit | 255 × ₹50 | ₹12,750 |
| **Total Wallet Credit** | ₹25,500 + ₹12,750 | **₹38,250** |

**Starting Balance:** ₹0 + ₹0 = ₹0
**Final Wallet 1 Balance:** ₹25,500
**Final Wallet 2 Balance:** ₹12,750

---

## Summary Table

| Purchase | CC Contrib | Points | W1 Credit | W2 Credit | Total Wallet |
|----------|-----------|--------|-----------|-----------|--------------|
| ₹100 | ₹100 | 7 | ₹700 | ₹350 | ₹1,050 |
| ₹500 | ₹100 | 17 | ₹1,700 | ₹850 | ₹2,550 |
| ₹2,100 | ₹100 | 57 | ₹5,700 | ₹2,850 | ₹8,550 |
| ₹5,000 | ₹100 | 130 | ₹13,000 | ₹6,500 | ₹19,500 |
| ₹10,000 | ₹100 | 255 | ₹25,500 | ₹12,750 | ₹38,250 |

**Balance Verification:** Points × 150 = Total Wallet Credit ✓

---

## Audit Checklist

| Check | Status | Notes |
|-------|--------|-------|
| Wallet 1 credit calculation | ✓ PASS | Uses centralized function |
| Wallet 2 credit calculation | ✓ PASS | Uses centralized function |
| Reward point conversion | ✓ PASS | floor(amount/40) for purchase, floor(amount/20) for Care Club |
| Purchase → Wallet flow (Cart) | ✓ PASS | Updates wallet1_balance + wallet1_total_earned |
| Purchase → Wallet flow (SmartCode) | ❌ FAIL | Wallet credits NOT applied |
| Wallet → Benefit redemption | ✓ PASS | Records in benefits_history |
| Wallet transaction history | ✓ PASS | Tables exist and populated |
| Balance consistency | ⚠ WARN | Formula correct, but SmartCode flow broken |
| Duplicate credit prevention | ⚠ WARN | Not implemented |
| Negative balance prevention | ⚠ WARN | Not implemented |
| Monthly reset rules | ⚠ INFO | Not implemented (may be intentional) |

---

## Recommendations

### Must Fix
1. **SmartCode Wallet Update** - Add wallet balance updates to SmartCodePage handleFinalConfirm

### Should Fix
2. **Duplicate Prevention** - Add idempotency checks or transaction IDs
3. **Negative Balance Prevention** - Validate before any wallet debit

### Consider
4. **Monthly Reset** - Implement if business requirement
5. **Point History Amount** - Ensure amount column is always populated

---

## Conclusion

The VLOOP Wallet Engine calculations are correct and use centralized functions. However, the SmartCode purchase flow has a critical bug where wallet balances are not updated. This must be fixed to ensure users receive their credits.

**Overall Status:** ⚠ CALCULATIONS CORRECT, FLOW BUG DETECTED
