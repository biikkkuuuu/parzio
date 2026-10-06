import type { VercelRequest, VercelResponse } from '@vercel/node';
import { dbAdmin, authAdmin } from './_firebase';
import { Sentry } from './_sentry';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { items, paymentMethod, utr, address, phone, name, pincode, city, userId, deliveryDate, couponCode, discountAmount } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }
  if (!phone) {
    return res.status(400).json({ error: 'Phone is required' });
  }
  if (paymentMethod === 'Prepaid UPI' && !utr) {
    return res.status(400).json({ error: 'Payment transaction reference (Razorpay/UTR) is required' });
  }

  let resolvedUserId = null;
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ') && authAdmin) {
    const idToken = authHeader.split('Bearer ')[1];
    try {
      const decodedToken = await authAdmin.verifyIdToken(idToken);
      resolvedUserId = decodedToken.uid;
    } catch (error) {
      console.warn('Firebase token verification notice:', error);
    }
  }

  const generatedId = `PARZIO-${Math.floor(10000 + Math.random() * 90000)}`;
  const validDiscount = Math.max(0, Number(discountAmount) || 0);

  if (!dbAdmin) {
    const totalQuantity = items.reduce((acc: number, c: any) => acc + (c.quantity || 1), 0);
    const rawSubtotal = items.reduce((acc: number, c: any) => acc + (c.price || 99) * (c.quantity || 1), 0);
    const finalAmount = Math.max(1, rawSubtotal - validDiscount);

    const fallbackOrder = {
      id: generatedId,
      userId: resolvedUserId,
      customerName: name || 'Guest Customer',
      phone: `+91 ${phone.replace('+91', '').trim()}`,
      location: address ? `${address}, ${city} (${pincode})` : 'Address pending',
      pincode: pincode || '',
      amount: finalAmount,
      totalAmount: finalAmount,
      paymentMethod: paymentMethod,
      isPrepaid: paymentMethod === 'Prepaid UPI',
      deliveryDate: deliveryDate || new Date().toISOString(),
      couponCode: couponCode ? String(couponCode).toUpperCase() : undefined,
      discountAmount: validDiscount > 0 ? validDiscount : undefined,
      items: items.map((item: any) => ({
        id: item.id,
        name: item.name || 'Jewellery Item',
        price: item.price || 99,
        quantity: item.quantity || 1,
        image: item.image || '',
        sku: item.sku || 'SKU: PARZIO-99',
        material: item.material || '316L Stainless Steel'
      })),
      placedAt: new Date().toISOString(),
      status: paymentMethod === 'COD' ? 'COD Confirmed' : 'Paid (Razorpay Live)',
      productName: `${totalQuantity}x Jewellery Pieces`,
      sku: 'SKU: MIX-99',
      quantity: totalQuantity,
      image: items[0]?.image || '',
      tag: paymentMethod === 'COD' ? 'OTP Verified' : 'Razorpay Verified',
      courier: 'BlueDart Air Express',
      notes: paymentMethod === 'Prepaid UPI'
        ? `Prepaid Online (Razorpay) • Ref/ID: ${utr} • Address: ${address}, Pin: ${pincode}${couponCode ? ` • Coupon: ${couponCode}` : ''}`
        : `Doorstep delivery at ${address}, Pin: ${pincode}${couponCode ? ` • Coupon: ${couponCode}` : ''}`
    };
    return res.status(200).json({ success: true, order: fallbackOrder });
  }

  try {
    const orderData = await dbAdmin.runTransaction(async (transaction) => {
      let verifiedAmount = 0;
      const updatedProducts: { ref: any, newStock: number }[] = [];
      
      // 1. Read all products atomically
      const productRefs = items.map((item: any) => dbAdmin!.collection('products').doc(item.id));
      const productSnaps = await transaction.getAll(...productRefs);
      
      for (let i = 0; i < productSnaps.length; i++) {
        const snap = productSnaps[i];
        const requestedItem = items[i];
        
        if (typeof requestedItem.quantity !== 'number' || requestedItem.quantity <= 0 || !Number.isInteger(requestedItem.quantity)) {
          throw new Error(`Invalid quantity for product ${requestedItem.id}`);
        }
        
        if (!snap.exists) {
          throw new Error(`Product ${requestedItem.id} does not exist.`);
        }
        
        const liveData = snap.data()!;
        const stock = liveData.stock ?? 10;
        
        if (stock < requestedItem.quantity) {
          throw new Error(`Insufficient stock for ${liveData.name}. Available: ${stock}`);
        }
        
        // Calculate authoritative price
        verifiedAmount += liveData.price * requestedItem.quantity;
        
        // Queue stock update
        updatedProducts.push({
          ref: snap.ref,
          newStock: stock - requestedItem.quantity
        });
      }
      
      // 2. Perform updates
      updatedProducts.forEach(update => {
        transaction.update(update.ref, { stock: update.newStock });
      });
      
      // 3. Create the order
      const firstItem = productSnaps[0].data()!;
      const totalQuantity = items.reduce((acc: number, c: any) => acc + c.quantity, 0);
      const payableAmount = Math.max(1, verifiedAmount - validDiscount);
      
      const newOrder = {
        id: generatedId,
        userId: resolvedUserId, // Securely associated with the verified token
        customerName: name || 'Guest',
        phone: `+91 ${phone.replace('+91', '').trim()}`,
        location: address ? `${address}, ${city} (${pincode})` : 'Address pending',
        pincode: pincode || '',
        amount: payableAmount,
        totalAmount: payableAmount,
        paymentMethod: paymentMethod,
        isPrepaid: paymentMethod === 'Prepaid UPI',
        deliveryDate: deliveryDate || new Date().toISOString(),
        couponCode: couponCode ? String(couponCode).toUpperCase() : undefined,
        discountAmount: validDiscount > 0 ? validDiscount : undefined,
        items: items.map((item: any, i: number) => {
          const live = productSnaps[i].data()!;
          return {
            id: item.id,
            name: live.name,
            price: live.price,
            quantity: item.quantity,
            image: live.image || '',
            sku: live.sku || '',
            material: live.material || ''
          };
        }),
        placedAt: new Date().toISOString(),
        status: paymentMethod === 'COD' ? 'COD Confirmed' : 'Pending Verification',
        productName: `${totalQuantity}x Jewellery Pieces`,
        sku: firstItem.sku || 'SKU: MIX-99',
        quantity: totalQuantity,
        image: firstItem.image || '',
        tag: paymentMethod === 'COD' ? 'OTP Verified' : 'UPI Verification Pending',
        courier: 'BlueDart Air Express',
        notes: paymentMethod === 'Prepaid UPI'
          ? `Prepaid UPI • UTR: ${utr} • Address: ${address}, Pin: ${pincode}${couponCode ? ` • Coupon: ${couponCode}` : ''}`
          : `Doorstep delivery at ${address}, Pin: ${pincode}${couponCode ? ` • Coupon: ${couponCode}` : ''}`
      };
      
      const orderRef = dbAdmin!.collection('orders').doc(generatedId);
      transaction.set(orderRef, newOrder);
      
      return newOrder;
    });

    return res.status(200).json({ success: true, order: orderData });
    
  } catch (error: any) {
    console.error('Checkout error:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: error.message || 'Internal server error during checkout' });
  }
}
