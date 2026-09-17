import type { VercelRequest, VercelResponse } from '@vercel/node';
import { dbAdmin, authAdmin } from './_firebase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { items, paymentMethod, utr, address, phone, name, pincode, city, userId, deliveryDate } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }
  if (!phone) {
    return res.status(400).json({ error: 'Phone is required' });
  }
  if (paymentMethod === 'Prepaid UPI' && (!utr || utr.length !== 12)) {
    return res.status(400).json({ error: 'Valid 12-digit UTR is required for UPI payments' });
  }

  if (!dbAdmin || !authAdmin) {
    return res.status(500).json({ error: 'Database/Auth not initialized' });
  }

  let resolvedUserId = null;
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid Authorization header' });
  }

  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await authAdmin.verifyIdToken(idToken);
    resolvedUserId = decodedToken.uid;
  } catch (error) {
    console.error('Firebase token verification failed:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid ID token' });
  }

  const generatedId = `PARZIO-${Math.floor(10000 + Math.random() * 90000)}`;

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
      
      const newOrder = {
        id: generatedId,
        userId: resolvedUserId, // Securely associated with the verified token
        customerName: name || 'Guest',
        phone: `+91 ${phone.replace('+91', '').trim()}`,
        location: address ? `${address}, ${city} (${pincode})` : 'Address pending',
        pincode: pincode || '',
        amount: verifiedAmount,
        totalAmount: verifiedAmount,
        paymentMethod: paymentMethod,
        isPrepaid: paymentMethod === 'Prepaid UPI',
        deliveryDate: deliveryDate || new Date().toISOString(),
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
          ? `Prepaid UPI • UTR: ${utr} • Address: ${address}, Pin: ${pincode}`
          : `Doorstep delivery at ${address}, Pin: ${pincode}`
      };
      
      const orderRef = dbAdmin!.collection('orders').doc(generatedId);
      transaction.set(orderRef, newOrder);
      
      return newOrder;
    });

    return res.status(200).json({ success: true, order: orderData });
    
  } catch (error: any) {
    console.error('Transaction failure:', error);
    return res.status(400).json({ success: false, error: error.message || 'Checkout failed' });
  }
}
