/*
# Add INSERT policies for order_items and order_status_history

## Purpose
Customers placing orders need to insert order_items and order_status_history rows
when they checkout. Currently only admin can insert (via crud_items_admin / crud_status_admin).
Regular authenticated users have SELECT policies but no INSERT policy, so checkout
will silently fail when trying to create order item records.

## Changes
1. order_items: Add INSERT policy allowing authenticated users to insert items
   for orders they own (order_id belongs to an order where user_id = auth.uid()).
2. order_status_history: Add INSERT policy allowing authenticated users to insert
   status history for orders they own.

## Security
- Both policies check that the order_id belongs to the authenticated user via a
  subquery on the orders table (orders.user_id = auth.uid()).
- No destructive changes. No columns added or removed.
- Existing admin policies remain unchanged.
*/

-- order_items: allow owners to insert items for their own orders
DROP POLICY IF EXISTS "insert_items_own" ON order_items;
CREATE POLICY "insert_items_own"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    order_id IN (
      SELECT orders.id FROM orders WHERE orders.user_id = auth.uid()
    )
  );

-- order_status_history: allow owners to insert status entries for their own orders
DROP POLICY IF EXISTS "insert_status_own" ON order_status_history;
CREATE POLICY "insert_status_own"
  ON order_status_history FOR INSERT
  TO authenticated
  WITH CHECK (
    order_id IN (
      SELECT orders.id FROM orders WHERE orders.user_id = auth.uid()
    )
  );
