import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyClxzB1hANXPC6HtBtVku9_it1xmSu9hkM",
  authDomain: "parzio-a62b4.firebaseapp.com",
  projectId: "parzio-a62b4",
  storageBucket: "parzio-a62b4.firebasestorage.app",
  messagingSenderId: "814679262936",
  appId: "1:814679262936:web:b126b4926990563243f9ad"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const DUMMY_PRODUCT_IDS = new Set([
  'hero-coin-bracelet',
  'prod-red-bangles',
  'prod-velvet-bangles',
  'prod-infinity-mangalsutra',
  'prod-solitaire-mangalsutra',
  'prod-teardrop-earrings',
  'prod-snake-chain-necklace',
  'prod-croissant-dome-ring',
  'prod-dome-croissant-ring'
]);

const DUMMY_NAMES = new Set([
  'coin charm link bracelet',
  'traditional red bangles set',
  'royal velvet touch bangles',
  'modern infinity gold mangalsutra',
  'dainty single solitaire mangalsutra',
  'viral high-polish teardrop earrings',
  'liquid gold herringbone snake chain',
  'chunky croissant dome ring'
]);

async function cleanDummyProducts() {
  console.log('🔍 Fetching all products from Cloud Firestore...');
  const snapshot = await getDocs(collection(db, 'products'));
  console.log(`Found ${snapshot.size} total products in Firestore.`);

  let deletedCount = 0;
  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const id = docSnap.id;
    const name = (data.name || '').trim().toLowerCase();

    const isDummy = DUMMY_PRODUCT_IDS.has(id) || DUMMY_NAMES.has(name) || name.includes('croissant') || name.includes('coin charm') || name.includes('herringbone') || name.includes('solitaire mangalsutra') || name.includes('infinity gold') || name.includes('teardrop earrings') || name.includes('velvet touch') || name.includes('traditional red');

    if (isDummy) {
      console.log(`🗑️ Deleting dummy product: [${id}] "${data.name}"`);
      await deleteDoc(doc(db, 'products', id));
      deletedCount++;
    } else {
      console.log(`✅ Keeping user product: [${id}] "${data.name}" (₹${data.price})`);
    }
  }

  console.log(`\n🎉 Finished! Deleted ${deletedCount} dummy products from Cloud Firestore.`);
  process.exit(0);
}

cleanDummyProducts().catch(err => {
  console.error('Error cleaning dummy products:', err);
  process.exit(1);
});
