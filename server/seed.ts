import { db } from './db';
import { HERO_PRODUCT, VAULT_PRODUCTS } from '../src/data/products';
import { INITIAL_ORDERS } from '../src/data/orders';

export function seedInitialData() {
  const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
  
  if (productCount.count === 0) {
    console.log('⚡ [DB] Seeding initial luxury products into database...');
    const insertProduct = db.prepare(`
      INSERT INTO products (
        id, name, category, price, original_price, save_percent,
        rating, reviews_count, colorways, sku, material,
        is_waterproof, is_anti_tarnish, badge, quote, image, description, stock
      ) VALUES (
        @id, @name, @category, @price, @originalPrice, @savePercent,
        @rating, @reviewsCount, @colorways, @sku, @material,
        @isWaterproof, @isAntiTarnish, @badge, @quote, @image, @description, @stock
      )
    `);

    const allProducts = [HERO_PRODUCT, ...VAULT_PRODUCTS];
    const insertMany = db.transaction((prods) => {
      for (const p of prods) {
        insertProduct.run({
          id: p.id,
          name: p.name,
          category: p.category,
          price: p.price,
          originalPrice: p.originalPrice,
          savePercent: p.savePercent,
          rating: p.rating,
          reviewsCount: p.reviewsCount,
          colorways: p.colorways,
          sku: p.sku,
          material: p.material,
          isWaterproof: p.isWaterproof ? 1 : 0,
          isAntiTarnish: p.isAntiTarnish ? 1 : 0,
          badge: p.badge || null,
          quote: p.quote || null,
          image: p.image,
          description: p.description || null,
          stock: 250 // Production seed stock
        });
      }
    });

    insertMany(allProducts);
    console.log(`✅ [DB] Successfully seeded ${allProducts.length} items into database.`);
  }

  const orderCount = db.prepare('SELECT COUNT(*) as count FROM orders').get() as { count: number };
  if (orderCount.count === 0) {
    console.log('⚡ [DB] Seeding existing customer orders...');
    const insertOrder = db.prepare(`
      INSERT INTO orders (
        id, customer_name, phone, location, pincode, rto_risk,
        amount, payment_method, status, product_name, sku,
        quantity, image, tag, courier, phone_verified, notes
      ) VALUES (
        @id, @customerName, @phone, @location, @pincode, @rtoRisk,
        @amount, @paymentMethod, @status, @productName, @sku,
        @quantity, @image, @tag, @courier, @phoneVerified, @notes
      )
    `);

    const insertOrdersTx = db.transaction((orders) => {
      for (const o of orders) {
        insertOrder.run({
          id: o.id,
          customerName: o.customerName,
          phone: o.phone || '+91 9876543210',
          location: o.location,
          pincode: o.pincode,
          rtoRisk: o.rtoRisk || 'Low',
          amount: o.amount,
          paymentMethod: o.paymentMethod || 'COD',
          status: o.status || 'COD Confirmed',
          productName: o.productName,
          sku: o.sku || 'SKU: DEMI-99',
          quantity: o.quantity || 1,
          image: o.image || null,
          tag: o.tag || null,
          courier: o.courier || 'BlueDart Air Express',
          phoneVerified: o.phoneVerified ? 1 : 0,
          notes: o.notes || null
        });
      }
    });

    insertOrdersTx(INITIAL_ORDERS);
    console.log(`✅ [DB] Successfully seeded ${INITIAL_ORDERS.length} production orders.`);
  }
}
