// ============================================
// BS FOODS - Complete Menu Database v3
// Images: local JPGs in /public/menu/ (never break)
// ============================================
import type { MenuItem } from '@/types';

export const DEFAULT_MENU: MenuItem[] = [

  // ─── PIZZA ───
  { id:'piz-1', name:'Chintalapudi Chicken Pizza',    category:'Pizza', price:199, image:'/menu/pizza/chicken-pizza.jpg', imageAlt:'Chicken pizza',       description:'Spicy chicken loaded pizza with cheese',  available:true, bestSeller:true  },
  { id:'piz-2', name:'Cheese onion burst (Veg)',      category:'Pizza', price:199, image:'/menu/pizza/veg-pizza.jpg',    imageAlt:'Veg pizza',           description:'Fresh veggie loaded pizza',               available:true, bestSeller:false },
  { id:'piz-3', name:'BBQ panner pizza',              category:'Pizza', price:219, image:'/menu/pizza/paneer-pizza.jpg', imageAlt:'Paneer pizza',        description:'Spicy paneer tikka on crispy base',       available:true, bestSeller:true  },
  { id:'piz-4', name:'BBQ Chicken Pizza',             category:'Pizza', price:219, image:'/menu/pizza/chicken-pizza.jpg', imageAlt:'Chicken pizza',      description:'BBQ chicken pizza',                       available:true, bestSeller:false },
  { id:'piz-5', name:'Tandoori chicken pizza',        category:'Pizza', price:219, image:'/menu/pizza/chicken-pizza.jpg', imageAlt:'Chicken pizza',      description:'Tandoori chicken pizza',                  available:true, bestSeller:true  },
  { id:'piz-6', name:'Chicken Cheese Loaded',         category:'Pizza', price:199, image:'/menu/pizza/chicken-pizza.jpg', imageAlt:'Chicken pizza',      description:'Chicken cheese loaded pizza',             available:true, bestSeller:false },
  { id:'piz-7', name:'Venkatapuram veg Pizza star',   category:'Pizza', price:179, image:'/menu/pizza/veg-pizza.jpg',    imageAlt:'Veg pizza',           description:'Fresh veggie loaded pizza star',          available:true, bestSeller:false },
  { id:'piz-8', name:'Pothunuru Panner pizza',        category:'Pizza', price:189, image:'/menu/pizza/paneer-pizza.jpg', imageAlt:'Paneer pizza',        description:'Spicy paneer tikka on crispy base',       available:true, bestSeller:true  },
  { id:'piz-9', name:'Kanthampalem Corn Onion Pizza', category:'Pizza', price:189, image:'/menu/pizza/corn-onion.jpg',   imageAlt:'Corn onion pizza',    description:'Sweet corn & caramelised onion pizza',    available:true, bestSeller:false },
  { id:'piz-10',name:'Koppula vari Corn Chicken Pizza',category:'Pizza',price:229, image:'/menu/pizza/corn-chicken.jpg', imageAlt:'Corn chicken pizza',  description:'Loaded corn & juicy chicken pizza',       available:true, bestSeller:true  },

  // ─── SNACKS ───
  { id:'snk-1', name:'Lingapalem lollipops (4)',      category:'Snacks', price:149, image:'/menu/snacks/lollipops.jpg',      imageAlt:'Chicken lollipops',    description:'4 pcs crispy chicken lollipops',   available:true, bestSeller:true  },
  { id:'snk-2', name:'Dharmajigudem Fried Wings (4)', category:'Snacks', price:139, image:'/menu/snacks/fried-wings.jpg',    imageAlt:'Fried wings',          description:'4 pcs golden fried chicken wings', available:true, bestSeller:false },
  { id:'snk-3', name:'Merakaveedhi Mad Strips (5)',   category:'Snacks', price:149, image:'/menu/snacks/mad-strips.jpg',     imageAlt:'Chicken strips',       description:'5 pcs crispy chicken strips',       available:true, bestSeller:false },
  { id:'snk-4', name:'Asramam Veedhi Panner fingers', category:'Snacks', price:149, image:'/menu/snacks/corn-samosa.jpg',    imageAlt:'Paneer fingers',       description:'Crispy paneer fingers',             available:true, bestSeller:false },
  { id:'snk-5', name:'Fathimapuram French Fries',     category:'Snacks', price:89,  image:'/menu/snacks/french-fries.jpg',   imageAlt:'French fries',         description:'Golden crispy salted fries',        available:true, bestSeller:true  },
  { id:'snk-6', name:'Chipurugudem Cheese Fries',     category:'Snacks', price:99,  image:'/menu/snacks/cheese-fries.jpg',   imageAlt:'Cheese fries',         description:'Fries with melted cheese sauce',    available:true, bestSeller:true  },
  { id:'snk-7', name:'PCTP Chese Corn Somasa (5)',    category:'Snacks', price:79,  image:'/menu/snacks/corn-samosa.jpg',    imageAlt:'Cheese corn samosa',   description:'5 pcs crispy cheese corn samosa',   available:true, bestSeller:false },
  { id:'snk-8', name:'Namavarm naughty pop corn panner',category:'Snacks',price:189,image:'/menu/snacks/corn-samosa.jpg',    imageAlt:'Pop corn paneer',      description:'Naughty pop corn paneer',           available:true, bestSeller:false },
  { id:'snk-9', name:'SBI Colony Chicken Pop Corn',   category:'Snacks', price:199, image:'/menu/snacks/crunchy-chicken.jpg',imageAlt:'Chicken pop corn',     description:'Crispy chicken pop corn',           available:true, bestSeller:false },

  // ─── SANDWICH ───
  { id:'san-1', name:'Chintampalli Cheese Loaded',    category:'Sandwich', price:79,  image:'/menu/sandwich/cheese-loaded.jpg',    imageAlt:'Cheese sandwich',        description:'Double cheese grilled sandwich',        available:true, bestSeller:false },
  { id:'san-2', name:'Venkatadrigudem veg Sandwich',  category:'Sandwich', price:89,  image:'/menu/sandwich/veg-sandwich.jpg',     imageAlt:'Veg sandwich',           description:'Grilled veggie sandwich with herbs',    available:true, bestSeller:false },
  { id:'san-3', name:'Pragadavaram panner Sandwich',  category:'Sandwich', price:89,  image:'/menu/sandwich/paneer-sandwich.jpg',  imageAlt:'Paneer sandwich',        description:'Paneer with spicy chutney in toast',   available:true, bestSeller:false },
  { id:'san-4', name:'Erraguntapalli Kaju Chicken',   category:'Sandwich', price:99,  image:'/menu/sandwich/chicken-sandwich.jpg', imageAlt:'Kaju chicken sandwich',  description:'Kaju chicken sandwich',                 available:true, bestSeller:false },
  { id:'san-5', name:'Chinnampeta Chicken Sandwich',  category:'Sandwich', price:99,  image:'/menu/sandwich/chicken-sandwich.jpg', imageAlt:'Chicken sandwich',       description:'Juicy grilled chicken sandwich',        available:true, bestSeller:true  },
  { id:'san-6', name:'Crazy Crunch Chicken Sandwich', category:'Sandwich', price:149, image:'/menu/sandwich/crunch-chicken.jpg',   imageAlt:'Crunchy chicken sandwich',description:'Crispy fried chicken with slaw',        available:true, bestSeller:true  },

  // ─── BURGERS ───
  { id:'bur-1', name:'Boyagudem Burger veg',          category:'Burgers', price:99,  image:'/menu/snacks/veg-burger.jpg',     imageAlt:'Veg burger',           description:'Crispy veg patty burger',           available:true, bestSeller:false },
  { id:'bur-2', name:'Rk Nagar Royal Chicken Burger', category:'Burgers', price:129, image:'/menu/snacks/chicken-burger.jpg', imageAlt:'Chicken burger',       description:'Juicy chicken with royal sauce',    available:true, bestSeller:true  },
  { id:'bur-3', name:'Errampalli Yummy Panner Burger',category:'Burgers', price:119, image:'/menu/snacks/veg-burger.jpg',     imageAlt:'Paneer burger',        description:'Yummy paneer burger',               available:true, bestSeller:false },

  // ─── MOCKTAILS ───
  { id:'moc-1', name:'Model Colony Blue Blast',       category:'Mocktails', price:99,  image:'/menu/mocktails/blue-blast.jpg',        imageAlt:'Blue blast mocktail',    description:'Electric blue citrus cooler',            available:true, bestSeller:true  },
  { id:'moc-2', name:'Recharla Red Wine',             category:'Mocktails', price:99,  image:'/menu/mocktails/red-wine.jpg',           imageAlt:'Red wine mocktail',      description:'Deep ruby red grape & berry mocktail',   available:true, bestSeller:false },
  { id:'moc-3', name:'Seethanagarm Strawberry',       category:'Mocktails', price:99,  image:'/menu/mocktails/strawberry.jpg',         imageAlt:'Strawberry mocktail',    description:'Fresh strawberry crush with mint & soda',available:true, bestSeller:false },
  { id:'moc-4', name:'Vantala akka Virgin mojito',    category:'Mocktails', price:99,  image:'/menu/mocktails/virgin-mojito.jpg',      imageAlt:'Virgin mojito',          description:'Classic mint-lime mojito',               available:true, bestSeller:true  },
  { id:'moc-5', name:'Doctor Babu Love byte',         category:'Mocktails', price:129, image:'/menu/mocktails/love-byte.jpg',          imageAlt:'Love byte mocktail',     description:'Passion fruit & lychee premium blend',   available:true, bestSeller:false },

  // ─── DESSERTS & ICE CREAM SCOOPS ───
  { id:'des-1', name:'Lava Cake',                     category:'Desserts & Ice Cream Scoops', price:189, image:'/menu/desserts/sizzling-brownie.jpg', imageAlt:'Lava cake',               description:'Warm lava cake',                                  available:true, bestSeller:true  },
  { id:'des-2', name:'Vanilla with nuts (2) scoop',   category:'Desserts & Ice Cream Scoops', price:89,  image:'/menu/desserts/vanilla-nuts.jpg',       imageAlt:'Vanilla with nuts',       description:'2 scoops creamy vanilla with crunchy nuts',       available:true, bestSeller:false },
  { id:'des-3', name:'Chocolate with (2) scoop',      category:'Desserts & Ice Cream Scoops', price:89,  image:'/menu/desserts/choco-chips.jpg',        imageAlt:'Chocolate with chips',    description:'2 scoops rich chocolate with chips',              available:true, bestSeller:false },
  { id:'des-4', name:'Brownie with vanilla',          category:'Desserts & Ice Cream Scoops', price:99,  image:'/menu/desserts/brownie-vanilla.jpg',    imageAlt:'Brownie with vanilla',    description:'Warm fudge brownie with vanilla scoop',           available:true, bestSeller:true  },
  { id:'des-5', name:'Hot Sizzling Brownie',          category:'Desserts & Ice Cream Scoops', price:129, image:'/menu/desserts/sizzling-brownie.jpg',   imageAlt:'Hot sizzling brownie',    description:'Sizzling brownie with ice cream & chocolate',     available:true, bestSeller:true  },

  // ─── THICK SHAKES & MILK SHAKES ───
  { id:'shk-1n', name:'Gantavari vidhi GELLY Vanilla',          category:'Thick Shakes & Milk Shakes', price:89,  image:'/menu/shakes/jelly-vanilla.jpg', imageAlt:'Jelly vanilla shake',   description:'Vanilla shake with jelly — Normal',     available:true, bestSeller:false, badge:'Normal ₹89 / Thick ₹149' },
  { id:'shk-1t', name:'Gantavari vidhi GELLY Vanilla (Thick)',  category:'Thick Shakes & Milk Shakes', price:149, image:'/menu/shakes/jelly-vanilla.jpg', imageAlt:'Jelly vanilla thick',   description:'Vanilla shake with jelly — Thick',      available:true, bestSeller:false, badge:'Thick Shake' },
  { id:'shk-2n', name:'Balavarigudem Belgium Choco',             category:'Thick Shakes & Milk Shakes', price:99,  image:'/menu/shakes/belgium-choco.jpg', imageAlt:'Belgium choco shake',   description:'Rich Belgian chocolate — Normal',        available:true, bestSeller:true,  badge:'Normal ₹99 / Thick ₹149' },
  { id:'shk-2t', name:'Balavarigudem Belgium Choco (Thick)',     category:'Thick Shakes & Milk Shakes', price:149, image:'/menu/shakes/belgium-choco.jpg', imageAlt:'Belgium choco thick',   description:'Rich Belgian chocolate — Thick',         available:true, bestSeller:false, badge:'Thick Shake' },
  { id:'shk-3n', name:'Battuvarigudem Black Currant',            category:'Thick Shakes & Milk Shakes', price:99,  image:'/menu/shakes/black-currant.jpg', imageAlt:'Black currant shake',   description:'Black currant shake — Normal',           available:true, bestSeller:false, badge:'Normal ₹99 / Thick ₹149' },
  { id:'shk-3t', name:'Battuvarigudem Black Currant (Thick)',    category:'Thick Shakes & Milk Shakes', price:149, image:'/menu/shakes/black-currant.jpg', imageAlt:'Black currant thick',   description:'Black currant shake — Thick',            available:true, bestSeller:false, badge:'Thick Shake' },
  { id:'shk-4n', name:'Supriya Strawberry',                      category:'Thick Shakes & Milk Shakes', price:99,  image:'/menu/shakes/strawberry.jpg',    imageAlt:'Strawberry shake',      description:'Fresh strawberry shake — Normal',        available:true, bestSeller:false, badge:'Normal ₹99 / Thick ₹149' },
  { id:'shk-4t', name:'Supriya Strawberry (Thick)',              category:'Thick Shakes & Milk Shakes', price:149, image:'/menu/shakes/strawberry.jpg',    imageAlt:'Strawberry thick',      description:'Fresh strawberry shake — Thick',         available:true, bestSeller:false, badge:'Thick Shake' },
  { id:'shk-5n', name:'Utasamudram Oreo',                        category:'Thick Shakes & Milk Shakes', price:89,  image:'/menu/shakes/oreo.jpg',          imageAlt:'Oreo shake',            description:'Creamy Oreo milkshake — Normal',         available:true, bestSeller:true,  badge:'Normal ₹89 / Thick ₹139' },
  { id:'shk-5t', name:'Utasamudram Oreo (Thick)',                category:'Thick Shakes & Milk Shakes', price:139, image:'/menu/shakes/oreo.jpg',          imageAlt:'Oreo thick shake',      description:'Creamy Oreo milkshake — Thick',          available:true, bestSeller:false, badge:'Thick Shake' },
  { id:'shk-6n', name:'Kotapadu Kit kat',                        category:'Thick Shakes & Milk Shakes', price:89,  image:'/menu/shakes/kitkat.jpg',        imageAlt:'Kit Kat shake',         description:'Kit Kat blended shake — Normal',         available:true, bestSeller:false, badge:'Normal ₹89 / Thick ₹139' },
  { id:'shk-6t', name:'Kotapadu Kit kat (Thick)',                category:'Thick Shakes & Milk Shakes', price:139, image:'/menu/shakes/kitkat.jpg',        imageAlt:'Kit Kat thick shake',   description:'Kit Kat blended shake — Thick',          available:true, bestSeller:false, badge:'Thick Shake' },
  { id:'shk-7n', name:'Nagireddygudem Wine wonder',              category:'Thick Shakes & Milk Shakes', price:99,  image:'/menu/shakes/wine-wonder.jpg',   imageAlt:'Wine wonder shake',     description:'Wine flavoured shake — Normal',          available:true, bestSeller:false, badge:'Normal ₹99 / Thick ₹149' },
  { id:'shk-7t', name:'Nagireddygudem Wine wonder (Thick)',      category:'Thick Shakes & Milk Shakes', price:149, image:'/menu/shakes/wine-wonder.jpg',   imageAlt:'Wine wonder thick',     description:'Wine flavoured shake — Thick',           available:true, bestSeller:false, badge:'Thick Shake' },

  // ─── OFFERS ───
  { id:'off-99',  name:'Offer Price - ₹99',  category:'Offers', price:99,  image:'/menu/offers/offer-99.webp',  imageAlt:'Offer Price 99',  description:'Quick-add promotional combo offer', available:true, bestSeller:false, badge:'🎁 Special Offer' },
  { id:'off-150', name:'Offer Price - ₹150', category:'Offers', price:150, image:'/menu/offers/offer-150.webp', imageAlt:'Offer Price 150', description:'Quick-add premium combo offer',     available:true, bestSeller:false, badge:'🎁 Promo Deal' },

  // ─── EXTRAS ───
  { id:'ext-10',  name:'Extra Charge - ₹10', category:'Extras', price:10,  image:'/menu/extras/extra.jpg',     imageAlt:'Extra 10',        description:'Additional custom charge of ₹10',  available:true, bestSeller:false, badge:'➕ Extra' },
  { id:'ext-20',  name:'Extra Charge - ₹20', category:'Extras', price:20,  image:'/menu/extras/extra.jpg',     imageAlt:'Extra 20',        description:'Additional custom charge of ₹20',  available:true, bestSeller:false, badge:'➕ Extra' },
  { id:'ext-30',  name:'Extra Charge - ₹30', category:'Extras', price:30,  image:'/menu/extras/extra.jpg',     imageAlt:'Extra 30',        description:'Additional custom charge of ₹30',  available:true, bestSeller:false, badge:'➕ Extra' },

  // ─── UTILITY ───
  { id:'ut-rk500', name:'Royal Kissan 500ml', category:'Utility', price:10, image:'/menu/utilities/water-bottle.webp', imageAlt:'Royal Kissan 500ml', description:'Royal Kissan 500ml Water', available:true, bestSeller:false, badge:'💧 Utility' },
  { id:'ut-rk1l', name:'Royal Kissan 1L', category:'Utility', price:20, image:'/menu/utilities/water-bottle.webp', imageAlt:'Royal Kissan 1L', description:'Royal Kissan 1L Water', available:true, bestSeller:false, badge:'💧 Utility' },

  // ─── BIRYANI ───
  { id:'bir-1', name:'Chicken Dum Biryani', category:'Biryani', price:149, image:'/fallback-food.jpg', imageAlt:'Chicken Dum Biryani', description:'Chicken Dum Biryani', available:true, bestSeller:true },
  { id:'bir-2', name:'Chicken Dum Biryani Full', category:'Biryani', price:249, image:'/fallback-food.jpg', imageAlt:'Chicken Dum Biryani Full', description:'Chicken Dum Biryani Full', available:true, bestSeller:false },
  { id:'bir-3', name:'Chicken Fry Piece Biryani', category:'Biryani', price:159, image:'/fallback-food.jpg', imageAlt:'Chicken Fry Piece Biryani', description:'Chicken Fry Piece Biryani', available:true, bestSeller:true },
  { id:'bir-4', name:'Chicken Fry Piece Biryani Full', category:'Biryani', price:279, image:'/fallback-food.jpg', imageAlt:'Chicken Fry Piece Biryani Full', description:'Chicken Fry Piece Biryani Full', available:true, bestSeller:false },
  { id:'bir-5', name:'Egg Biryani', category:'Biryani', price:129, image:'/fallback-food.jpg', imageAlt:'Egg Biryani', description:'Egg Biryani', available:true, bestSeller:false },
  { id:'bir-6', name:'Fish Biryani', category:'Biryani', price:219, image:'/fallback-food.jpg', imageAlt:'Fish Biryani', description:'Fish Biryani', available:true, bestSeller:false },
  { id:'bir-7', name:'Prawns Biryani', category:'Biryani', price:239, image:'/fallback-food.jpg', imageAlt:'Prawns Biryani', description:'Prawns Biryani', available:true, bestSeller:false },
  { id:'bir-8', name:'Chicken Fried Rice', category:'Biryani', price:169, image:'/fallback-food.jpg', imageAlt:'Chicken Fried Rice', description:'Chicken Fried Rice', available:true, bestSeller:false },

  // ─── BEVERAGES ───
  { id:'bev-1', name:'Thumbs Up 300ml', category:'Beverages', price:30, image:'/fallback-food.jpg', imageAlt:'Thumbs Up 300ml', description:'Thumbs Up 300ml', available:true, bestSeller:false },
  { id:'bev-2', name:'Thumbs Up 1L', category:'Beverages', price:50, image:'/fallback-food.jpg', imageAlt:'Thumbs Up 1L', description:'Thumbs Up 1L', available:true, bestSeller:false },
  { id:'bev-3', name:'Thums Up 250ml', category:'Beverages', price:20, image:'/fallback-food.jpg', imageAlt:'Thums Up 250ml', description:'Thums Up 250ml', available:true, bestSeller:true },
  { id:'bev-4', name:'Coke 250ml', category:'Beverages', price:20, image:'/fallback-food.jpg', imageAlt:'Coke 250ml', description:'Coke 250ml', available:true, bestSeller:true },

  // ─── COMBO BLASTERS ───
  {
    id: 'cb-1',
    name: 'Bhattu Pizza Blast',
    category: 'Combo Blasters',
    price: 249,
    image: '/logo.png',
    imageAlt: 'Bhattu Pizza Blast',
    description: 'Chicken Cheese Loaded Pizza + Thums Up / Coke 250ml',
    available: true,
    bestSeller: true,
    badge: '🔥 Combo',
    itemType: 'Combo',
    contains: ['Chicken Cheese Loaded Pizza', 'Thums Up / Coke 250ml'],
  },
  {
    id: 'cb-2',
    name: 'Boby Fried Chicken Combo',
    category: 'Combo Blasters',
    price: 229,
    image: '/logo.png',
    imageAlt: 'Boby Fried Chicken Combo',
    description: 'Fried Wings (4) + French Fries + Thums Up / Coke 250ml',
    available: true,
    bestSeller: true,
    badge: '🔥 Combo',
    itemType: 'Combo',
    contains: ['Fried Wings (4)', 'French Fries', 'Thums Up / Coke 250ml'],
  },
  {
    id: 'cb-3',
    name: 'Mangalm Seenu Party Combo',
    category: 'Combo Blasters',
    price: 399,
    image: '/logo.png',
    imageAlt: 'Mangalm Seenu Party Combo',
    description: 'BBQ Chicken Pizza + Fried Wings (3) + Thums Up / Coke 250ml',
    available: true,
    bestSeller: true,
    badge: '🔥 Party Combo',
    itemType: 'Combo',
    contains: ['BBQ Chicken Pizza', 'Fried Wings (3)', 'Thums Up / Coke 250ml'],
  },
  {
    id: 'cb-4',
    name: 'Bahubali Budget Combo',
    category: 'Combo Blasters',
    price: 249,
    image: '/logo.png',
    imageAlt: 'Bahubali Budget Combo',
    description: 'Chicken Pop Corn + Blue Blast Mocktail',
    available: true,
    bestSeller: false,
    badge: '🔥 Combo',
    itemType: 'Combo',
    contains: ['Chicken Pop Corn', 'Blue Blast Mocktail'],
  },
  {
    id: 'cb-5',
    name: 'Kil Bill Sandwich Combo',
    category: 'Combo Blasters',
    price: 169,
    image: '/logo.png',
    imageAlt: 'Kil Bill Sandwich Combo',
    description: 'Crazy Crunch Chicken Sandwich + Thums Up / Coke 250ml',
    available: true,
    bestSeller: false,
    badge: '🔥 Combo',
    itemType: 'Combo',
    contains: ['Crazy Crunch Chicken Sandwich', 'Thums Up / Coke 250ml'],
  },
  {
    id: 'cb-6',
    name: 'OG Family Snack Box',
    category: 'Combo Blasters',
    price: 399,
    image: '/logo.png',
    imageAlt: 'OG Family Snack Box',
    description: 'Fried Wings (2) + Chicken Pop Corn + French Fries + Thums Up / Coke 250ml',
    available: true,
    bestSeller: true,
    badge: '🔥 Family Box',
    itemType: 'Combo',
    contains: ['Fried Wings (2)', 'Chicken Pop Corn', 'French Fries', 'Thums Up / Coke 250ml'],
  },
  {
    id: 'cb-7',
    name: 'BS Foods Mega Combo',
    category: 'Combo Blasters',
    price: 769,
    image: '/logo.png',
    imageAlt: 'BS Foods Mega Combo',
    description: 'BBQ Chicken Pizza + Fried Wings (4) + Chicken Pop Corn + Thick Shake ×2 + Thums Up / Coke 250ml',
    available: true,
    bestSeller: true,
    badge: '🔥 Mega Combo',
    itemType: 'Combo',
    contains: ['BBQ Chicken Pizza', 'Fried Wings (4)', 'Chicken Pop Corn', 'Thick Shake ×2', 'Thums Up / Coke 250ml'],
  },
];

