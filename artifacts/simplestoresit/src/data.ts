export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  description: string;
  image: string;
  rating: number;
  ratingCount: number;
  stock: number;
  unit: string;
  featured: boolean;
};

const photo = (id: string) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=700`;

export const categories = [
  'Groceries', 'Fruits & Vegetables', 'Snacks', 'Electronics', 'Computers',
  'Gaming Accessories', 'Fashion', 'Footwear', 'Beauty', 'Home Appliances',
  'Kitchen Essentials', 'Books', 'Stationery', 'Toys', 'Sports Equipment',
];

export const initialProducts: Product[] = [
  { id:'p01',name:'Everyday Basmati Rice',category:'Groceries',price:189,originalPrice:229,description:'Fragrant long-grain basmati, carefully aged for light, fluffy everyday meals.',image:photo('7421206'),rating:4.7,ratingCount:128,stock:42,unit:'1 kg',featured:true },
  { id:'p02',name:'Toor Dal Premium',category:'Groceries',price:156,originalPrice:179,description:'Clean, golden split pigeon peas for dal, sambar and wholesome lunches.',image:photo('4110251'),rating:4.5,ratingCount:86,stock:31,unit:'1 kg',featured:false },
  { id:'p03',name:'Cold-Pressed Sunflower Oil',category:'Groceries',price:245,originalPrice:279,description:'A light, versatile cooking oil in a convenient family-size bottle.',image:photo('4110256'),rating:4.4,ratingCount:74,stock:24,unit:'1 L',featured:false },
  { id:'p04',name:'Fresh Alphonso Mangoes',category:'Fruits & Vegetables',price:349,originalPrice:399,description:'A sweet seasonal box of hand-selected, naturally ripened Alphonso mangoes.',image:photo('5945755'),rating:4.8,ratingCount:212,stock:18,unit:'1 dozen',featured:true },
  { id:'p05',name:'Farm Fresh Avocados',category:'Fruits & Vegetables',price:169,originalPrice:199,description:'Creamy, ripe avocados selected for breakfast toast and fresh salads.',image:photo('5945756'),rating:4.6,ratingCount:59,stock:20,unit:'2 pieces',featured:false },
  { id:'p06',name:'Crisp Garden Tomatoes',category:'Fruits & Vegetables',price:42,originalPrice:55,description:'Juicy red tomatoes, a kitchen staple for curries, chutneys and salads.',image:photo('533280'),rating:4.3,ratingCount:93,stock:50,unit:'500 g',featured:false },
  { id:'p07',name:'Masala Munch Mix',category:'Snacks',price:89,originalPrice:110,description:'A lively crunchy mix of sev, peanuts and lentils with a classic masala kick.',image:photo('5638732'),rating:4.6,ratingCount:148,stock:33,unit:'400 g',featured:true },
  { id:'p08',name:'Dark Chocolate Bites',category:'Snacks',price:129,originalPrice:150,description:'Rich bite-sized dark chocolate squares for a small afternoon treat.',image:photo('918327'),rating:4.7,ratingCount:107,stock:27,unit:'150 g',featured:false },
  { id:'p09',name:'Roasted Cashew Pack',category:'Snacks',price:219,originalPrice:249,description:'Golden roasted cashews with just a pinch of sea salt.',image:photo('4110253'),rating:4.5,ratingCount:65,stock:21,unit:'200 g',featured:false },
  { id:'p10',name:'Pocket Bluetooth Speaker',category:'Electronics',price:1499,originalPrice:1899,description:'Compact wireless sound with clear audio, easy pairing and a handy carry loop.',image:photo('63703'),rating:4.4,ratingCount:164,stock:12,unit:'1 unit',featured:true },
  { id:'p11',name:'Wireless Earbuds Lite',category:'Electronics',price:1899,originalPrice:2299,description:'Comfort-fit wireless earbuds with a pocket charging case and touch controls.',image:photo('3394666'),rating:4.3,ratingCount:231,stock:15,unit:'1 pair',featured:false },
  { id:'p12',name:'Fast Charge Power Bank',category:'Electronics',price:1299,originalPrice:1599,description:'Slim 10,000 mAh power bank with dual output ports for busy days out.',image:photo('4526407'),rating:4.5,ratingCount:119,stock:9,unit:'10,000 mAh',featured:false },
  { id:'p13',name:'Everyday Wireless Mouse',category:'Computers',price:699,originalPrice:849,description:'A comfortable, quiet-click wireless mouse for study desks and home offices.',image:photo('2115257'),rating:4.5,ratingCount:88,stock:16,unit:'1 unit',featured:false },
  { id:'p14',name:'Laptop Sleeve 14-inch',category:'Computers',price:799,originalPrice:999,description:'A soft padded sleeve with a front pocket for a charger and notebooks.',image:photo('18105'),rating:4.4,ratingCount:72,stock:11,unit:'14 inch',featured:false },
  { id:'p15',name:'Foldable Laptop Stand',category:'Computers',price:1199,originalPrice:1499,description:'Lightweight adjustable stand to bring your screen to a comfortable height.',image:photo('4050315'),rating:4.7,ratingCount:94,stock:8,unit:'1 unit',featured:true },
  { id:'p16',name:'RGB Gaming Headset',category:'Gaming Accessories',price:1799,originalPrice:2199,description:'Over-ear comfort, a flexible mic and immersive sound for long play sessions.',image:photo('3945683'),rating:4.6,ratingCount:142,stock:10,unit:'1 unit',featured:true },
  { id:'p17',name:'Precision Gaming Mouse',category:'Gaming Accessories',price:999,originalPrice:1299,description:'Responsive optical tracking with a grippy shape and programmable side buttons.',image:photo('2115256'),rating:4.5,ratingCount:106,stock:13,unit:'1 unit',featured:false },
  { id:'p18',name:'Mechanical Keyboard Compact',category:'Gaming Accessories',price:2499,originalPrice:2999,description:'Compact tactile keyboard with satisfying switches and a sturdy desk presence.',image:photo('1772128'),rating:4.7,ratingCount:83,stock:7,unit:'87 keys',featured:false },
  { id:'p19',name:'Cotton Everyday Kurta',category:'Fashion',price:899,originalPrice:1199,description:'An easy-breezy cotton kurta with a relaxed fit for everyday comfort.',image:photo('6311392'),rating:4.6,ratingCount:122,stock:19,unit:'S–XL',featured:true },
  { id:'p20',name:'Classic Canvas Tote',category:'Fashion',price:399,originalPrice:499,description:'A durable, roomy canvas tote for books, errands and market mornings.',image:photo('5709665'),rating:4.4,ratingCount:61,stock:26,unit:'1 bag',featured:false },
  { id:'p21',name:'Soft Cotton T-shirt',category:'Fashion',price:499,originalPrice:649,description:'A breathable everyday tee in a versatile relaxed cut.',image:photo('8532616'),rating:4.3,ratingCount:102,stock:23,unit:'S–XXL',featured:false },
  { id:'p22',name:'City Walk Sneakers',category:'Footwear',price:1599,originalPrice:1999,description:'Light cushioned sneakers with a clean silhouette for all-day city walks.',image:photo('2529148'),rating:4.6,ratingCount:176,stock:14,unit:'UK 5–10',featured:true },
  { id:'p23',name:'Everyday Slide Sandals',category:'Footwear',price:549,originalPrice:699,description:'Easy slip-on sandals with a soft footbed and grippy sole.',image:photo('1474158622682-e40e69881006'),rating:4.2,ratingCount:54,stock:20,unit:'UK 4–9',featured:false },
  { id:'p24',name:'Classic Lace-up Trainers',category:'Footwear',price:1299,originalPrice:1599,description:'Simple low-top trainers with a comfortable padded collar.',image:photo('1451470849608-88f6f2afc2c2'),rating:4.4,ratingCount:75,stock:10,unit:'UK 6–11',featured:false },
  { id:'p25',name:'Aloe Daily Face Wash',category:'Beauty',price:249,originalPrice:299,description:'A gentle daily cleanser with aloe to leave skin feeling fresh, not tight.',image:photo('3735655'),rating:4.5,ratingCount:112,stock:31,unit:'150 ml',featured:false },
  { id:'p26',name:'Hydrating Skin Cream',category:'Beauty',price:329,originalPrice:399,description:'A light, fast-absorbing moisturizer for a comfortable daily routine.',image:photo('3735616'),rating:4.6,ratingCount:148,stock:25,unit:'100 ml',featured:true },
  { id:'p27',name:'Everyday Shampoo',category:'Beauty',price:199,originalPrice:249,description:'A mild everyday shampoo with a fresh, clean feel and gentle lather.',image:photo('3735655'),rating:4.3,ratingCount:83,stock:29,unit:'200 ml',featured:false },
  { id:'p28',name:'Compact Air Fryer',category:'Home Appliances',price:3999,originalPrice:4799,description:'A countertop air fryer with simple controls for crisp weeknight favourites.',image:photo('4144222'),rating:4.5,ratingCount:167,stock:6,unit:'3.5 L',featured:true },
  { id:'p29',name:'Electric Kettle Steel',category:'Home Appliances',price:1199,originalPrice:1499,description:'A quick-boil stainless-steel kettle with auto shut-off and a wide opening.',image:photo('4144222'),rating:4.4,ratingCount:121,stock:9,unit:'1.5 L',featured:false },
  { id:'p30',name:'Tabletop Desk Fan',category:'Home Appliances',price:899,originalPrice:1099,description:'A compact, quiet fan with adjustable tilt for a study desk or bedside table.',image:photo('2092115'),rating:4.2,ratingCount:57,stock:11,unit:'1 unit',featured:false },
  { id:'p31',name:'Non-stick Frying Pan',category:'Kitchen Essentials',price:749,originalPrice:949,description:'An everyday non-stick pan with a comfortable handle and even heating.',image:photo('4226896'),rating:4.5,ratingCount:91,stock:18,unit:'24 cm',featured:false },
  { id:'p32',name:'Glass Storage Jar Set',category:'Kitchen Essentials',price:599,originalPrice:749,description:'Three clear kitchen jars with snug lids for tea, snacks and pantry staples.',image:photo('4226896'),rating:4.6,ratingCount:77,stock:14,unit:'Set of 3',featured:false },
  { id:'p33',name:'Bamboo Serving Board',category:'Kitchen Essentials',price:449,originalPrice:599,description:'A smooth bamboo board for serving snacks, chopping fruit and everyday prep.',image:photo('4226893'),rating:4.4,ratingCount:48,stock:12,unit:'1 board',featured:false },
  { id:'p34',name:'The Blue Umbrella',category:'Books',price:199,originalPrice:250,description:'A much-loved Ruskin Bond story about a little village, a bright umbrella and kindness.',image:photo('1592496431122-2349e0fbc666'),rating:4.8,ratingCount:206,stock:17,unit:'Paperback',featured:true },
  { id:'p35',name:'Little Book of Big Ideas',category:'Books',price:349,originalPrice:425,description:'Short, approachable ideas from science and history for curious young readers.',image:photo('1512820790803-83ca734da794'),rating:4.5,ratingCount:73,stock:13,unit:'Paperback',featured:false },
  { id:'p36',name:'Sketch & Doodle Journal',category:'Books',price:279,originalPrice:349,description:'A sturdy blank-page journal for sketches, lists and ideas in progress.',image:photo('1455390582262-044cdead277a'),rating:4.6,ratingCount:68,stock:16,unit:'160 pages',featured:false },
  { id:'p37',name:'Colour Pop Pencil Set',category:'Stationery',price:149,originalPrice:189,description:'A set of 12 smooth coloured pencils for class projects and weekend doodles.',image:photo('1598620617137-2d8a4cfd3065'),rating:4.7,ratingCount:134,stock:32,unit:'12 colours',featured:true },
  { id:'p38',name:'Hardcover Notes Notebook',category:'Stationery',price:199,originalPrice:249,description:'A compact ruled notebook with a durable cover and ribbon marker.',image:photo('1531346878377-a5be20888e57'),rating:4.5,ratingCount:93,stock:28,unit:'180 pages',featured:false },
  { id:'p39',name:'Desk Essentials Kit',category:'Stationery',price:299,originalPrice:379,description:'A neat study set with pens, sticky notes, ruler and paper clips.',image:photo('1513364776144-60967b0f800f'),rating:4.4,ratingCount:58,stock:20,unit:'6 pieces',featured:false },
  { id:'p40',name:'Wooden Building Blocks',category:'Toys',price:699,originalPrice:899,description:'Colourful smooth-finish wooden blocks for open-ended building and play.',image:photo('1599629954294-14df9ec24fa1'),rating:4.8,ratingCount:109,stock:11,unit:'30 pieces',featured:true },
  { id:'p41',name:'Pull-back Mini Cars',category:'Toys',price:349,originalPrice:449,description:'A set of bright little pull-back cars made for imaginative race-day stories.',image:photo('1558060370-d644479cb6f7'),rating:4.5,ratingCount:86,stock:15,unit:'Set of 4',featured:false },
  { id:'p42',name:'Family Puzzle 500',category:'Toys',price:499,originalPrice:649,description:'A colourful 500-piece landscape puzzle for a relaxed family afternoon.',image:photo('1606503153255-59d8b8b82152'),rating:4.6,ratingCount:71,stock:8,unit:'500 pieces',featured:false },
  { id:'p43',name:'All-weather Cricket Ball',category:'Sports Equipment',price:249,originalPrice:299,description:'A durable practice ball for casual games in the park and backyard.',image:photo('1531415074968-036ba1b575da'),rating:4.5,ratingCount:64,stock:24,unit:'1 ball',featured:false },
  { id:'p44',name:'Yoga Mat Comfort',category:'Sports Equipment',price:899,originalPrice:1099,description:'A grippy cushioned mat with a useful carry strap for home practice.',image:photo('1599447292180-45fd84092ef4'),rating:4.7,ratingCount:118,stock:13,unit:'6 mm',featured:true },
  { id:'p45',name:'Skipping Rope Adjustable',category:'Sports Equipment',price:299,originalPrice:399,description:'A lightweight adjustable rope with comfortable handles for everyday movement.',image:photo('1434596922112-19c563067271'),rating:4.3,ratingCount:52,stock:17,unit:'1 rope',featured:false },
];

export const rupees = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
