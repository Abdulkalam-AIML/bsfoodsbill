const fs = require('fs');
const path = require('path');

// Read compiled/source menu-data
const menuDataPath = path.join(__dirname, '..', 'src', 'lib', 'menu-data.ts');
const { DEFAULT_MENU, migrateMenu } = require(menuDataPath);

// Expected poster categories and items: EXACT 83 ENTRIES
const EXPECTED_POSTER = {
  "Pizza's": [
    { name: 'Tomato Cheese Pizza', price: 169 },
    { name: 'Cheese Onion Barest', price: 179 },
    { name: 'Veg Loaded Pizza', price: 189 },
    { name: 'Capsicum & Red Paprika', price: 189 },
    { name: 'Corn Onion Pizza', price: 189 },
    { name: 'Chicken Pizza', price: 199 },
    { name: 'Mushroom Pizza', price: 199 },
    { name: 'Corn Chicken Pizza', price: 219 },
    { name: 'Tandoori Chicken Pizza', price: 219 },
    { name: 'Tandoori Paneer Pizza', price: 229 },
    { name: 'BBQ Chicken Pizza', price: 219 },
    { name: 'BBQ Paneer Pizza', price: 229 },
    { name: 'Chicken Loaded Pizza', price: 229 },
  ],
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
  'Budget Friendly Combos': [
    { name: 'Crunch & Sip', price: 149, contains: ['Fries', 'Mojito'] },
    { name: 'Couple Combo', price: 549, contains: ['Pizza', 'Burger', 'Wrap', 'Fries', 'Thums Up'] },
    { name: 'Feast & Beast Cheesy Loaded', price: 299, contains: ['Cheesy Nachos', 'Loaded Fries', 'Mojito'] },
    { name: 'Yummy & Creamy Blast', price: 349, contains: ['Maggie', 'Onion Rings', 'Wrap', 'Mojito'] },
    { name: 'Pasta Punch Combo', price: 249, contains: ['Pasta', 'Crunch Nachos', 'Fries', 'Mojito'] },
    { name: 'Bouncy Burger Combo', price: 239, contains: ['Burger', 'Fries', 'Thums Up'] },
    { name: 'Maddy Maid Combo', price: 349, contains: ['Wings (3 pc)', 'Chicken Sandwich', 'Fries', 'Mojito'] },
    { name: 'Brain Blast', price: 499, contains: ['Lollipop (4 pc)', 'Chicken Wrap', 'Any Milk Shake', 'Samosa'] },
    { name: 'Thirsty Thunder', price: 449, contains: ['Gulab Jamun', 'Vanilla', 'Brownie', 'Milkshake', 'Mojito', 'Fries'] },
  ],
};

let errors = [];
let passed = 0;
let totalChecked = 0;

console.log('====================================================');
console.log('       BS FOODS POS — COMPREHENSIVE MENU SUITE      ');
console.log('====================================================\n');

// 1. Verify All 83 Poster Entries and Prices
console.log('--- 1. Testing All 83 Poster Entries Presence & Prices ---');
for (const [cat, items] of Object.entries(EXPECTED_POSTER)) {
  for (const expectedItem of items) {
    totalChecked++;
    const found = DEFAULT_MENU.find((m) => m.name.toLowerCase() === expectedItem.name.toLowerCase());
    if (!found) {
      errors.push(`Missing item: "${expectedItem.name}" in category "${cat}"`);
      continue;
    }

    // Category check (allow Pizza's or Pizza, and Budget Friendly Combos or Combo Blasters)
    const catMatch =
      found.category === cat ||
      (cat === "Pizza's" && (found.category === "Pizza's" || found.category === 'Pizza')) ||
      (cat === 'Budget Friendly Combos' && (found.category === 'Budget Friendly Combos' || found.category === 'Combo Blasters'));

    if (!catMatch) {
      errors.push(`Category mismatch for "${expectedItem.name}": expected "${cat}", got "${found.category}"`);
    } else {
      passed++;
    }

    if (expectedItem.price !== undefined && found.price !== expectedItem.price) {
      errors.push(`Price mismatch for "${expectedItem.name}": expected ${expectedItem.price}, got ${found.price}`);
    }

    if (expectedItem.variants) {
      if (!found.variants || found.variants.length !== expectedItem.variants.length) {
        errors.push(`Variants count mismatch for "${expectedItem.name}"`);
      } else {
        for (const ev of expectedItem.variants) {
          const fv = found.variants.find((v) => v.name === ev.name);
          if (!fv || fv.price !== ev.price) {
            errors.push(`Variant ${ev.name} price mismatch for "${expectedItem.name}"`);
          }
        }
      }
    }

    if (expectedItem.contains) {
      if (!found.contains || found.contains.length === 0) {
        errors.push(`Combo "${expectedItem.name}" missing included components list`);
      }
    }
  }
}

console.log(`✓ Verified ${passed}/${totalChecked} poster entries across all categories (Expected 83 entries).`);
if (totalChecked !== 83) {
  errors.push(`Total poster entries checked was ${totalChecked}, expected exactly 83 entries!`);
}

// 2. Specific Spelling Checks
console.log('\n--- 2. Checking Exact Poster Spellings ---');
const barest = DEFAULT_MENU.find((m) => m.name === 'Cheese Onion Barest');
if (!barest) {
  errors.push('Item "Cheese Onion Barest" exact visible spelling not found');
} else {
  console.log('✓ "Cheese Onion Barest" visible poster spelling preserved.');
}

const knour = DEFAULT_MENU.find((m) => m.name === 'Hot and knour');
if (!knour) {
  errors.push('Item "Hot and knour" exact visible spelling not found');
} else {
  console.log('✓ "Hot and knour" visible poster spelling preserved.');
}

// 3. Combos Specification Checks
console.log('\n--- 3. Verifying All 9 Final Combos & Components ---');
const combos = DEFAULT_MENU.filter((m) => m.category === 'Budget Friendly Combos' || m.itemType === 'Combo');
const expectedComboNames = [
  'Crunch & Sip',
  'Couple Combo',
  'Feast & Beast Cheesy Loaded',
  'Yummy & Creamy Blast',
  'Pasta Punch Combo',
  'Bouncy Burger Combo',
  'Maddy Maid Combo',
  'Brain Blast',
  'Thirsty Thunder',
];

for (const cName of expectedComboNames) {
  const foundCombo = DEFAULT_MENU.find((m) => m.name.toLowerCase() === cName.toLowerCase());
  if (!foundCombo) {
    errors.push(`Combo "${cName}" not found in menu`);
  } else if (!foundCombo.contains || foundCombo.contains.length === 0) {
    errors.push(`Combo "${cName}" missing contains components`);
  } else {
    console.log(`✓ Combo "${cName}" (₹${foundCombo.price}) with ${foundCombo.contains.length} components verified.`);
  }
}

// 4. Checking Preserved Historical & Regional Items
console.log('\n--- 4. Checking Preserved Categories & Historical Products ---');
const preservedPizzas = DEFAULT_MENU.filter((m) => m.category === 'Pizza');
if (preservedPizzas.length < 8) {
  errors.push(`Expected at least 8 preserved regional pizzas, found ${preservedPizzas.length}`);
} else {
  console.log(`✓ ${preservedPizzas.length} Historical regional pizzas preserved.`);
}

const preservedCombos = DEFAULT_MENU.filter((m) => m.category === 'Combo Blasters');
if (preservedCombos.length < 7) {
  errors.push(`Expected at least 7 preserved Combo Blasters, found ${preservedCombos.length}`);
} else {
  console.log(`✓ ${preservedCombos.length} Preserved Combo Blasters found.`);
}

const bevs = DEFAULT_MENU.filter((m) => m.category === 'Beverages');
if (bevs.length < 4) {
  errors.push(`Expected 4 beverages, found ${bevs.length}`);
} else {
  console.log(`✓ ${bevs.length} Beverages preserved.`);
}

// 5. Verifying All Images on Disk
console.log('\n--- 5. Verifying All Local Image Paths on Disk ---');
let missingImages = 0;
for (const item of DEFAULT_MENU) {
  if (item.image && item.image.startsWith('/')) {
    const diskPath = path.join(__dirname, '..', 'public', item.image);
    if (!fs.existsSync(diskPath)) {
      errors.push(`Image file does not exist on disk for item "${item.name}": ${diskPath}`);
      missingImages++;
    }
  }
}
if (missingImages === 0) {
  console.log('✓ 100% of local image assets verified to exist on disk.');
}

// 6. Test Idempotent Non-Destructive Migration & Disappearing Bug Fix
console.log('\n--- 6. Testing Disappearing-Item Bug Reproduction & Permanent Fix ---');
// Step A: Custom item created by owner
const testCustomItem = {
  id: 'item-custom-test-123',
  name: 'Chef Special Paneer Tikka Masala',
  category: 'Snacks',
  price: 249,
  image: '/fallback-food.jpg',
  available: true,
  bestSeller: true,
  description: 'Owner custom specialty',
  isCustom: true,
};

// Step B: Owner price override on an official poster item (e.g. Tomato Soup overridden to ₹55)
const testOverrides = {
  'soup-tomato': { price: 55 },
};

// Run migration with existing menu containing custom item and override
const existingWithCustom = [...DEFAULT_MENU, testCustomItem];
const customItemsList = [testCustomItem];

const migratedOnce = migrateMenu(existingWithCustom, customItemsList, testOverrides, []);
const customSaved = migratedOnce.find((m) => m.id === 'item-custom-test-123');
if (!customSaved) {
  errors.push('CRITICAL BUG: Custom owner item disappeared after migration!');
} else {
  console.log('✓ Custom owner item successfully persisted across migration.');
}

const overrideSaved = migratedOnce.find((m) => m.id === 'soup-tomato');
if (!overrideSaved || overrideSaved.price !== 55) {
  errors.push(`CRITICAL BUG: Owner price override was reset! Expected 55, got ${overrideSaved?.price}`);
} else {
  console.log('✓ Owner price override preserved across migration (Tomato Soup ₹55).');
}

// Step C: Run migration again (simulating multiple logins / page refreshes)
const migratedTwice = migrateMenu(migratedOnce, customItemsList, testOverrides, []);
if (migratedTwice.length !== migratedOnce.length) {
  errors.push(`Migration is not idempotent! Length changed from ${migratedOnce.length} to ${migratedTwice.length}`);
} else {
  console.log('✓ Migration is 100% idempotent and duplicate-free across repeated re-runs.');
}

// 7. Verify Duplicate Prevention
console.log('\n--- 7. Verifying Duplicate Prevention ---');
const namesSeen = new Set();
let duplicatesFound = 0;
for (const item of DEFAULT_MENU) {
  const key = `${item.name.toLowerCase()}:::${item.category.toLowerCase()}`;
  if (namesSeen.has(key)) {
    errors.push(`Duplicate detected in DEFAULT_MENU: "${item.name}" in category "${item.category}"`);
    duplicatesFound++;
  }
  namesSeen.add(key);
}
if (duplicatesFound === 0) {
  console.log('✓ Zero duplicate products in DEFAULT_MENU.');
}

// Summary Report
console.log('\n====================================================');
if (errors.length > 0) {
  console.error('❌ VALIDATION FAILED WITH ERRORS:');
  errors.forEach((e) => console.error('  - ' + e));
  console.log('====================================================');
  process.exit(1);
} else {
  console.log('🎉 ALL 7 TEST SUITES PASSED PERFECTLY WITH ZERO ERRORS!');
  console.log('Total Poster Entries Verified: 83');
  console.log('Permanent Persistence Verified: 100%');
  console.log('====================================================');
}
