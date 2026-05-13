const fs = require('fs');
const path = require('path');

const CATEGORIES = {
  mocktails: { grad: ['#1a1a4e','#2d1b69','#00d4ff'], accent: '#00d4ff' },
  desserts:  { grad: ['#1a0a2e','#3d1468','#f093fb'], accent: '#f093fb' },
  chai:      { grad: ['#0a1a2e','#0d3b5e','#4facfe'], accent: '#4facfe' },
  pizza:     { grad: ['#2e1a0a','#5e3d0d','#fda085'], accent: '#fda085' },
  sandwich:  { grad: ['#0a2e1a','#0d5e3b','#00f2a0'], accent: '#00f2a0' },
  snacks:    { grad: ['#2e1a0a','#6b2d0f','#ff9a3c'], accent: '#ff9a3c' },
  shakes:    { grad: ['#1a0a2e','#4a1a6b','#c084fc'], accent: '#c084fc' },
};

function makeSVG(emoji, name, catKey) {
  const c = CATEGORIES[catKey] || CATEGORIES.pizza;
  const [dark, mid, light] = c.grad;
  const shortName = name.length > 28 ? name.substring(0, 28) + '…' : name;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${dark}"/>
      <stop offset="50%" stop-color="${mid}"/>
      <stop offset="100%" stop-color="${dark}"/>
    </linearGradient>
    <linearGradient id="overlay" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="transparent"/>
      <stop offset="60%" stop-color="transparent"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.75)"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
  <rect width="400" height="300" fill="url(#bg)"/>
  <circle cx="80" cy="70" r="90" fill="${light}" opacity="0.12"/>
  <circle cx="340" cy="230" r="110" fill="${light}" opacity="0.08"/>
  <circle cx="200" cy="150" r="70" fill="${light}" opacity="0.06"/>
  <text x="200" y="148" font-size="100" text-anchor="middle" dominant-baseline="middle" filter="url(#glow)">${emoji}</text>
  <rect width="400" height="300" fill="url(#overlay)"/>
  <rect x="0" y="255" width="400" height="45" fill="rgba(0,0,0,0.5)" rx="0"/>
  <text x="200" y="278" font-size="14" font-weight="600" text-anchor="middle" dominant-baseline="middle"
    fill="white" font-family="system-ui,sans-serif" opacity="0.95">${shortName}</text>
  <rect x="0" y="0" width="400" height="300" fill="none" stroke="${light}" stroke-width="1" opacity="0.15" rx="0"/>
</svg>`;
}

const ITEMS = [
  // Mocktails
  { file: 'mocktails/blue-blast',        emoji: '🥤', name: 'Model Colony Blue Blast',        cat: 'mocktails' },
  { file: 'mocktails/red-wine',          emoji: '🍷', name: 'Recharla Red Wine',              cat: 'mocktails' },
  { file: 'mocktails/strawberry',        emoji: '🍓', name: 'Seethanagarm Strawberry',        cat: 'mocktails' },
  { file: 'mocktails/virgin-mojito',     emoji: '🍹', name: 'Vantala Akka Virgin Mojito',     cat: 'mocktails' },
  { file: 'mocktails/love-byte',         emoji: '💕', name: 'Doctor Babu Love Byte',          cat: 'mocktails' },
  // Desserts
  { file: 'desserts/pani-puri-icecream', emoji: '🍦', name: 'Ice Cream Pani Puri',            cat: 'desserts' },
  { file: 'desserts/vanilla-nuts',       emoji: '🍨', name: 'Vanilla with Nuts Scoop (2)',    cat: 'desserts' },
  { file: 'desserts/choco-chips',        emoji: '🍫', name: 'Chocolate with Chips (2)',       cat: 'desserts' },
  { file: 'desserts/brownie-vanilla',    emoji: '🍰', name: 'Brownie with Vanilla',           cat: 'desserts' },
  { file: 'desserts/sizzling-brownie',   emoji: '🔥', name: 'Hot Sizzling Brownie',           cat: 'desserts' },
  // Chai & Juice
  { file: 'chai/chai-samosa',            emoji: '☕', name: 'Chai With Samosa',               cat: 'chai' },
  { file: 'chai/coffee-samosa',          emoji: '☕', name: 'Coffee with Samosa',             cat: 'chai' },
  { file: 'chai/banana-juice',           emoji: '🍌', name: 'Banana Juice',                   cat: 'chai' },
  { file: 'chai/sapota',                 emoji: '🟤', name: 'Sapota Juice',                   cat: 'chai' },
  { file: 'chai/watermelon',             emoji: '🍉', name: 'Watermelon Juice',               cat: 'chai' },
  // Pizza
  { file: 'pizza/chicken-pizza',         emoji: '🍕', name: 'Chintalapudi Chicken Pizza',     cat: 'pizza' },
  { file: 'pizza/veg-pizza',             emoji: '🍕', name: 'Venkatapuram Veg Pizza',         cat: 'pizza' },
  { file: 'pizza/paneer-pizza',          emoji: '🍕', name: 'Pothunuru Panner Pizza',         cat: 'pizza' },
  { file: 'pizza/corn-onion',            emoji: '🍕', name: 'Kanthampalem Corn Onion Pizza',  cat: 'pizza' },
  { file: 'pizza/corn-chicken',          emoji: '🍕', name: 'Crazy Corn Chicken Pizza',       cat: 'pizza' },
  // Sandwiches & Wraps
  { file: 'sandwich/cheese-loaded',      emoji: '🥪', name: 'Chintampalli Cheese Loaded',     cat: 'sandwich' },
  { file: 'sandwich/veg-sandwich',       emoji: '🥪', name: 'Venkatadrigudem Veg Sandwich',   cat: 'sandwich' },
  { file: 'sandwich/paneer-sandwich',    emoji: '🥪', name: 'Pragadavaram Panner Sandwich',   cat: 'sandwich' },
  { file: 'sandwich/egg-scramble',       emoji: '🍳', name: 'Erraguntapalli Egg Scrambled',   cat: 'sandwich' },
  { file: 'sandwich/chicken-sandwich',   emoji: '🥪', name: 'Chinnampeta Chicken Sandwich',   cat: 'sandwich' },
  { file: 'sandwich/crunch-chicken',     emoji: '🍗', name: 'Crazy Crunch Chicken Sandwich',  cat: 'sandwich' },
  { file: 'sandwich/veg-wrap',           emoji: '🌯', name: 'Velamapeta Veg Wrap',            cat: 'sandwich' },
  { file: 'sandwich/chicken-wrap',       emoji: '🌯', name: 'Muslim Street Magic Chicken Wrap', cat: 'sandwich' },
  // Snacks & Burgers
  { file: 'snacks/lollipops',            emoji: '🍗', name: 'Lingapalem Lollipops (4)',       cat: 'snacks' },
  { file: 'snacks/fried-wings',          emoji: '🍗', name: 'Dharmajigudem Fried Wings (4)',  cat: 'snacks' },
  { file: 'snacks/mad-strips',           emoji: '🍗', name: 'Merakaveedhi Mad Strips (5)',    cat: 'snacks' },
  { file: 'snacks/french-fries',         emoji: '🍟', name: 'Fathimapuram French Fries',      cat: 'snacks' },
  { file: 'snacks/cheese-fries',         emoji: '🧀', name: 'Chipurugudem Cheese Fries',      cat: 'snacks' },
  { file: 'snacks/corn-samosa',          emoji: '🥟', name: 'PCTP Cheese Corn Samosa (5)',    cat: 'snacks' },
  { file: 'snacks/veg-burger',           emoji: '🍔', name: 'Boyagudem Burger Veg',           cat: 'snacks' },
  { file: 'snacks/chicken-burger',       emoji: '🍔', name: 'RK Nagar Royal Chicken Burger',  cat: 'snacks' },
  { file: 'snacks/crunchy-chicken',      emoji: '🍗', name: 'Kovvurugudem Crunchy Chicken',   cat: 'snacks' },
  // Shakes
  { file: 'shakes/jelly-vanilla',        emoji: '🍦', name: 'Gantavari Vidhi Jelly Vanilla',  cat: 'shakes' },
  { file: 'shakes/belgium-choco',        emoji: '🍫', name: 'Balavarigudem Belgium Choco',    cat: 'shakes' },
  { file: 'shakes/black-currant',        emoji: '🫐', name: 'Battuvarigudem Black Currant',   cat: 'shakes' },
  { file: 'shakes/strawberry',           emoji: '🍓', name: 'Suprian Strawberry',             cat: 'shakes' },
  { file: 'shakes/oreo',                 emoji: '🖤', name: 'Uatasamudram Oreo',              cat: 'shakes' },
  { file: 'shakes/kitkat',               emoji: '🍫', name: 'Kotapadu Kit Kat',               cat: 'shakes' },
  { file: 'shakes/wine-wonder',          emoji: '🍷', name: 'Nagireddygudem Wine Wonder',     cat: 'shakes' },
  { file: 'shakes/mango-mastani',        emoji: '🥭', name: 'Mango Mastani (Real Fruit)',     cat: 'shakes' },
  // fallback
  { file: 'fallback',                    emoji: '🍽️', name: 'Food Item',                      cat: 'pizza' },
];

const base = path.join(__dirname, '..', 'public', 'menu');

ITEMS.forEach(({ file, emoji, name, cat }) => {
  const dir = path.join(base, path.dirname(file));
  fs.mkdirSync(dir, { recursive: true });
  const svg = makeSVG(emoji, name, cat);
  fs.writeFileSync(path.join(base, file + '.svg'), svg, 'utf8');
  console.log('✓', file + '.svg');
});

console.log('\n✅ All', ITEMS.length, 'images generated in public/menu/');
