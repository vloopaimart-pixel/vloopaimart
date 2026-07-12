# VLOOP Weekly SmartCode Verification Report

**Phase 23 - Weekly SmartCode Engine**
**Date:** 2026-06-28
**Status:** COMPLETE

---

## Overview

The VLOOP SmartCode™ Weekly Reward Program has been completely restructured. This report documents the new workflow and business rules.

---

## Workflow Verification

### Complete Flow

```
1. Purchase
      ↓
2. Earn Points
      ↓
3. Open Weekly Participation
      ↓
4. Knowledge Challenge
      ↓
5. SmartCode Generation
      ↓
6. Confirmation
      ↓
7. Weekly Verification (Admin)
      ↓
8. Wallet 1 Credit (Winners Only)
```

---

## Step-by-Step Verification

### Step 1: Purchase

**Rule:** ₹40 Purchase = 1 Point

**Verified Files:**
- `vloopEngine.ts:calcPurchasePoints()`
- `ProductCard.tsx`
- `CartPage.tsx`
- `CartDrawer.tsx`

### Step 2: Earn Points

**Implementation:**
- Purchase points added to user profile
- Point history recorded

**Verified:** Points are added after checkout confirmation

### Step 3: Weekly Participation

**Location:** `SmartCodePage.tsx`

**States:**
- User can enter weekly participation
- Points are allocated for participation
- Category selected (Standard/Premium/Prime)

### Step 4: Knowledge Challenge

**Options:**
| Option | Default | Admin Control |
|--------|---------|---------------|
| Skip Quiz | ✓ Enabled | Can disable |
| 1 Question | ✓ Default | Available |
| 5 Questions | - | Available |
| 10 Questions | - | Available |

**Categories:**
- Shopping
- Consumer Awareness
- Health
- Insurance
- VLOOP
- Partner Offers

**Verified File:** `vloopEngine.ts:252-285`

### Step 5: SmartCode Generation

**Two Options:**

**Auto SmartCode:**
- Random 3-digit code generated
- Range: 000-999
- Example: 483

**Manual SmartCode:**
- Professional mobile dial pad
- Keypad: 1-9, 0, CLR, DEL
- User enters 3 digits
- Availability shown

**Critical Rules:**
- SAME SmartCode can be selected by UNLIMITED members
- NO restriction on duplicate codes
- Winners determined by points, not code uniqueness

**Verified File:** `SmartCodePage.tsx:lines 300-520`

### Step 6: Confirmation

**On Confirm:**
1. Participation record inserted
2. SmartCode assigned to user
3. Points added to user profile
4. Wallet 2 credited (2%/5%, locked 30 days)
5. Wallet 1: NOT credited (pending winning)

**Verified File:** `SmartCodePage.tsx:handleFinalConfirm()`

### Step 7: Weekly Verification (Admin)

**Status Flow:**
```
pending → approved → disbursed
                    ↘ rejected
```

**Admin Controls:**
- Approve Winners
- Reject Winners
- Recalculate
- Manual Edit
- Emergency Override
- Credit Wallet 1

**Verified File:** `vloopEngine.ts:377-405`

### Step 8: Wallet 1 Credit

**RULE:** Wallet 1 receives credit ONLY after:
1. User wins in Weekly Reward
2. Admin approves the winning

**Amount:** Based on reward tier and category

---

## SmartCode Rules Verification

| Rule | Status |
|------|--------|
| 3-digit code (000-999) | ✓ VERIFIED |
| Auto generation available | ✓ VERIFIED |
| Manual entry available | ✓ VERIFIED |
| Duplicate codes ALLOWED | ✓ VERIFIED |
| Unlimited users per code | ✓ VERIFIED |
| Winners by points, not code | ✓ VERIFIED |

---

## Winner Selection Rules

**Categories:**

| Category | Multiplier | Example |
|----------|-----------|---------|
| Prime | 4x | ₹400 from ₹100 base |
| Premium | 2x | ₹200 from ₹100 base |
| Standard | 1x | ₹100 base |

**Winners per SmartCode:**
- Can be: 1, 10, 100, 1000, or unlimited
- Determined by business rules
- NOT limited by code uniqueness

---

## Week Over Week Behavior

- Each week is a new cycle
- Previous week's entries carry forward if not won
- Points accumulate for participation

---

## Database Schema

**participation table:**
```sql
- user_id
- participation_type: 'weekly_reward'
- quiz_type: 'skip' | '1' | '5' | '10'
- points_earned
- smartcode: 000-999
- points_used
- category: 'standard' | 'premium' | 'prime'
- entry_count
- status: 'pending' | 'approved' | 'rejected' | 'disbursed'
```

---

## UI Flow Verification

| Page | Step | Verified |
|------|------|----------|
| SmartCodePage | Welcome | ✓ |
| SmartCodePage | Buy | ✓ |
| SmartCodePage | Earn | ✓ |
| SmartCodePage | Quiz | ✓ |
| SmartCodePage | Generate | ✓ |
| SmartCodePage | Benefits | ✓ |
| SmartCodePage | Wallet | ✓ |
| SmartCodePage | Success | ✓ |

---

## Summary

**Weekly SmartCode Flow: COMPLETE**

- 8-step workflow implemented
- Knowledge Challenge integrated
- Auto and Manual code generation
- Duplicate codes allowed
- Winners determined by points
- Wallet 1 credit only on winning
- Admin verification required
