// ============================================
// BS FOODS - Complete Menu Database v6
// Authoritative Source: BS Foods Menu Poster
// ============================================
import type { MenuItem } from '@/types';

export const DEFAULT_MENU: MenuItem[] = [

  // ─── A. POP-UP SNACKS ───
  { id:'pop-tangy-nachos',   name:'Tangy Nachos',       category:'Pop-up Snacks', price:79,  image:'/menu/snacks/tangy-nachos.jpg',   imageAlt:'Tangy Nachos',     description:'Crispy nachos seasoned with tangy spices', available:true, bestSeller:false },
  { id:'snk-5',              name:'Salted Fries',       category:'Pop-up Snacks', price:79,  image:'/menu/snacks/french-fries.jpg',   imageAlt:'Salted Fries',     description:'Golden crispy salted fries',              available:true, bestSeller:true  },
  { id:'snk-7',              name:'Corn Samosa',        category:'Pop-up Snacks', price:80,  image:'/menu/snacks/corn-samosa.jpg',    imageAlt:'Corn Samosa',      description:'5 pcs crispy pastry filled with corn masala', available:true, bestSeller:false },
  { id:'pop-peri-peri-fries',name:'Peri Peri Fries',    category:'Pop-up Snacks', price:89,  image:'/menu/snacks/peri-peri-fries.jpg',imageAlt:'Peri Peri Fries',  description:'Crispy fries tossed in zesty peri-peri',  available:true, bestSeller:false },
  { id:'snk-6',              name:'Cheese Fries',       category:'Pop-up Snacks', price:99,  image:'/menu/snacks/cheese-fries.jpg',   imageAlt:'Cheese Fries',     description:'Golden fries with melted warm cheese',     available:true, bestSeller:true  },
  { id:'pop-onion-rings',    name:'Onion Rings',        category:'Pop-up Snacks', price:99,  image:'/menu/snacks/onion-rings.jpg',    imageAlt:'Onion Rings',      description:'Crispy golden batter-fried onion rings',  available:true, bestSeller:false },
  { id:'pop-spice-fries',    name:'Spice Fries',        category:'Pop-up Snacks', price:129, image:'/menu/snacks/spice-fries.jpg',    imageAlt:'Spice Fries',      description:'Hot and spicy masala seasoned fries',     available:true, bestSeller:false },

  // ─── B. HOUSIE CHEESY SNACKS ───
  { id:'hcs-cheesy-nachos',        name:'Cheesy Nachos',        category:'Housie Cheesy Snacks', price:99,  image:'/menu/snacks/cheesy-nachos.jpg',        imageAlt:'Cheesy Nachos',        description:'Crunchy tortilla chips loaded with cheese sauce', available:true, bestSeller:false },
  { id:'hcs-paneer-loaded-fries',  name:'Paneer Loaded Fries',  category:'Housie Cheesy Snacks', price:139, image:'/menu/snacks/paneer-loaded-fries.jpg',  imageAlt:'Paneer Loaded Fries',  description:'Crispy fries topped with marinated paneer & cheese', available:true, bestSeller:false },
  { id:'hcs-chicken-loaded-fries', name:'Chicken Loaded Fries', category:'Housie Cheesy Snacks', price:149, image:'/menu/snacks/chicken-loaded-fries.jpg', imageAlt:'Chicken Loaded Fries', description:'Golden fries loaded with crispy chicken & sauce', available:true, bestSeller:false },
  { id:'hcs-bbq-wings',            name:'BBQ Wings (5p)',       category:'Housie Cheesy Snacks', price:199, image:'/menu/snacks/bbq-wings.jpg',            imageAlt:'BBQ Wings',            description:'5 pcs tender chicken wings glazed in BBQ sauce', available:true, bestSeller:true  },

  // ─── C. HOT & CRISPY ───
  { id:'snk-2', name:'Wings (4p)',    category:'Hot & Crispy', price:149, image:'/menu/snacks/fried-wings.jpg', imageAlt:'Wings (4p)',    description:'4 pcs crispy golden fried chicken wings', available:true, bestSeller:false },
  { id:'snk-1', name:'Lollipop (4p)', category:'Hot & Crispy', price:149, image:'/menu/snacks/lollipops.jpg',   imageAlt:'Lollipop (4p)', description:'4 pcs classic crispy chicken lollipops', available:true, bestSeller:true  },

  // ─── D. BANQUET BURGERS ───
  { id:'bur-1',          name:'Mexican Veg Burger',    category:'Banquet Burgers', price:129, image:'/menu/snacks/veg-burger.jpg',         imageAlt:'Mexican Veg Burger',    description:'Zesty spiced vegetable patty burger', available:true, bestSeller:false },
  { id:'bur-3',          name:'Paneer Burger',         category:'Banquet Burgers', price:139, image:'/menu/snacks/paneer-burger.jpg',      imageAlt:'Paneer Burger',         description:'Crispy golden paneer patty burger',   available:true, bestSeller:false },
  { id:'bur-2',          name:'Crispy Chicken Burger', category:'Banquet Burgers', price:149, image:'/menu/snacks/chicken-burger.jpg',     imageAlt:'Crispy Chicken Burger', description:'Crispy fried chicken breast burger',  available:true, bestSeller:true  },
  { id:'bb-double-down', name:'Double Down Burger',    category:'Banquet Burgers', price:189, image:'/menu/snacks/double-down-burger.jpg', imageAlt:'Double Down Burger',    description:'Double chicken patty stacked burger', available:true, bestSeller:true  },

  // ─── E. PASTA PUNCH (MACARONI) ───
  {
    id: 'pas-creamy-white',
    name: 'White & Creamy Pasta',
    category: 'Pasta Punch (Macaroni)',
    price: 149,
    image: '/menu/pasta/creamy-white-pasta.jpg',
    imageAlt: 'White & Creamy Pasta',
    description: 'Rich & creamy Alfredo macaroni pasta with herbs',
    badge: 'Veg ₹149 / Non-Veg ₹189',
    available: true,
    bestSeller: true,
    variants: [
      { name: 'Veg', price: 149 },
      { name: 'Non-Veg', price: 189 },
    ],
  },
  {
    id: 'pas-red-sauce',
    name: 'Red Sauce Pasta',
    category: 'Pasta Punch (Macaroni)',
    price: 149,
    image: '/menu/pasta/red-sauce-pasta.jpg',
    imageAlt: 'Red Sauce Pasta',
    description: 'Spicy & tangy Italian arrabbiata macaroni pasta',
    badge: 'Veg ₹149 / Non-Veg ₹189',
    available: true,
    bestSeller: false,
    variants: [
      { name: 'Veg', price: 149 },
      { name: 'Non-Veg', price: 189 },
    ],
  },

  // ─── F. MAGIC MASALA MUNCH ───
  { id:'mmm-veg-maggie',    name:'Veg Maggie',     category:'Magic Masala Munch', price:59, image:'/menu/maggie/veg-maggie.jpg',    imageAlt:'Veg Maggie',     description:'Classic comfort Maggi with fresh vegetables', available:true, bestSeller:false },
  { id:'mmm-tomato-maggie', name:'Tomato Maggie',  category:'Magic Masala Munch', price:69, image:'/menu/maggie/tomato-maggie.jpg', imageAlt:'Tomato Maggie',  description:'Tangy tomato enriched spicy masala Maggi',     available:true, bestSeller:false },
  { id:'mmm-cheese-maggie', name:'Cheese Maggie',  category:'Magic Masala Munch', price:79, image:'/menu/maggie/cheese-maggie.jpg', imageAlt:'Cheese Maggie',  description:'Hot masala Maggi topped with melted cheese',   available:true, bestSeller:true  },
  { id:'mmm-paneer-maggie', name:'Paneer Maggie',  category:'Magic Masala Munch', price:89, image:'/menu/maggie/paneer-maggie.jpg', imageAlt:'Paneer Maggie',  description:'Soft paneer cubes cooked in Maggi noodles',    available:true, bestSeller:false },
  { id:'mmm-chicken-maggie',name:'Chicken Maggie', category:'Magic Masala Munch', price:99, image:'/menu/maggie/chicken-maggie.jpg',imageAlt:'Chicken Maggie', description:'Juicy chicken chunks tossed in spicy Maggi',  available:true, bestSeller:true  },

  // ─── G. STEAM & CREAMY (MOMOS) ───
  {
    id: 'sc-veg-momos',
    name: 'Veg Momos (5 pc)',
    category: 'Steam & Creamy',
    price: 79,
    image: '/menu/momos/veg-momos.jpg',
    imageAlt: 'Veg Momos',
    description: '5 pcs delicate momos with vegetable filling',
    badge: 'Steamed / Fried',
    available: true,
    bestSeller: false,
    variants: [
      { name: 'Steamed', price: 79 },
      { name: 'Fried', price: 79 },
    ],
  },
  {
    id: 'sc-chicken-momos',
    name: 'Chicken Momos (5 pc)',
    category: 'Steam & Creamy',
    price: 100,
    image: '/menu/momos/chicken-momos.jpg',
    imageAlt: 'Chicken Momos',
    description: '5 pcs succulent chicken dumplings with spicy red chutney',
    badge: 'Steamed / Fried',
    available: true,
    bestSeller: true,
    variants: [
      { name: 'Steamed', price: 100 },
      { name: 'Fried', price: 100 },
    ],
  },

  // ─── H. WRAP & GRAB ───
  { id:'wg-veg-wrap',           name:'Veg Wrap',            category:'Wrap & Grab', price:89,  image:'/menu/sandwich/veg-wrap.jpg',    imageAlt:'Veg Wrap',            description:'Fresh vegetables rolled in toasted flatbread',      available:true, bestSeller:false },
  { id:'wg-egg-wrap',           name:'Egg Wrap',            category:'Wrap & Grab', price:99,  image:'/menu/sandwich/egg-scramble.jpg',imageAlt:'Egg Wrap',            description:'Spiced scrambled egg roll with mint sauce',          available:true, bestSeller:false },
  { id:'wg-crispy-chicken-wrap',name:'Crispy Chicken Wrap', category:'Wrap & Grab', price:149, image:'/menu/sandwich/chicken-wrap.jpg', imageAlt:'Crispy Chicken Wrap', description:'Crispy fried chicken strips wrapped with ranch',    available:true, bestSeller:true  },
  { id:'wg-paneer-toast-wrap',  name:'Paneer Toast Wrap',   category:'Wrap & Grab', price:139, image:'/menu/sandwich/paneer-wrap.jpg',  imageAlt:'Paneer Toast Wrap',   description:'Toasted tortilla wrap packed with spiced paneer',    available:true, bestSeller:false },

  // ─── I. MADLY MATCH SANDWICH ───
  { id:'san-2',                 name:'Veg Sandwich',            category:'Madly Match Sandwich', price:89,  image:'/menu/sandwich/veg-sandwich.jpg',       imageAlt:'Veg Sandwich',            description:'Grilled veggie sandwich with herbs & butter', available:true, bestSeller:false },
  { id:'san-1',                 name:'Cheese Loaded Sandwich',  category:'Madly Match Sandwich', price:79,  image:'/menu/sandwich/cheese-loaded.jpg',      imageAlt:'Cheese Loaded Sandwich',  description:'Double cheese loaded grilled toast',          available:true, bestSeller:true  },
  { id:'mms-corn-mayo',         name:'Corn & Mayo Sandwich',    category:'Madly Match Sandwich', price:89,  image:'/menu/sandwich/corn-mayo-sandwich.jpg', imageAlt:'Corn & Mayo Sandwich',    description:'Sweet golden corn with creamy mayonnaise',    available:true, bestSeller:false },
  { id:'san-3',                 name:'Paneer Mayo Sandwich',    category:'Madly Match Sandwich', price:99,  image:'/menu/sandwich/paneer-sandwich.jpg',    imageAlt:'Paneer Mayo Sandwich',    description:'Tender paneer cubes in spicy mayo spread',    available:true, bestSeller:false },
  { id:'san-5',                 name:'Chicken Mayo Sandwich',   category:'Madly Match Sandwich', price:109, image:'/menu/sandwich/chicken-sandwich.jpg',   imageAlt:'Chicken Mayo Sandwich',   description:'Juicy grilled chicken with seasoned mayo',    available:true, bestSeller:false },
  { id:'mms-mexican-sandwich',  name:'Mexican Sandwich',        category:'Madly Match Sandwich', price:109, image:'/menu/sandwich/mexican-sandwich.jpg',   imageAlt:'Mexican Sandwich',        description:'Spiced salsa, beans, veggies and cheese toast',available:true, bestSeller:false },
  { id:'mms-club-chicken',      name:'Club Chicken Sandwich',   category:'Madly Match Sandwich', price:119, image:'/menu/sandwich/crunch-chicken.jpg',    imageAlt:'Club Chicken Sandwich',   description:'Triple-decker club sandwich with chicken',    available:true, bestSeller:true  },

  // ─── J. MILK SHAKES & THICK SHAKES (Regular ₹99 / Thick ₹149) ───
  {
    id: 'shk-2',
    name: 'Belgium Chocolate',
    category: 'Milk Shakes & Thick Shakes',
    price: 99,
    image: '/menu/shakes/belgium-choco.jpg',
    imageAlt: 'Belgium Chocolate',
    description: 'Rich and decadent Belgian chocolate shake',
    badge: 'Regular ₹99 / Thick ₹149',
    available: true,
    bestSeller: true,
    variants: [
      { name: 'Regular', price: 99 },
      { name: 'Thick', price: 149 },
    ],
  },
  {
    id: 'shk-1',
    name: 'Jelly Vanilla',
    category: 'Milk Shakes & Thick Shakes',
    price: 99,
    image: '/menu/shakes/jelly-vanilla.jpg',
    imageAlt: 'Jelly Vanilla',
    description: 'Vanilla cream shake with chewable jelly bites',
    badge: 'Regular ₹99 / Thick ₹149',
    available: true,
    bestSeller: false,
    variants: [
      { name: 'Regular', price: 99 },
      { name: 'Thick', price: 149 },
    ],
  },
  {
    id: 'shk-3',
    name: 'Black Current',
    category: 'Milk Shakes & Thick Shakes',
    price: 99,
    image: '/menu/shakes/black-currant.jpg',
    imageAlt: 'Black Current',
    description: 'Zesty purple berry black currant milkshake',
    badge: 'Regular ₹99 / Thick ₹149',
    available: true,
    bestSeller: false,
    variants: [
      { name: 'Regular', price: 99 },
      { name: 'Thick', price: 149 },
    ],
  },
  {
    id: 'shk-mango-maaza',
    name: 'Mango Maaza',
    category: 'Milk Shakes & Thick Shakes',
    price: 99,
    image: '/menu/shakes/mango-mastani.jpg',
    imageAlt: 'Mango Maaza',
    description: 'Tropical sweet mango blended creamy shake',
    badge: 'Regular ₹99 / Thick ₹149',
    available: true,
    bestSeller: false,
    variants: [
      { name: 'Regular', price: 99 },
      { name: 'Thick', price: 149 },
    ],
  },
  {
    id: 'shk-6',
    name: 'Kit Kat',
    category: 'Milk Shakes & Thick Shakes',
    price: 99,
    image: '/menu/shakes/kitkat.jpg',
    imageAlt: 'Kit Kat',
    description: 'Crispy wafer chocolate Kit Kat blended shake',
    badge: 'Regular ₹99 / Thick ₹149',
    available: true,
    bestSeller: false,
    variants: [
      { name: 'Regular', price: 99 },
      { name: 'Thick', price: 149 },
    ],
  },
  {
    id: 'shk-5',
    name: 'Oreo',
    category: 'Milk Shakes & Thick Shakes',
    price: 99,
    image: '/menu/shakes/oreo.jpg',
    imageAlt: 'Oreo',
    description: 'Classic cookies and cream Oreo crushed shake',
    badge: 'Regular ₹99 / Thick ₹149',
    available: true,
    bestSeller: true,
    variants: [
      { name: 'Regular', price: 99 },
      { name: 'Thick', price: 149 },
    ],
  },
  {
    id: 'shk-lotte-choco',
    name: 'Lotte Choco Pie',
    category: 'Milk Shakes & Thick Shakes',
    price: 99,
    image: '/menu/shakes/lotte-choco-pie.jpg',
    imageAlt: 'Lotte Choco Pie',
    description: 'Marshmallow chocolate pie blended specialty shake',
    badge: 'Regular ₹99 / Thick ₹149',
    available: true,
    bestSeller: false,
    variants: [
      { name: 'Regular', price: 99 },
      { name: 'Thick', price: 149 },
    ],
  },

  // ─── K. SIP & REFRESH ───
  { id:'moc-1',               name:'Blue Blast',         category:'Sip & Refresh', price:99, image:'/menu/mocktails/blue-blast.jpg',        imageAlt:'Blue Blast',        description:'Electric blue citrus cooler with lime & soda', available:true, bestSeller:true  },
  { id:'moc-4',               name:'Virgin Mojito',      category:'Sip & Refresh', price:99, image:'/menu/mocktails/virgin-mojito.jpg',     imageAlt:'Virgin Mojito',     description:'Classic refreshing mint-lime fizzy mojito',     available:true, bestSeller:true  },
  { id:'moc-3',               name:'Strawberry Mojito',  category:'Sip & Refresh', price:99, image:'/menu/mocktails/strawberry.jpg',        imageAlt:'Strawberry Mojito', description:'Sweet strawberry crush with mint and soda',     available:true, bestSeller:false },
  { id:'sr-mint-maaza-mojito',name:'Mint Maaza Mojito',  category:'Sip & Refresh', price:99, image:'/menu/mocktails/mint-maaza-mojito.jpg', imageAlt:'Mint Maaza Mojito', description:'Luscious mango cooler infused with fresh mint',   available:true, bestSeller:false },

  // ─── L. DAZZLING DESSERTS ───
  { id:'des-1',                  name:'Choco Lava Cake',          category:'Dazzling Desserts', price:99,  image:'/menu/desserts/choco-lava-cake.jpg',     imageAlt:'Choco Lava Cake',          description:'Warm chocolate cake with molten chocolate center', available:true, bestSeller:true  },
  { id:'dd-brownie',             name:'Brownie',                  category:'Dazzling Desserts', price:99,  image:'/menu/desserts/brownie-vanilla.jpg',     imageAlt:'Brownie',                  description:'Rich, dense fudgy chocolate brownie square',       available:true, bestSeller:false },
  { id:'des-2',                  name:'Vanilla Scoop',            category:'Dazzling Desserts', price:99,  image:'/menu/desserts/vanilla-nuts.jpg',        imageAlt:'Vanilla Scoop',            description:'Smooth premium vanilla ice cream scoop',           available:true, bestSeller:false },
  { id:'des-3',                  name:'Chocolate Scoop',          category:'Dazzling Desserts', price:99,  image:'/menu/desserts/choco-chips.jpg',         imageAlt:'Chocolate Scoop',          description:'Indulgent dark chocolate ice cream scoop',         available:true, bestSeller:false },
  { id:'des-4',                  name:'Brownie with Vanilla',      category:'Dazzling Desserts', price:129, image:'/menu/desserts/brownie-vanilla.jpg',     imageAlt:'Brownie with Vanilla',      description:'Warm fudge brownie topped with vanilla ice cream', available:true, bestSeller:true  },
  { id:'dd-gulab-jamun-vanilla', name:'Gulab Jamun with Vanilla', category:'Dazzling Desserts', price:139, image:'/menu/desserts/gulab-jamun-vanilla.jpg',imageAlt:'Gulab Jamun with Vanilla',description:'Warm syrupy gulab jamun with cold vanilla scoop',  available:true, bestSeller:false },
  { id:'des-5',                  name:'Hot Sizzling',             category:'Dazzling Desserts', price:169, image:'/menu/desserts/sizzling-brownie.jpg',    imageAlt:'Hot Sizzling',             description:'Sizzling platter brownie with ice cream & sauce',   available:true, bestSeller:true  },

  // ─── M. HOT SOUP'S ───
  { id:'soup-tomato',       name:'Tomato Soup',        category:"Hot Soup's", price:49, image:'/menu/soups/tomato-soup.jpg',      imageAlt:'Tomato Soup',        description:'Velvety roasted ripe tomato soup with herbs',   available:true, bestSeller:false },
  { id:'soup-hot-and-knour',name:'Hot and knour',      category:"Hot Soup's", price:59, image:'/menu/soups/hot-and-sour-soup.jpg',imageAlt:'Hot and knour',      description:'Spicy & tangy Chinese style hot & sour soup',   available:true, bestSeller:false, badge:'Specialty Soup' },
  { id:'soup-manchow',      name:'Manchow Soup',       category:"Hot Soup's", price:59, image:'/menu/soups/manchow-soup.jpg',     imageAlt:'Manchow Soup',       description:'Indo-Chinese soup with crispy fried noodles',   available:true, bestSeller:true  },
  { id:'soup-corn',         name:'Corn Soup',          category:"Hot Soup's", price:49, image:'/menu/soups/corn-soup.jpg',        imageAlt:'Corn Soup',          description:'Creamy sweet corn soup with delicate veggies',   available:true, bestSeller:false },
  { id:'soup-chicken',      name:'Chicken Soup',       category:"Hot Soup's", price:99, image:'/menu/soups/chicken-soup.jpg',     imageAlt:'Chicken Soup',       description:'Soothing chicken broth with tender chicken',    available:true, bestSeller:true  },
  { id:'soup-mix-veg',      name:'Mix Vegetable Soup', category:"Hot Soup's", price:99, image:'/menu/soups/mix-veg-soup.jpg',     imageAlt:'Mix Vegetable Soup', description:'Wholesome clear soup packed with vegetables',    available:true, bestSeller:false },

  // ─── PRESERVED: PIZZA ───
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

  // ─── PRESERVED: COMBO BLASTERS ───
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

  // ─── PRESERVED: BEVERAGES ───
  { id:'bev-1', name:'Thumbs Up 300ml', category:'Beverages', price:30, image:'/fallback-food.jpg', imageAlt:'Thumbs Up 300ml', description:'Thumbs Up 300ml chilled', available:true, bestSeller:false },
  { id:'bev-2', name:'Thumbs Up 1L',     category:'Beverages', price:50, image:'/fallback-food.jpg', imageAlt:'Thumbs Up 1L',     description:'Thumbs Up 1L bottle',      available:true, bestSeller:false },
  { id:'bev-3', name:'Thums Up 250ml',   category:'Beverages', price:20, image:'/fallback-food.jpg', imageAlt:'Thums Up 250ml',   description:'Thums Up 250ml can',       available:true, bestSeller:true  },
  { id:'bev-4', name:'Coke 250ml',       category:'Beverages', price:20, image:'/fallback-food.jpg', imageAlt:'Coke 250ml',       description:'Coke 250ml can',           available:true, bestSeller:true  },

  // ─── PRESERVED: OFFERS ───
  { id:'off-99',  name:'Offer Price - ₹99',  category:'Offers', price:99,  image:'/menu/offers/offer-99.webp',  imageAlt:'Offer Price 99',  description:'Quick-add promotional combo offer', available:true, bestSeller:false, badge:'🎁 Special Offer' },
  { id:'off-150', name:'Offer Price - ₹150', category:'Offers', price:150, image:'/menu/offers/offer-150.webp', imageAlt:'Offer Price 150', description:'Quick-add premium combo offer',     available:true, bestSeller:false, badge:'🎁 Promo Deal' },

  // ─── PRESERVED: EXTRAS ───
  { id:'ext-10',  name:'Extra Charge - ₹10', category:'Extras', price:10,  image:'/menu/utilities/water-bottle.webp', imageAlt:'Extra 10', description:'Additional custom charge of ₹10',  available:true, bestSeller:false, badge:'➕ Extra' },
  { id:'ext-20',  name:'Extra Charge - ₹20', category:'Extras', price:20,  image:'/menu/utilities/water-bottle.webp', imageAlt:'Extra 20', description:'Additional custom charge of ₹20',  available:true, bestSeller:false, badge:'➕ Extra' },
  { id:'ext-30',  name:'Extra Charge - ₹30', category:'Extras', price:30,  image:'/menu/utilities/water-bottle.webp', imageAlt:'Extra 30', description:'Additional custom charge of ₹30',  available:true, bestSeller:false, badge:'➕ Extra' },

  // ─── PRESERVED: UTILITY ───
  { id:'ut-rk500', name:'Royal Kissan 500ml', category:'Utility', price:10, image:'/menu/utilities/water-bottle.webp', imageAlt:'Royal Kissan 500ml', description:'Royal Kissan 500ml Water', available:true, bestSeller:false, badge:'💧 Utility' },
  { id:'ut-rk1l',  name:'Royal Kissan 1L',     category:'Utility', price:20, image:'/menu/utilities/water-bottle.webp', imageAlt:'Royal Kissan 1L',     description:'Royal Kissan 1L Water',     available:true, bestSeller:false, badge:'💧 Utility' },

  // ─── PRESERVED: UNRELATED REGIONAL ITEMS ───
  { id:'snk-3', name:'Merakaveedhi Mad Strips (5)',     category:'Snacks',   price:149, image:'/menu/snacks/mad-strips.jpg',      imageAlt:'Chicken strips',    description:'5 pcs crispy chicken strips',        available:true, bestSeller:false },
  { id:'snk-4', name:'Asramam Veedhi Panner fingers',   category:'Snacks',   price:149, image:'/menu/snacks/corn-samosa.jpg',     imageAlt:'Paneer fingers',    description:'Crispy paneer fingers',              available:true, bestSeller:false },
  { id:'snk-8', name:'Namavarm naughty pop corn panner',category:'Snacks',   price:189, image:'/menu/snacks/corn-samosa.jpg',     imageAlt:'Pop corn paneer',   description:'Naughty pop corn paneer',            available:true, bestSeller:false },
  { id:'snk-9', name:'SBI Colony Chicken Pop Corn',     category:'Snacks',   price:199, image:'/menu/snacks/crunchy-chicken.jpg', imageAlt:'Chicken pop corn',  description:'Crispy chicken pop corn',            available:true, bestSeller:false },
  { id:'san-4', name:'Erraguntapalli Kaju Chicken',     category:'Sandwich', price:99,  image:'/menu/sandwich/chicken-sandwich.jpg',imageAlt:'Kaju chicken',     description:'Kaju chicken sandwich',              available:true, bestSeller:false },
  { id:'san-6', name:'Crazy Crunch Chicken Sandwich',   category:'Sandwich', price:149, image:'/menu/sandwich/crunch-chicken.jpg',  imageAlt:'Crunch chicken',    description:'Crispy fried chicken with slaw',     available:true, bestSeller:true  },
  { id:'moc-2', name:'Recharla Red Wine',               category:'Mocktails',price:99,  image:'/menu/mocktails/red-wine.jpg',        imageAlt:'Red wine mocktail', description:'Deep ruby grape & berry mocktail',   available:true, bestSeller:false },
  { id:'moc-5', name:'Doctor Babu Love byte',           category:'Mocktails',price:129, image:'/menu/mocktails/love-byte.jpg',       imageAlt:'Love byte',         description:'Passion fruit & lychee blend',       available:true, bestSeller:false },
  { id:'shk-7', name:'Nagireddygudem Wine wonder',      category:'Milk Shakes & Thick Shakes', price:99, image:'/menu/shakes/wine-wonder.jpg', imageAlt:'Wine wonder', description:'Wine flavoured shake', available:true, bestSeller:false },
];

/**
 * Migration helper to update existing customer database safely:
 * - Adds all missing products from the new poster
 * - Updates exact matching products' categories and prices without creating duplicates
 * - Preserves existing combos, pizzas, beverages, utilities, and owner custom additions
 * - Idempotent and safe to run repeatedly
 */
export function migrateMenu(existingMenu: MenuItem[]): MenuItem[] {
  if (!existingMenu || existingMenu.length === 0) {
    return DEFAULT_MENU;
  }

  const cleanStr = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

  const result: MenuItem[] = [...existingMenu];

  for (const posterItem of DEFAULT_MENU) {
    // 1. Try to find match by ID
    let idx = result.findIndex((i) => i.id === posterItem.id);

    // 2. If not found by ID, try matching by clean name
    if (idx === -1) {
      idx = result.findIndex((i) => cleanStr(i.name) === cleanStr(posterItem.name));
    }

    if (idx !== -1) {
      // Update exact match to reflect new poster category, price, variants, and image
      result[idx] = {
        ...result[idx],
        name: posterItem.name,
        category: posterItem.category,
        price: posterItem.price,
        image: posterItem.image,
        imageAlt: posterItem.imageAlt || result[idx].imageAlt,
        description: posterItem.description || result[idx].description,
        badge: posterItem.badge !== undefined ? posterItem.badge : result[idx].badge,
        variants: posterItem.variants,
        available: result[idx].available ?? true,
        bestSeller: posterItem.bestSeller ?? result[idx].bestSeller,
      };
    } else {
      // Missing item: add it
      result.push(posterItem);
    }
  }

  // Deduplicate any unintentional duplicate items (e.g. if an item existed under both old ID and new ID)
  const seen = new Set<string>();
  const deduplicated: MenuItem[] = [];
  for (const item of result) {
    const key = `${cleanStr(item.name)}_${cleanStr(item.category)}`;
    if (!seen.has(key)) {
      seen.add(key);
      deduplicated.push(item);
    }
  }

  return deduplicated;
}
