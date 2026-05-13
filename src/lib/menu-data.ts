// ============================================
// BS FOODS - Complete Menu Database v3
// Images: local JPGs in /public/menu/ (never break)
// ============================================
import type { MenuItem } from '@/types';

export const DEFAULT_MENU: MenuItem[] = [

  // ─── MOCKTAILS ───
  { id:'moc-1', name:'Model Colony Blue Blast',       category:'Mocktails', price:99,  image:'/menu/mocktails/blue-blast.jpg',        imageAlt:'Blue blast mocktail',    description:'Electric blue citrus cooler',            available:true, bestSeller:true  },
  { id:'moc-2', name:'Recharla Red Wine',             category:'Mocktails', price:99,  image:'/menu/mocktails/red-wine.jpg',           imageAlt:'Red wine mocktail',      description:'Deep ruby red grape & berry mocktail',   available:true, bestSeller:false },
  { id:'moc-3', name:'Seethanagarm Strawberry',       category:'Mocktails', price:99,  image:'/menu/mocktails/strawberry.jpg',         imageAlt:'Strawberry mocktail',    description:'Fresh strawberry crush with mint & soda',available:true, bestSeller:false },
  { id:'moc-4', name:'Vantala Akka Virgin Mojito',    category:'Mocktails', price:99,  image:'/menu/mocktails/virgin-mojito.jpg',      imageAlt:'Virgin mojito',          description:'Classic mint-lime mojito',               available:true, bestSeller:true  },
  { id:'moc-5', name:'Doctor Babu Love Byte',         category:'Mocktails', price:129, image:'/menu/mocktails/love-byte.jpg',          imageAlt:'Love byte mocktail',     description:'Passion fruit & lychee premium blend',   available:true, bestSeller:false },

  // ─── DESSERTS ───
  { id:'des-1', name:'Ice Cream Pani Puri',           category:'Desserts & Ice Cream Scoops', price:69,  image:'/menu/desserts/pani-puri-icecream.jpg', imageAlt:'Ice cream pani puri', description:'Crispy puri with ice cream — unique fusion', available:true, bestSeller:true  },
  { id:'des-2', name:'Vanilla with Nuts Scoop (2)',   category:'Desserts & Ice Cream Scoops', price:89,  image:'/menu/desserts/vanilla-nuts.jpg',       imageAlt:'Vanilla with nuts',   description:'2 scoops creamy vanilla with crunchy nuts',  available:true, bestSeller:false },
  { id:'des-3', name:'Chocolate with Chips (2)',      category:'Desserts & Ice Cream Scoops', price:89,  image:'/menu/desserts/choco-chips.jpg',        imageAlt:'Chocolate with chips',description:'2 scoops rich chocolate with chips',          available:true, bestSeller:false },
  { id:'des-4', name:'Brownie with Vanilla',          category:'Desserts & Ice Cream Scoops', price:99,  image:'/menu/desserts/brownie-vanilla.jpg',    imageAlt:'Brownie with vanilla',description:'Warm fudge brownie with vanilla scoop',       available:true, bestSeller:true  },
  { id:'des-5', name:'Hot Sizzling Brownie',          category:'Desserts & Ice Cream Scoops', price:129, image:'/menu/desserts/sizzling-brownie.jpg',   imageAlt:'Hot sizzling brownie',description:'Sizzling brownie with ice cream & chocolate', available:true, bestSeller:true  },

  // ─── CHAI & JUICE ───
  { id:'cha-1', name:'Chai With Samosa',              category:'Chai & Juice', price:25, image:'/menu/chai/chai-samosa.jpg',   imageAlt:'Chai with samosa',   description:'Hot masala chai with crispy samosa', available:true, bestSeller:true  },
  { id:'cha-2', name:'Coffee with Samosa',            category:'Chai & Juice', price:30, image:'/menu/chai/coffee-samosa.jpg', imageAlt:'Coffee with samosa', description:'Hot coffee with crunchy samosa',     available:true, bestSeller:false },
  { id:'cha-3', name:'Banana Juice',                  category:'Chai & Juice', price:60, image:'/menu/chai/banana-juice.jpg',  imageAlt:'Banana juice',       description:'Thick fresh-blended banana shake',   available:true, bestSeller:false },
  { id:'cha-4', name:'Sapota Juice',                  category:'Chai & Juice', price:60, image:'/menu/chai/sapota.jpg',        imageAlt:'Sapota chikoo juice',description:'Smooth and sweet chikoo juice',      available:true, bestSeller:false },
  { id:'cha-5', name:'Watermelon Juice',              category:'Chai & Juice', price:60, image:'/menu/chai/watermelon.jpg',    imageAlt:'Watermelon juice',   description:'Chilled fresh watermelon juice',     available:true, bestSeller:false },

  // ─── PIZZA ───
  { id:'piz-1', name:'Chintalapudi Chicken Pizza',    category:'Pizza', price:199, image:'/menu/pizza/chicken-pizza.jpg', imageAlt:'Chicken pizza',       description:'Spicy chicken loaded pizza with cheese',  available:true, bestSeller:true  },
  { id:'piz-2', name:'Venkatapuram Veg Pizza',        category:'Pizza', price:179, image:'/menu/pizza/veg-pizza.jpg',    imageAlt:'Veg pizza',           description:'Fresh veggie loaded pizza',               available:true, bestSeller:false },
  { id:'piz-3', name:'Pothunuru Panner Pizza',        category:'Pizza', price:189, image:'/menu/pizza/paneer-pizza.jpg', imageAlt:'Paneer pizza',        description:'Spicy paneer tikka on crispy base',       available:true, bestSeller:true  },
  { id:'piz-4', name:'Kanthampalem Corn Onion Pizza', category:'Pizza', price:189, image:'/menu/pizza/corn-onion.jpg',   imageAlt:'Corn onion pizza',    description:'Sweet corn & caramelised onion pizza',    available:true, bestSeller:false },
  { id:'piz-5', name:'Crazy Corn Chicken Pizza',      category:'Pizza', price:229, image:'/menu/pizza/corn-chicken.jpg', imageAlt:'Corn chicken pizza',  description:'Loaded corn & juicy chicken pizza',        available:true, bestSeller:true  },

  // ─── SANDWICH & WRAPS ───
  { id:'san-1', name:'Chintampalli Cheese Loaded',          category:'Sandwich & Wraps', price:79,  image:'/menu/sandwich/cheese-loaded.jpg',    imageAlt:'Cheese sandwich',        description:'Double cheese grilled sandwich',        available:true, bestSeller:false },
  { id:'san-2', name:'Venkatadrigudem Veg Sandwich',         category:'Sandwich & Wraps', price:89,  image:'/menu/sandwich/veg-sandwich.jpg',     imageAlt:'Veg sandwich',           description:'Grilled veggie sandwich with herbs',    available:true, bestSeller:false },
  { id:'san-3', name:'Pragadavaram Panner Sandwich',         category:'Sandwich & Wraps', price:89,  image:'/menu/sandwich/paneer-sandwich.jpg',  imageAlt:'Paneer sandwich',        description:'Paneer with spicy chutney in toast',   available:true, bestSeller:false },
  { id:'san-4', name:'Erraguntapalli Egg Scrambled',         category:'Sandwich & Wraps', price:99,  image:'/menu/sandwich/egg-scramble.jpg',     imageAlt:'Egg scrambled sandwich', description:'Fluffy scrambled egg sandwich',         available:true, bestSeller:false },
  { id:'san-5', name:'Chinnampeta Chicken Sandwich',         category:'Sandwich & Wraps', price:99,  image:'/menu/sandwich/chicken-sandwich.jpg', imageAlt:'Chicken sandwich',       description:'Juicy grilled chicken sandwich',        available:true, bestSeller:true  },
  { id:'san-6', name:'Crazy Crunch Chicken Sandwich',        category:'Sandwich & Wraps', price:149, image:'/menu/sandwich/crunch-chicken.jpg',   imageAlt:'Crunchy chicken sandwich',description:'Crispy fried chicken with slaw',        available:true, bestSeller:true  },
  { id:'wr-1',  name:'Velamapeta Veg Wrap',                  category:'Sandwich & Wraps', price:99,  image:'/menu/sandwich/veg-wrap.jpg',         imageAlt:'Veg wrap',               description:'Fresh veggies in soft tortilla',        available:true, bestSeller:false },
  { id:'wr-2',  name:'Muslim Street Magic Chicken Wrap',      category:'Sandwich & Wraps', price:119, image:'/menu/sandwich/chicken-wrap.jpg',     imageAlt:'Chicken wrap',           description:'Spicy chicken shawarma-style wrap',     available:true, bestSeller:true  },

  // ─── SNACKS & BURGERS ───
  { id:'snk-1', name:'Lingapalem Lollipops (4)',        category:'Snacks & Burgers', price:149, image:'/menu/snacks/lollipops.jpg',      imageAlt:'Chicken lollipops',    description:'4 pcs crispy chicken lollipops',   available:true, bestSeller:true  },
  { id:'snk-2', name:'Dharmajigudem Fried Wings (4)',   category:'Snacks & Burgers', price:139, image:'/menu/snacks/fried-wings.jpg',    imageAlt:'Fried wings',          description:'4 pcs golden fried chicken wings', available:true, bestSeller:false },
  { id:'snk-3', name:'Merakaveedhi Mad Strips (5)',     category:'Snacks & Burgers', price:149, image:'/menu/snacks/mad-strips.jpg',     imageAlt:'Chicken strips',       description:'5 pcs crispy chicken strips',       available:true, bestSeller:false },
  { id:'snk-4', name:'Fathimapuram French Fries',       category:'Snacks & Burgers', price:89,  image:'/menu/snacks/french-fries.jpg',   imageAlt:'French fries',         description:'Golden crispy salted fries',        available:true, bestSeller:true  },
  { id:'snk-5', name:'Chipurugudem Cheese Fries',       category:'Snacks & Burgers', price:99,  image:'/menu/snacks/cheese-fries.jpg',   imageAlt:'Cheese fries',         description:'Fries with melted cheese sauce',    available:true, bestSeller:true  },
  { id:'snk-6', name:'PCTP Cheese Corn Samosa (5)',     category:'Snacks & Burgers', price:79,  image:'/menu/snacks/corn-samosa.jpg',    imageAlt:'Cheese corn samosa',   description:'5 pcs crispy cheese corn samosa',   available:true, bestSeller:false },
  { id:'bur-1', name:'Boyagudem Burger Veg',            category:'Snacks & Burgers', price:99,  image:'/menu/snacks/veg-burger.jpg',     imageAlt:'Veg burger',           description:'Crispy veg patty burger',           available:true, bestSeller:false },
  { id:'bur-2', name:'RK Nagar Royal Chicken Burger',   category:'Snacks & Burgers', price:129, image:'/menu/snacks/chicken-burger.jpg', imageAlt:'Chicken burger',       description:'Juicy chicken with royal sauce',    available:true, bestSeller:true  },
  { id:'snk-7', name:'Kovvurugudem Crunchy Chicken',    category:'Snacks & Burgers', price:149, image:'/menu/snacks/crunchy-chicken.jpg',imageAlt:'Crunchy chicken',      description:'Extra crunchy fried chicken',       available:true, bestSeller:false },

  // ─── THICK SHAKES & MILK SHAKES ───
  { id:'shk-1n', name:'Gantavari Vidhi Jelly Vanilla',          category:'Thick Shakes & Milk Shakes', price:89,  image:'/menu/shakes/jelly-vanilla.jpg', imageAlt:'Jelly vanilla shake',   description:'Vanilla shake with jelly — Normal',     available:true, bestSeller:false, badge:'Normal ₹89 / Thick ₹149' },
  { id:'shk-1t', name:'Gantavari Vidhi Jelly Vanilla (Thick)',  category:'Thick Shakes & Milk Shakes', price:149, image:'/menu/shakes/jelly-vanilla.jpg', imageAlt:'Jelly vanilla thick',   description:'Vanilla shake with jelly — Thick',      available:true, bestSeller:false, badge:'Thick Shake' },
  { id:'shk-2n', name:'Balavarigudem Belgium Choco',             category:'Thick Shakes & Milk Shakes', price:99,  image:'/menu/shakes/belgium-choco.jpg', imageAlt:'Belgium choco shake',   description:'Rich Belgian chocolate — Normal',        available:true, bestSeller:true,  badge:'Normal ₹99 / Thick ₹149' },
  { id:'shk-2t', name:'Balavarigudem Belgium Choco (Thick)',     category:'Thick Shakes & Milk Shakes', price:149, image:'/menu/shakes/belgium-choco.jpg', imageAlt:'Belgium choco thick',   description:'Rich Belgian chocolate — Thick',         available:true, bestSeller:false, badge:'Thick Shake' },
  { id:'shk-3n', name:'Battuvarigudem Black Currant',            category:'Thick Shakes & Milk Shakes', price:99,  image:'/menu/shakes/black-currant.jpg', imageAlt:'Black currant shake',   description:'Black currant shake — Normal',           available:true, bestSeller:false, badge:'Normal ₹99 / Thick ₹149' },
  { id:'shk-3t', name:'Battuvarigudem Black Currant (Thick)',    category:'Thick Shakes & Milk Shakes', price:149, image:'/menu/shakes/black-currant.jpg', imageAlt:'Black currant thick',   description:'Black currant shake — Thick',            available:true, bestSeller:false, badge:'Thick Shake' },
  { id:'shk-4n', name:'Suprian Strawberry',                      category:'Thick Shakes & Milk Shakes', price:99,  image:'/menu/shakes/strawberry.jpg',    imageAlt:'Strawberry shake',      description:'Fresh strawberry shake — Normal',        available:true, bestSeller:false, badge:'Normal ₹99 / Thick ₹149' },
  { id:'shk-4t', name:'Suprian Strawberry (Thick)',              category:'Thick Shakes & Milk Shakes', price:149, image:'/menu/shakes/strawberry.jpg',    imageAlt:'Strawberry thick',      description:'Fresh strawberry shake — Thick',         available:true, bestSeller:false, badge:'Thick Shake' },
  { id:'shk-5n', name:'Uatasamudram Oreo',                       category:'Thick Shakes & Milk Shakes', price:89,  image:'/menu/shakes/oreo.jpg',          imageAlt:'Oreo shake',            description:'Creamy Oreo milkshake — Normal',         available:true, bestSeller:true,  badge:'Normal ₹89 / Thick ₹139' },
  { id:'shk-5t', name:'Uatasamudram Oreo (Thick)',               category:'Thick Shakes & Milk Shakes', price:139, image:'/menu/shakes/oreo.jpg',          imageAlt:'Oreo thick shake',      description:'Creamy Oreo milkshake — Thick',          available:true, bestSeller:false, badge:'Thick Shake' },
  { id:'shk-6n', name:'Kotapadu Kit Kat',                        category:'Thick Shakes & Milk Shakes', price:89,  image:'/menu/shakes/kitkat.jpg',        imageAlt:'Kit Kat shake',         description:'Kit Kat blended shake — Normal',         available:true, bestSeller:false, badge:'Normal ₹89 / Thick ₹139' },
  { id:'shk-6t', name:'Kotapadu Kit Kat (Thick)',                category:'Thick Shakes & Milk Shakes', price:139, image:'/menu/shakes/kitkat.jpg',        imageAlt:'Kit Kat thick shake',   description:'Kit Kat blended shake — Thick',          available:true, bestSeller:false, badge:'Thick Shake' },
  { id:'shk-7n', name:'Nagireddygudem Wine Wonder',              category:'Thick Shakes & Milk Shakes', price:99,  image:'/menu/shakes/wine-wonder.jpg',   imageAlt:'Wine wonder shake',     description:'Wine flavoured shake — Normal',          available:true, bestSeller:false, badge:'Normal ₹99 / Thick ₹149' },
  { id:'shk-7t', name:'Nagireddygudem Wine Wonder (Thick)',      category:'Thick Shakes & Milk Shakes', price:149, image:'/menu/shakes/wine-wonder.jpg',   imageAlt:'Wine wonder thick',     description:'Wine flavoured shake — Thick',           available:true, bestSeller:false, badge:'Thick Shake' },
  { id:'shk-8',  name:'Mango Mastani (Real Fruit)',              category:'Thick Shakes & Milk Shakes', price:149, image:'/menu/shakes/mango-mastani.jpg', imageAlt:'Mango mastani',         description:'Premium mango mastani with real fruit',  available:true, bestSeller:true,  badge:'🥭 Real Fruit' },
];
