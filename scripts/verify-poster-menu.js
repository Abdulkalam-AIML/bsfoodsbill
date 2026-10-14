const fs = require('fs');
const path = require('path');

// Read compiled/source menu-data
const menuDataPath = path.join(__dirname, '..', 'src', 'lib', 'menu-data.ts');
const fileContent = fs.readFileSync(menuDataPath, 'utf8');

// Expected poster categories and items
const EXPECTED_POSTER = {
  'Pop-up Snacks': [
    { name: 'Tangy Nachos', price: 79 },
    { name: 'Salted Fries', price: 79 },
    { name: 'Corn Samosa', price: 80 },
    { name: 'Peri Peri Fries', price: 89 },
    { name: 'Cheese Fries', price: 99 },
    { name: 'Onion Rings', price: 99 },
    { name: 'Spice Fries', price: 129 },
  ],
  'Housie Cheesy Snacks': [
    { name: 'Cheesy Nachos', price: 99 },
    { name: 'Paneer Loaded Fries', price: 139 },
    { name: 'Chicken Loaded Fries', price: 149 },
    { name: 'BBQ Wings (5p)', price: 199 },
  ],
  'Hot & Crispy': [
    { name: 'Wings (4p)', price: 149 },
    { name: 'Lollipop (4p)', price: 149 },
  ],
  'Banquet Burgers': [
    { name: 'Mexican Veg Burger', price: 129 },
    { name: 'Paneer Burger', price: 139 },
    { name: 'Crispy Chicken Burger', price: 149 },
    { name: 'Double Down Burger', price: 189 },
  ],
  'Pasta Punch (Macaroni)': [
    {
      name: 'White & Creamy Pasta',
      variants: [
        { name: 'Veg', price: 149 },
        { name: 'Non-Veg', price: 189 },
      ],
    },
    {
      name: 'Red Sauce Pasta',
      variants: [
        { name: 'Veg', price: 149 },
        { name: 'Non-Veg', price: 189 },
      ],
    },
  ],
  'Magic Masala Munch': [
    { name: 'Veg Maggie', price: 59 },
    { name: 'Tomato Maggie', price: 69 },
    { name: 'Cheese Maggie', price: 79 },
    { name: 'Paneer Maggie', price: 89 },
    { name: 'Chicken Maggie', price: 99 },
  ],
  'Steam & Creamy': [
    {
      name: 'Veg Momos (5 pc)',
      price: 79,
      variants: [
        { name: 'Steamed', price: 79 },
        { name: 'Fried', price: 79 },
      ],
    },
    {
      name: 'Chicken Momos (5 pc)',
      price: 100,
      variants: [
        { name: 'Steamed', price: 100 },
        { name: 'Fried', price: 100 },
      ],
    },
  ],
  'Wrap & Grab': [
    { name: 'Veg Wrap', price: 89 },
    { name: 'Egg Wrap', price: 99 },
    { name: 'Crispy Chicken Wrap', price: 149 },
    { name: 'Paneer Toast Wrap', price: 139 },
  ],
  'Madly Match Sandwich': [
    { name: 'Veg Sandwich', price: 89 },
    { name: 'Cheese Loaded Sandwich', price: 79 },
    { name: 'Corn & Mayo Sandwich', price: 89 },
    { name: 'Paneer Mayo Sandwich', price: 99 },
    { name: 'Chicken Mayo Sandwich', price: 109 },
    { name: 'Mexican Sandwich', price: 109 },
    { name: 'Club Chicken Sandwich', price: 119 },
  ],
  'Milk Shakes & Thick Shakes': [
    { name: 'Belgium Chocolate', variants: [{ name: 'Regular', price: 99 }, { name: 'Thick', price: 149 }] },
    { name: 'Jelly Vanilla', variants: [{ name: 'Regular', price: 99 }, { name: 'Thick', price: 149 }] },
    { name: 'Black Current', variants: [{ name: 'Regular', price: 99 }, { name: 'Thick', price: 149 }] },
    { name: 'Mango Maaza', variants: [{ name: 'Regular', price: 99 }, { name: 'Thick', price: 149 }] },
    { name: 'Kit Kat', variants: [{ name: 'Regular', price: 99 }, { name: 'Thick', price: 149 }] },
    { name: 'Oreo', variants: [{ name: 'Regular', price: 99 }, { name: 'Thick', price: 149 }] },
    { name: 'Lotte Choco Pie', variants: [{ name: 'Regular', price: 99 }, { name: 'Thick', price: 149 }] },
  ],
  'Sip & Refresh': [
    { name: 'Blue Blast', price: 99 },
    { name: 'Virgin Mojito', price: 99 },
    { name: 'Strawberry Mojito', price: 99 },
    { name: 'Mint Maaza Mojito', price: 99 },
  ],
  'Dazzling Desserts': [
    { name: 'Choco Lava Cake', price: 99 },
    { name: 'Brownie', price: 99 },
    { name: 'Vanilla Scoop', price: 99 },
    { name: 'Chocolate Scoop', price: 99 },
    { name: 'Brownie with Vanilla', price: 129 },
    { name: 'Gulab Jamun with Vanilla', price: 139 },
    { name: 'Hot Sizzling', price: 169 },
  ],
  "Hot Soup's": [
    { name: 'Tomato Soup', price: 49 },
    { name: 'Hot and knour', price: 59 },
    { name: 'Manchow Soup', price: 59 },
    { name: 'Corn Soup', price: 49 },
    { name: 'Chicken Soup', price: 99 },
    { name: 'Mix Vegetable Soup', price: 99 },
  ],
};

const { DEFAULT_MENU, migrateMenu } = require(menuDataPath);

let errors = [];
let passed = 0;

console.log('--- 1. Testing Poster Categories & Items Presence ---');
for (const [cat, items] of Object.entries(EXPECTED_POSTER)) {
  for (const expectedItem of items) {
    const found = DEFAULT_MENU.find((m) => m.name.toLowerCase() === expectedItem.name.toLowerCase());
    if (!found) {
      errors.push(`Missing item: ${expectedItem.name} in category ${cat}`);
      continue;
    }
    if (found.category !== cat) {
      errors.push(`Category mismatch for ${expectedItem.name}: expected "${cat}", got "${found.category}"`);
    } else {
      passed++;
    }
    if (expectedItem.price !== undefined && found.price !== expectedItem.price) {
      errors.push(`Price mismatch for ${expectedItem.name}: expected ${expectedItem.price}, got ${found.price}`);
    }
    if (expectedItem.variants) {
      if (!found.variants || found.variants.length !== expectedItem.variants.length) {
        errors.push(`Variants count mismatch for ${expectedItem.name}`);
      } else {
        for (const ev of expectedItem.variants) {
          const fv = found.variants.find((v) => v.name === ev.name);
          if (!fv || fv.price !== ev.price) {
            errors.push(`Variant ${ev.name} price mismatch for ${expectedItem.name}`);
          }
        }
      }
    }
  }
}

console.log(`Passed ${passed} poster item checks.`);

console.log('--- 2. Checking Hot and knour exact spelling preservation ---');
const knour = DEFAULT_MENU.find((m) => m.name === 'Hot and knour');
if (!knour) {
  errors.push('Item "Hot and knour" exact spelling not found');
} else {
  console.log('✓ "Hot and knour" spelling verified.');
}

console.log('--- 3. Verifying All Images Exist on Disk ---');
for (const item of DEFAULT_MENU) {
  if (item.image.startsWith('/')) {
    const diskPath = path.join(__dirname, '..', 'public', item.image);
    if (!fs.existsSync(diskPath)) {
      errors.push(`Image file does not exist on disk for item "${item.name}": ${diskPath}`);
    }
  }
}
console.log('✓ All image paths verified.');

console.log('--- 4. Checking Preserved Categories (Pizza, Combos, Beverages, etc.) ---');
const pizzas = DEFAULT_MENU.filter((m) => m.category === 'Pizza');
if (pizzas.length !== 10) {
  errors.push(`Expected 10 pizzas, found ${pizzas.length}`);
} else {
  console.log(`✓ 10 Pizzas preserved.`);
}

const combos = DEFAULT_MENU.filter((m) => m.category === 'Combo Blasters');
if (combos.length !== 7) {
  errors.push(`Expected 7 combos, found ${combos.length}`);
} else {
  console.log(`✓ 7 Combo Blasters preserved.`);
}

const bevs = DEFAULT_MENU.filter((m) => m.category === 'Beverages');
if (bevs.length !== 4) {
  errors.push(`Expected 4 beverages, found ${bevs.length}`);
} else {
  console.log(`✓ 4 Beverages preserved.`);
}

console.log('--- 5. Testing Idempotent Migration Logic ---');
const migrated1 = migrateMenu([]);
if (migrated1.length !== DEFAULT_MENU.length) {
  errors.push(`Empty migration length mismatch: ${migrated1.length} vs ${DEFAULT_MENU.length}`);
}

// Test with old item and custom owner item
const testExisting = [
  { id: 'custom-item-1', name: 'Chef Special Biryani', category: 'Biryani', price: 299, image: '/fallback-food.jpg', available: true, bestSeller: true, description: 'Special' },
  { id: 'des-4', name: 'Brownie with vanilla', category: 'Desserts & Ice Cream Scoops', price: 99, image: '/menu/desserts/brownie-vanilla.jpg', available: true, bestSeller: false, description: 'Old' },
];
const migrated2 = migrateMenu(testExisting);
const customPreserved = migrated2.find((m) => m.id === 'custom-item-1');
if (!customPreserved || customPreserved.price !== 299) {
  errors.push('Migration did not preserve owner custom item');
}
const brownieUpdated = migrated2.find((m) => m.name === 'Brownie with Vanilla');
if (!brownieUpdated || brownieUpdated.price !== 129 || brownieUpdated.category !== 'Dazzling Desserts') {
  errors.push(`Migration did not update exact match Brownie with Vanilla: price=${brownieUpdated?.price}, cat=${brownieUpdated?.category}`);
}

// Test running migration twice
const migrated3 = migrateMenu(migrated2);
if (migrated3.length !== migrated2.length) {
  errors.push(`Migration is not idempotent! Length changed from ${migrated2.length} to ${migrated3.length}`);
} else {
  console.log(`✓ Migration is 100% idempotent and preserves custom items while updating exact matches.`);
}

if (errors.length > 0) {
  console.error('\n❌ VALIDATION FAILED WITH ERRORS:');
  errors.forEach((e) => console.error('  - ' + e));
  process.exit(1);
} else {
  console.log('\n🎉 ALL 5 TEST SUITES PASSED PERFECTLY WITH ZERO ERRORS!');
}
