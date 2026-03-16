// GenAddress API - Serverless function for Vercel
// Multi-country support with locale-specific formatting

export default function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const params = req.method === 'POST' ? req.body || {} : req.query || {};
    const {
      quantity = 5,
      country = 'US',
      state,
      gender = 'random',
      phone = 'true',
      email = 'true',
      ssn = 'true',
      dob = 'true',
    } = params;

    const qty = Math.min(Math.max(parseInt(quantity) || 5, 1), 100);
    const includePhone = phone !== 'false' && phone !== '0' && phone !== false;
    const includeEmail = email !== 'false' && email !== '0' && email !== false;
    const includeSSN = ssn !== 'false' && ssn !== '0' && ssn !== false;
    const includeDOB = dob !== 'false' && dob !== '0' && dob !== false;

    const addresses = generateAddresses({
      quantity: qty,
      country: String(country).toUpperCase(),
      stateAbbr: state ? String(state).toUpperCase() : undefined,
      gender,
      includePhone,
      includeEmail,
      includeSSN,
      includeDOB,
    });

    res.json({
      success: true,
      count: addresses.length,
      params: { country, state: state || null, gender, phone: includePhone, email: includeEmail },
      addresses,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message || 'Failed to generate addresses' });
  }
}

// ============== UTILITIES ==============
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomPick(arr) { return arr[randomInt(0, arr.length - 1)]; }
function randomDigits(count) { let s = ''; for (let i = 0; i < count; i++) s += randomInt(0, 9).toString(); return s; }

// ============== NAME DATA ==============
const MALE_FIRST_NAMES = [
  'Aaron','Adam','Adrian','Alan','Albert','Alex','Alexander','Alfred','Andrew','Anthony',
  'Arthur','Austin','Barry','Ben','Benjamin','Bernard','Bill','Billy','Blake','Bob','Bobby',
  'Brad','Bradley','Brandon','Brent','Brett','Brian','Bruce','Bryan','Byron','Caleb','Calvin',
  'Cameron','Carl','Carlos','Carter','Chad','Charles','Charlie','Chase','Chris','Christian',
  'Christopher','Clark','Clayton','Clyde','Cody','Colin','Colton','Conrad','Craig','Curtis',
  'Dale','Dallas','Dalton','Damian','Dan','Daniel','Danny','Darius','Darren','Dave','David',
  'Dean','Dennis','Derek','Derrick','Desmond','Devin','Diego','Don','Donald','Douglas','Drew',
  'Duncan','Dustin','Dylan','Earl','Ed','Eddie','Edgar','Eduardo','Edward','Edwin','Eli',
  'Elijah','Elliott','Eric','Erik','Ernest','Ethan','Eugene','Evan','Felix','Fernando','Floyd',
  'Francis','Francisco','Frank','Franklin','Fred','Frederick','Gabriel','Gary','Gavin','Gene',
  'George','Gerald','Gilbert','Glen','Glenn','Gordon','Graham','Grant','Greg','Gregory','Guy',
  'Harold','Harrison','Harry','Harvey','Hector','Henry','Herbert','Howard','Hugh','Hugo',
  'Hunter','Ian','Isaac','Isaiah','Ivan','Jack','Jackson','Jacob','Jake','James','Jamie',
  'Jared','Jason','Javier','Jay','Jeff','Jeffrey','Jeremy','Jerome','Jerry','Jesse','Jim',
  'Jimmy','Joe','Joel','John','Johnny','Jon','Jonathan','Jordan','Jorge','Jose','Joseph',
  'Josh','Joshua','Juan','Julian','Justin','Karl','Keith','Ken','Kenneth','Kevin','Kirk',
  'Kurt','Kyle','Lance','Larry','Lawrence','Lee','Leo','Leon','Leonard','Lewis','Lincoln',
  'Lloyd','Logan','Lorenzo','Louis','Lucas','Luis','Luke','Malcolm','Manuel','Marc','Marco',
  'Marcus','Mario','Mark','Marshall','Martin','Marvin','Mason','Matt','Matthew','Maurice',
  'Max','Michael','Miguel','Mike','Miles','Milton','Mitchell','Mohamed','Morgan','Nathan',
  'Nathaniel','Neil','Nelson','Nicholas','Nick','Noah','Norman','Oliver','Omar','Oscar','Owen',
  'Pablo','Parker','Patrick','Paul','Pedro','Peter','Philip','Preston','Rafael','Ralph',
  'Ramon','Randall','Randy','Raul','Ray','Raymond','Rene','Ricardo','Richard','Rick','Riley',
  'Rob','Robert','Roberto','Robin','Rod','Rodney','Roger','Roland','Ron','Ronald','Ross','Roy',
  'Ruben','Russell','Ryan','Sam','Samuel','Santiago','Scott','Sean','Sergio','Seth','Shane',
  'Shaun','Sidney','Simon','Solomon','Spencer','Stanley','Stephen','Steve','Steven','Stuart',
  'Taylor','Ted','Terry','Theodore','Thomas','Tim','Timothy','Todd','Tom','Tommy','Tony',
  'Travis','Trevor','Troy','Tyler','Victor','Vincent','Wade','Walter','Warren','Wayne','Wesley',
  'Will','William','Willie','Wilson','Xavier','Zachary',
];

const FEMALE_FIRST_NAMES = [
  'Abigail','Ada','Alexandra','Alice','Alicia','Allison','Alyssa','Amanda','Amber','Amelia',
  'Amy','Ana','Andrea','Angela','Angelica','Anita','Ann','Anna','Anne','Annette','Annie',
  'April','Ashley','Audrey','Aurora','Autumn','Ava','Barbara','Beatrice','Becky','Beth',
  'Betty','Beverly','Bianca','Bonnie','Brenda','Bridget','Brittany','Brooke','Camille',
  'Candace','Carla','Carmen','Carol','Caroline','Carolyn','Carrie','Casey','Catherine','Cathy',
  'Charlotte','Chelsea','Cheryl','Chloe','Christina','Christine','Cindy','Claire','Clara',
  'Claudia','Colleen','Connie','Courtney','Crystal','Cynthia','Daisy','Dana','Danielle',
  'Dawn','Debbie','Deborah','Denise','Diana','Diane','Donna','Doris','Dorothy','Edith',
  'Eileen','Eleanor','Elena','Elizabeth','Ella','Ellen','Emily','Emma','Erica','Erin','Esther',
  'Eva','Evelyn','Faith','Faye','Felicia','Florence','Frances','Gabriela','Gail','Georgia',
  'Gina','Gladys','Gloria','Grace','Gretchen','Hannah','Harriet','Hazel','Heather','Heidi',
  'Helen','Holly','Hope','Ida','Irene','Iris','Isabel','Isabella','Ivy','Jackie','Jacqueline',
  'Jade','Jamie','Jane','Janet','Janice','Jasmine','Jean','Jenna','Jennifer','Jenny','Jessica',
  'Jill','Joan','Joanna','Jocelyn','Josephine','Joy','Joyce','Judith','Judy','Julia','Julie',
  'June','Karen','Kate','Katherine','Kathleen','Kathryn','Katie','Kayla','Kelly','Kimberly',
  'Kristen','Kristin','Laura','Lauren','Laurie','Leah','Leslie','Lillian','Lily','Linda',
  'Lindsay','Lisa','Lois','Loretta','Lori','Louise','Lucy','Lydia','Lynn','Mabel','Madeline',
  'Madison','Maggie','Margaret','Maria','Marie','Marilyn','Marina','Marjorie','Martha','Mary',
  'Maureen','Megan','Melanie','Melissa','Michelle','Mildred','Miranda','Molly','Monica',
  'Morgan','Nancy','Naomi','Natalie','Natasha','Nicole','Nina','Nora','Norma','Olivia','Pam',
  'Pamela','Patricia','Paula','Pauline','Peggy','Penny','Phyllis','Rachel','Rebecca','Regina',
  'Renee','Rhonda','Rita','Roberta','Robin','Rosa','Rose','Rosemary','Ruby','Ruth','Sabrina',
  'Sally','Samantha','Sandra','Sara','Sarah','Shannon','Sharon','Sheila','Shelby','Sherry',
  'Shirley','Sierra','Sofia','Sophia','Stacey','Stella','Stephanie','Sue','Susan','Suzanne',
  'Sylvia','Tamara','Tammy','Tanya','Tara','Teresa','Terri','Theresa','Tiffany','Tina','Tonya',
  'Tracy','Valerie','Vanessa','Vera','Veronica','Victoria','Virginia','Vivian','Wanda','Wendy',
  'Whitney','Yolanda','Yvonne',
];

const LAST_NAMES = [
  'Abbott','Adams','Aguilar','Alexander','Allen','Alvarez','Anderson','Andrews','Armstrong',
  'Arnold','Austin','Bailey','Baker','Baldwin','Banks','Barnes','Barnett','Barrett','Barton',
  'Bass','Bates','Beck','Bell','Bennett','Benson','Berry','Bishop','Black','Blair','Blake',
  'Bolton','Bond','Bowen','Boyd','Bradley','Brady','Brennan','Brewer','Bridges','Brooks',
  'Brown','Bruce','Bryan','Bryant','Buchanan','Burke','Burns','Burton','Bush','Butler','Byrd',
  'Caldwell','Campbell','Cannon','Carlson','Carpenter','Carr','Carroll','Carson','Carter',
  'Casey','Castillo','Castro','Chambers','Chan','Chandler','Chang','Chapman','Chase','Chen',
  'Clark','Clay','Clayton','Cole','Coleman','Collins','Cook','Cooper','Cox','Craig','Crawford',
  'Cross','Cruz','Cunningham','Curtis','Daniel','Daniels','Davidson','Davis','Dawson','Day',
  'Dean','Dennis','Diaz','Dixon','Douglas','Drake','Duncan','Dunn','Edwards','Elliott','Ellis',
  'Evans','Farmer','Ferguson','Fernandez','Fields','Fisher','Fitzgerald','Fleming','Fletcher',
  'Flores','Floyd','Ford','Foster','Fowler','Fox','Francis','Frank','Franklin','Freeman',
  'French','Frost','Fuller','Garcia','Gardner','Garrett','Gates','George','Gibson','Gilbert',
  'Glenn','Gomez','Gonzalez','Gordon','Graham','Grant','Graves','Gray','Green','Gregory',
  'Griffin','Gross','Guerrero','Gutierrez','Hall','Hamilton','Hammond','Hansen','Hardy',
  'Harper','Harris','Harrison','Hart','Harvey','Hawkins','Hayes','Henderson','Henry',
  'Hernandez','Herrera','Hicks','Hill','Hoffman','Holland','Holmes','Holt','Hopkins','Houston',
  'Howard','Howell','Hudson','Hughes','Hunt','Hunter','Jackson','Jacobs','James','Jenkins',
  'Jensen','Jimenez','Johnson','Johnston','Jones','Jordan','Joseph','Kane','Kelly','Kennedy',
  'Kim','King','Klein','Knight','Knox','Kramer','Lambert','Lane','Larson','Lawrence','Lawson',
  'Lee','Leonard','Lewis','Little','Lloyd','Logan','Long','Lopez','Lowe','Lucas','Lynch',
  'Manning','Marshall','Martin','Martinez','Mason','Matthews','Maxwell','May','McCarthy',
  'McDonald','McKenzie','McLaughlin','Medina','Mendez','Meyer','Miles','Miller','Mills',
  'Mitchell','Monroe','Montgomery','Moore','Morales','Morgan','Morris','Morrison','Murphy',
  'Murray','Myers','Nash','Nelson','Newman','Newton','Nguyen','Nichols','Norman','Norton',
  'Oliver','Olson','Ortega','Ortiz','Owen','Owens','Page','Palmer','Parker','Parks','Parsons',
  'Patel','Patrick','Patterson','Paul','Payne','Pearson','Perez','Perkins','Perry','Peters',
  'Peterson','Phillips','Pierce','Pope','Porter','Potter','Powell','Price','Quinn','Ramirez',
  'Ramos','Randall','Ray','Reed','Reeves','Reid','Reyes','Reynolds','Rhodes','Rice','Richards',
  'Richardson','Riley','Rivera','Roberts','Robertson','Robinson','Rodriguez','Rogers','Roman',
  'Romero','Rose','Ross','Rowe','Ruiz','Russell','Ryan','Salazar','Sanchez','Sanders',
  'Sandoval','Santiago','Santos','Saunders','Schmidt','Schneider','Schultz','Scott','Shaw',
  'Shelton','Sherman','Silva','Simmons','Simon','Simpson','Singh','Smith','Snyder','Solomon',
  'Spencer','Stanley','Steele','Stephens','Stevens','Stewart','Stone','Sullivan','Summers',
  'Sutton','Swanson','Tanner','Tate','Taylor','Terry','Thomas','Thompson','Todd','Torres',
  'Tucker','Turner','Tyler','Valdez','Vargas','Vasquez','Vaughn','Vincent','Wade','Wagner',
  'Walker','Wallace','Walsh','Walters','Ward','Warner','Warren','Washington','Watson','Watts',
  'Weaver','Webb','Weber','Webster','Wells','West','Wheeler','White','Williams','Williamson',
  'Willis','Wilson','Wolf','Wong','Wood','Woods','Wright','Wyatt','Young','Zimmerman',
];

const EMAIL_DOMAINS = ['gmail.com','yahoo.com','hotmail.com','outlook.com','icloud.com','protonmail.com','mail.com','aol.com','live.com'];

// ============== COUNTRY LOCALE DATA ==============
const COUNTRY_LOCALES = {
  US: {
    name: 'United States', code: 'US',
    regions: [
      {name:'Alabama',abbr:'AL',postalPrefix:'350'},{name:'Alaska',abbr:'AK',postalPrefix:'995'},
      {name:'Arizona',abbr:'AZ',postalPrefix:'850'},{name:'Arkansas',abbr:'AR',postalPrefix:'717'},
      {name:'California',abbr:'CA',postalPrefix:'900'},{name:'Colorado',abbr:'CO',postalPrefix:'800'},
      {name:'Connecticut',abbr:'CT',postalPrefix:'061'},{name:'Delaware',abbr:'DE',postalPrefix:'198'},
      {name:'Florida',abbr:'FL',postalPrefix:'322'},{name:'Georgia',abbr:'GA',postalPrefix:'301'},
      {name:'Hawaii',abbr:'HI',postalPrefix:'967'},{name:'Idaho',abbr:'ID',postalPrefix:'832'},
      {name:'Illinois',abbr:'IL',postalPrefix:'600'},{name:'Indiana',abbr:'IN',postalPrefix:'463'},
      {name:'Iowa',abbr:'IA',postalPrefix:'510'},{name:'Kansas',abbr:'KS',postalPrefix:'666'},
      {name:'Kentucky',abbr:'KY',postalPrefix:'404'},{name:'Louisiana',abbr:'LA',postalPrefix:'701'},
      {name:'Maine',abbr:'ME',postalPrefix:'042'},{name:'Maryland',abbr:'MD',postalPrefix:'210'},
      {name:'Massachusetts',abbr:'MA',postalPrefix:'026'},{name:'Michigan',abbr:'MI',postalPrefix:'480'},
      {name:'Minnesota',abbr:'MN',postalPrefix:'555'},{name:'Mississippi',abbr:'MS',postalPrefix:'387'},
      {name:'Missouri',abbr:'MO',postalPrefix:'650'},{name:'Montana',abbr:'MT',postalPrefix:'590'},
      {name:'Nebraska',abbr:'NE',postalPrefix:'688'},{name:'Nevada',abbr:'NV',postalPrefix:'898'},
      {name:'New Hampshire',abbr:'NH',postalPrefix:'036'},{name:'New Jersey',abbr:'NJ',postalPrefix:'076'},
      {name:'New Mexico',abbr:'NM',postalPrefix:'880'},{name:'New York',abbr:'NY',postalPrefix:'122'},
      {name:'North Carolina',abbr:'NC',postalPrefix:'288'},{name:'North Dakota',abbr:'ND',postalPrefix:'586'},
      {name:'Ohio',abbr:'OH',postalPrefix:'444'},{name:'Oklahoma',abbr:'OK',postalPrefix:'730'},
      {name:'Oregon',abbr:'OR',postalPrefix:'979'},{name:'Pennsylvania',abbr:'PA',postalPrefix:'186'},
      {name:'Rhode Island',abbr:'RI',postalPrefix:'029'},{name:'South Carolina',abbr:'SC',postalPrefix:'299'},
      {name:'South Dakota',abbr:'SD',postalPrefix:'577'},{name:'Tennessee',abbr:'TN',postalPrefix:'383'},
      {name:'Texas',abbr:'TX',postalPrefix:'798'},{name:'Utah',abbr:'UT',postalPrefix:'847'},
      {name:'Vermont',abbr:'VT',postalPrefix:'050'},{name:'Virginia',abbr:'VA',postalPrefix:'222'},
      {name:'Washington',abbr:'WA',postalPrefix:'990'},{name:'West Virginia',abbr:'WV',postalPrefix:'247'},
      {name:'Wisconsin',abbr:'WI',postalPrefix:'549'},{name:'Wyoming',abbr:'WY',postalPrefix:'831'},
    ],
    postalFormat: (r) => { const p = COUNTRY_LOCALES.US.regions.find(s=>s.abbr===r); return (p?p.postalPrefix:randomDigits(3))+randomDigits(2); },
    phoneFormat: () => { const a=randomPick(['201','212','213','305','310','312','404','415','503','617','646','702','713','718','832','917']); return randomPick([`(${a}) ${randomDigits(3)}-${randomDigits(4)}`,`${a}-${randomDigits(3)}-${randomDigits(4)}`,`+1 ${a} ${randomDigits(3)} ${randomDigits(4)}`]); },
    cities: ['New York','Los Angeles','Chicago','Houston','Phoenix','Philadelphia','San Antonio','San Diego','Dallas','San Jose','Austin','Jacksonville','Fort Worth','Columbus','Charlotte','Indianapolis','San Francisco','Seattle','Denver','Nashville','Oklahoma City','Portland','Las Vegas','Memphis','Louisville','Baltimore','Milwaukee','Albuquerque','Tucson','Fresno','Sacramento','Mesa','Kansas City','Atlanta','Omaha','Colorado Springs','Raleigh','Long Beach','Virginia Beach','Miami','Oakland','Minneapolis','Tampa','Tulsa','Arlington','New Orleans'],
    streetSuffixes: ['Street','Avenue','Boulevard','Drive','Lane','Road','Court','Place','Way','Circle','Trail','Parkway'],
    addressFormat: 'us',
  },
  GB: {
    name: 'United Kingdom', code: 'GB',
    regions: [
      {name:'England',abbr:'ENG',postalPrefix:'E'},{name:'Scotland',abbr:'SCT',postalPrefix:'EH'},
      {name:'Wales',abbr:'WLS',postalPrefix:'CF'},{name:'Northern Ireland',abbr:'NIR',postalPrefix:'BT'},
      {name:'Greater London',abbr:'LDN',postalPrefix:'SW'},{name:'South East',abbr:'SE',postalPrefix:'RG'},
      {name:'South West',abbr:'SW',postalPrefix:'BS'},{name:'East Midlands',abbr:'EM',postalPrefix:'NG'},
      {name:'West Midlands',abbr:'WM',postalPrefix:'B'},{name:'North West',abbr:'NW',postalPrefix:'M'},
      {name:'North East',abbr:'NE',postalPrefix:'NE'},{name:'Yorkshire',abbr:'YH',postalPrefix:'LS'},
      {name:'East of England',abbr:'EE',postalPrefix:'CB'},
    ],
    postalFormat: () => randomPick(['SW','EC','WC','SE','NW','E','N','W'])+randomInt(1,20)+' '+randomInt(1,9)+randomPick(['AB','CD','EF','GH','JK','NP','QR','ST','WX','YZ']),
    phoneFormat: () => randomPick([`+44 ${randomInt(20,79)} ${randomDigits(4)} ${randomDigits(4)}`,`0${randomInt(20,79)} ${randomDigits(4)} ${randomDigits(4)}`,`+44 7${randomDigits(3)} ${randomDigits(6)}`]),
    cities: ['London','Birmingham','Manchester','Glasgow','Leeds','Liverpool','Edinburgh','Bristol','Sheffield','Leicester','Coventry','Bradford','Cardiff','Belfast','Nottingham','Kingston upon Hull','Newcastle upon Tyne','Stoke-on-Trent','Southampton','Derby','Plymouth','Wolverhampton','Reading','Aberdeen','Swansea','Oxford','Cambridge','Bath','York','Canterbury'],
    streetSuffixes: ['Street','Road','Lane','Avenue','Close','Drive','Way','Crescent','Terrace','Place','Gardens','Grove','Hill','Mews','Row','Square'],
    addressFormat: 'uk',
  },
  CA: {
    name: 'Canada', code: 'CA',
    regions: [
      {name:'Ontario',abbr:'ON',postalPrefix:'M'},{name:'Quebec',abbr:'QC',postalPrefix:'H'},
      {name:'British Columbia',abbr:'BC',postalPrefix:'V'},{name:'Alberta',abbr:'AB',postalPrefix:'T'},
      {name:'Manitoba',abbr:'MB',postalPrefix:'R'},{name:'Saskatchewan',abbr:'SK',postalPrefix:'S'},
      {name:'Nova Scotia',abbr:'NS',postalPrefix:'B'},{name:'New Brunswick',abbr:'NB',postalPrefix:'E'},
      {name:'Newfoundland',abbr:'NL',postalPrefix:'A'},{name:'Prince Edward Island',abbr:'PE',postalPrefix:'C'},
    ],
    postalFormat: (r) => { const p=COUNTRY_LOCALES.CA.regions.find(s=>s.abbr===r); const l=p?p.postalPrefix:randomPick(['M','H','V','T','R','K','L']); return `${l}${randomInt(1,9)}${randomPick('ABCDEFGHJKLMNPRSTVWXYZ'.split(''))} ${randomInt(1,9)}${randomPick('ABCDEFGHJKLMNPRSTVWXYZ'.split(''))}${randomInt(0,9)}`; },
    phoneFormat: () => { const a=randomPick(['416','647','905','514','438','604','778','403','587','204','306','902']); return randomPick([`(${a}) ${randomDigits(3)}-${randomDigits(4)}`,`+1 ${a} ${randomDigits(3)} ${randomDigits(4)}`]); },
    cities: ['Toronto','Montreal','Vancouver','Calgary','Edmonton','Ottawa','Winnipeg','Quebec City','Hamilton','Kitchener','London','Victoria','Halifax','Oshawa','Windsor','Saskatoon','Regina','Barrie','Kelowna','Sherbrooke','Guelph','Kingston','Moncton','Thunder Bay'],
    streetSuffixes: ['Street','Avenue','Boulevard','Drive','Road','Way','Crescent','Court','Place','Circle','Trail'],
    addressFormat: 'us',
  },
  AU: {
    name: 'Australia', code: 'AU',
    regions: [
      {name:'New South Wales',abbr:'NSW',postalPrefix:'20'},{name:'Victoria',abbr:'VIC',postalPrefix:'30'},
      {name:'Queensland',abbr:'QLD',postalPrefix:'40'},{name:'South Australia',abbr:'SA',postalPrefix:'50'},
      {name:'Western Australia',abbr:'WA',postalPrefix:'60'},{name:'Tasmania',abbr:'TAS',postalPrefix:'70'},
      {name:'Northern Territory',abbr:'NT',postalPrefix:'08'},{name:'Australian Capital Territory',abbr:'ACT',postalPrefix:'26'},
    ],
    postalFormat: (r) => { const p=COUNTRY_LOCALES.AU.regions.find(s=>s.abbr===r); return (p?p.postalPrefix:randomPick(['20','30','40','50','60']))+randomDigits(2); },
    phoneFormat: () => randomPick([`+61 ${randomInt(2,4)} ${randomDigits(4)} ${randomDigits(4)}`,`0${randomInt(2,4)} ${randomDigits(4)} ${randomDigits(4)}`,`+61 4${randomDigits(2)} ${randomDigits(3)} ${randomDigits(3)}`]),
    cities: ['Sydney','Melbourne','Brisbane','Perth','Adelaide','Gold Coast','Canberra','Newcastle','Hobart','Wollongong','Geelong','Townsville','Cairns','Darwin','Toowoomba','Ballarat','Bendigo','Launceston','Mackay','Rockhampton'],
    streetSuffixes: ['Street','Road','Avenue','Drive','Place','Crescent','Court','Way','Lane','Close','Parade','Terrace','Boulevard'],
    addressFormat: 'us',
  },
  DE: {
    name: 'Germany', code: 'DE',
    regions: [
      {name:'Baden-Württemberg',abbr:'BW',postalPrefix:'70'},{name:'Bayern',abbr:'BY',postalPrefix:'80'},
      {name:'Berlin',abbr:'BE',postalPrefix:'10'},{name:'Brandenburg',abbr:'BB',postalPrefix:'14'},
      {name:'Bremen',abbr:'HB',postalPrefix:'28'},{name:'Hamburg',abbr:'HH',postalPrefix:'20'},
      {name:'Hessen',abbr:'HE',postalPrefix:'60'},{name:'Niedersachsen',abbr:'NI',postalPrefix:'30'},
      {name:'Nordrhein-Westfalen',abbr:'NW',postalPrefix:'40'},{name:'Rheinland-Pfalz',abbr:'RP',postalPrefix:'55'},
      {name:'Saarland',abbr:'SL',postalPrefix:'66'},{name:'Sachsen',abbr:'SN',postalPrefix:'01'},
      {name:'Schleswig-Holstein',abbr:'SH',postalPrefix:'24'},{name:'Thüringen',abbr:'TH',postalPrefix:'99'},
    ],
    postalFormat: (r) => { const p=COUNTRY_LOCALES.DE.regions.find(s=>s.abbr===r); return (p?p.postalPrefix:randomPick(['10','20','30','40','50','60','70','80']))+randomDigits(3); },
    phoneFormat: () => randomPick([`+49 ${randomInt(30,89)} ${randomDigits(7)}`,`0${randomInt(30,89)} ${randomDigits(7)}`,`+49 1${randomInt(50,79)} ${randomDigits(7)}`]),
    cities: ['Berlin','Hamburg','München','Köln','Frankfurt am Main','Stuttgart','Düsseldorf','Leipzig','Dortmund','Essen','Bremen','Dresden','Hannover','Nürnberg','Duisburg','Bochum','Wuppertal','Bielefeld','Bonn','Münster','Mannheim','Karlsruhe','Augsburg','Wiesbaden','Heidelberg','Freiburg'],
    streetSuffixes: ['Straße','Weg','Gasse','Allee','Ring','Platz','Damm','Ufer','Steig','Pfad'],
    addressFormat: 'eu',
  },
  FR: {
    name: 'France', code: 'FR',
    regions: [
      {name:'Île-de-France',abbr:'IDF',postalPrefix:'75'},{name:'Auvergne-Rhône-Alpes',abbr:'ARA',postalPrefix:'69'},
      {name:'Nouvelle-Aquitaine',abbr:'NAQ',postalPrefix:'33'},{name:'Occitanie',abbr:'OCC',postalPrefix:'31'},
      {name:'Hauts-de-France',abbr:'HDF',postalPrefix:'59'},{name:"Provence-Alpes-Côte d'Azur",abbr:'PAC',postalPrefix:'13'},
      {name:'Grand Est',abbr:'GES',postalPrefix:'67'},{name:'Pays de la Loire',abbr:'PDL',postalPrefix:'44'},
      {name:'Bretagne',abbr:'BRE',postalPrefix:'35'},{name:'Normandie',abbr:'NOR',postalPrefix:'76'},
      {name:'Bourgogne-Franche-Comté',abbr:'BFC',postalPrefix:'21'},{name:'Centre-Val de Loire',abbr:'CVL',postalPrefix:'45'},
    ],
    postalFormat: (r) => { const p=COUNTRY_LOCALES.FR.regions.find(s=>s.abbr===r); return (p?p.postalPrefix:randomPick(['75','69','33','31','59','13','67','44']))+randomDigits(3); },
    phoneFormat: () => randomPick([`+33 ${randomInt(1,6)} ${randomDigits(2)} ${randomDigits(2)} ${randomDigits(2)} ${randomDigits(2)}`,`0${randomInt(1,6)} ${randomDigits(2)} ${randomDigits(2)} ${randomDigits(2)} ${randomDigits(2)}`]),
    cities: ['Paris','Marseille','Lyon','Toulouse','Nice','Nantes','Strasbourg','Montpellier','Bordeaux','Lille','Rennes','Reims','Saint-Étienne','Le Havre','Toulon','Grenoble','Dijon','Angers','Nîmes','Villeurbanne','Clermont-Ferrand','Le Mans','Aix-en-Provence','Brest','Tours'],
    streetSuffixes: ['Rue','Avenue','Boulevard','Chemin','Place','Passage','Impasse','Allée','Cours','Quai'],
    addressFormat: 'eu',
  },
  JP: {
    name: 'Japan', code: 'JP',
    regions: [
      {name:'Tokyo',abbr:'東京',postalPrefix:'100'},{name:'Osaka',abbr:'大阪',postalPrefix:'530'},
      {name:'Kanagawa',abbr:'神奈川',postalPrefix:'220'},{name:'Aichi',abbr:'愛知',postalPrefix:'450'},
      {name:'Saitama',abbr:'埼玉',postalPrefix:'330'},{name:'Chiba',abbr:'千葉',postalPrefix:'260'},
      {name:'Hokkaido',abbr:'北海道',postalPrefix:'060'},{name:'Hyogo',abbr:'兵庫',postalPrefix:'650'},
      {name:'Fukuoka',abbr:'福岡',postalPrefix:'810'},{name:'Kyoto',abbr:'京都',postalPrefix:'600'},
      {name:'Shizuoka',abbr:'静岡',postalPrefix:'420'},{name:'Hiroshima',abbr:'広島',postalPrefix:'730'},
    ],
    postalFormat: (r) => { const p=COUNTRY_LOCALES.JP.regions.find(s=>s.abbr===r||s.name===r); const pre=p?p.postalPrefix:randomPick(['100','530','220','450']); return pre+'-'+randomDigits(4); },
    phoneFormat: () => randomPick([`+81 ${randomInt(3,90)}-${randomDigits(4)}-${randomDigits(4)}`,`0${randomInt(3,90)}-${randomDigits(4)}-${randomDigits(4)}`]),
    cities: ['Tokyo','Yokohama','Osaka','Nagoya','Sapporo','Fukuoka','Kobe','Kyoto','Kawasaki','Saitama','Hiroshima','Sendai','Kitakyushu','Chiba','Sakai','Niigata','Hamamatsu','Shizuoka','Okayama','Kumamoto','Kagoshima','Nara'],
    streetSuffixes: ['丁目','番地','号'],
    addressFormat: 'jp',
  },
  BR: {
    name: 'Brazil', code: 'BR',
    regions: [
      {name:'São Paulo',abbr:'SP',postalPrefix:'01'},{name:'Rio de Janeiro',abbr:'RJ',postalPrefix:'20'},
      {name:'Minas Gerais',abbr:'MG',postalPrefix:'30'},{name:'Bahia',abbr:'BA',postalPrefix:'40'},
      {name:'Paraná',abbr:'PR',postalPrefix:'80'},{name:'Rio Grande do Sul',abbr:'RS',postalPrefix:'90'},
      {name:'Pernambuco',abbr:'PE',postalPrefix:'50'},{name:'Ceará',abbr:'CE',postalPrefix:'60'},
      {name:'Goiás',abbr:'GO',postalPrefix:'74'},{name:'Distrito Federal',abbr:'DF',postalPrefix:'70'},
      {name:'Santa Catarina',abbr:'SC',postalPrefix:'88'},{name:'Amazonas',abbr:'AM',postalPrefix:'69'},
    ],
    postalFormat: (r) => { const p=COUNTRY_LOCALES.BR.regions.find(s=>s.abbr===r); return (p?p.postalPrefix:randomPick(['01','20','30','40','80','90']))+randomDigits(3)+'-'+randomDigits(3); },
    phoneFormat: () => randomPick([`+55 ${randomInt(11,99)} ${randomDigits(4)}-${randomDigits(4)}`,`+55 ${randomInt(11,99)} 9${randomDigits(4)}-${randomDigits(4)}`]),
    cities: ['São Paulo','Rio de Janeiro','Brasília','Salvador','Fortaleza','Belo Horizonte','Manaus','Curitiba','Recife','Goiânia','Belém','Porto Alegre','Guarulhos','Campinas','São Luís','Maceió','Campo Grande','Teresina','João Pessoa','Natal','Florianópolis','Santos','Vitória'],
    streetSuffixes: ['Rua','Avenida','Travessa','Alameda','Praça','Largo','Estrada','Rodovia'],
    addressFormat: 'br',
  },
  IN: {
    name: 'India', code: 'IN',
    regions: [
      {name:'Maharashtra',abbr:'MH',postalPrefix:'400'},{name:'Delhi',abbr:'DL',postalPrefix:'110'},
      {name:'Karnataka',abbr:'KA',postalPrefix:'560'},{name:'Tamil Nadu',abbr:'TN',postalPrefix:'600'},
      {name:'Telangana',abbr:'TG',postalPrefix:'500'},{name:'Gujarat',abbr:'GJ',postalPrefix:'380'},
      {name:'Uttar Pradesh',abbr:'UP',postalPrefix:'201'},{name:'West Bengal',abbr:'WB',postalPrefix:'700'},
      {name:'Rajasthan',abbr:'RJ',postalPrefix:'302'},{name:'Kerala',abbr:'KL',postalPrefix:'682'},
      {name:'Punjab',abbr:'PB',postalPrefix:'160'},{name:'Madhya Pradesh',abbr:'MP',postalPrefix:'462'},
    ],
    postalFormat: (r) => { const p=COUNTRY_LOCALES.IN.regions.find(s=>s.abbr===r); return (p?p.postalPrefix:randomPick(['400','110','560','600','500']))+randomDigits(3); },
    phoneFormat: () => randomPick([`+91 ${randomInt(70,99)}${randomDigits(2)} ${randomDigits(3)} ${randomDigits(3)}`,`+91 ${randomInt(70,99)}${randomDigits(8)}`]),
    cities: ['Mumbai','Delhi','Bangalore','Hyderabad','Ahmedabad','Chennai','Kolkata','Pune','Jaipur','Lucknow','Kanpur','Nagpur','Visakhapatnam','Indore','Thane','Bhopal','Patna','Vadodara','Surat','Coimbatore','Kochi','Chandigarh','Gurgaon','Noida'],
    streetSuffixes: ['Road','Street','Marg','Nagar','Colony','Layout','Extension','Block','Sector','Lane','Circle','Path'],
    addressFormat: 'us',
  },
  MX: {
    name: 'Mexico', code: 'MX',
    regions: [
      {name:'Ciudad de México',abbr:'CDMX',postalPrefix:'06'},{name:'Jalisco',abbr:'JAL',postalPrefix:'44'},
      {name:'Nuevo León',abbr:'NL',postalPrefix:'64'},{name:'Estado de México',abbr:'MEX',postalPrefix:'50'},
      {name:'Puebla',abbr:'PUE',postalPrefix:'72'},{name:'Guanajuato',abbr:'GTO',postalPrefix:'36'},
      {name:'Chihuahua',abbr:'CHH',postalPrefix:'31'},{name:'Veracruz',abbr:'VER',postalPrefix:'91'},
      {name:'Querétaro',abbr:'QRO',postalPrefix:'76'},{name:'Yucatán',abbr:'YUC',postalPrefix:'97'},
      {name:'Baja California',abbr:'BC',postalPrefix:'22'},{name:'Sonora',abbr:'SON',postalPrefix:'83'},
    ],
    postalFormat: (r) => { const p=COUNTRY_LOCALES.MX.regions.find(s=>s.abbr===r); return (p?p.postalPrefix:randomPick(['06','44','64','50','72']))+randomDigits(3); },
    phoneFormat: () => randomPick([`+52 ${randomInt(55,99)} ${randomDigits(4)} ${randomDigits(4)}`,`+52 1 ${randomInt(55,99)} ${randomDigits(4)} ${randomDigits(4)}`]),
    cities: ['Ciudad de México','Guadalajara','Monterrey','Puebla','Tijuana','León','Juárez','Zapopan','Mérida','San Luis Potosí','Aguascalientes','Hermosillo','Saltillo','Mexicali','Querétaro','Culiacán','Chihuahua','Morelia','Cancún','Veracruz','Acapulco','Oaxaca'],
    streetSuffixes: ['Calle','Avenida','Boulevard','Calzada','Paseo','Camino','Privada','Circuito','Andador'],
    addressFormat: 'eu',
  },
  IT: {
    name: 'Italy', code: 'IT',
    regions: [
      {name:'Lombardia',abbr:'LOM',postalPrefix:'20'},{name:'Lazio',abbr:'LAZ',postalPrefix:'00'},
      {name:'Campania',abbr:'CAM',postalPrefix:'80'},{name:'Veneto',abbr:'VEN',postalPrefix:'30'},
      {name:'Emilia-Romagna',abbr:'EMR',postalPrefix:'40'},{name:'Piemonte',abbr:'PIE',postalPrefix:'10'},
      {name:'Sicilia',abbr:'SIC',postalPrefix:'90'},{name:'Toscana',abbr:'TOS',postalPrefix:'50'},
    ],
    postalFormat: (r) => { const p=COUNTRY_LOCALES.IT.regions.find(s=>s.abbr===r); return (p?p.postalPrefix:randomPick(['20','00','80','50']))+randomDigits(3); },
    phoneFormat: () => randomPick([`+39 0${randomInt(2,6)} ${randomDigits(4)} ${randomDigits(4)}`,`+39 3${randomDigits(2)} ${randomDigits(3)} ${randomDigits(4)}`]),
    cities: ['Roma','Milano','Napoli','Torino','Palermo','Genova','Bologna','Firenze','Bari','Catania','Venezia','Verona','Padova','Trieste','Brescia','Parma','Modena','Perugia','Cagliari','Bergamo'],
    streetSuffixes: ['Via','Viale','Corso','Piazza','Largo','Vicolo','Strada','Piazzale'],
    addressFormat: 'eu',
  },
  ES: {
    name: 'Spain', code: 'ES',
    regions: [
      {name:'Madrid',abbr:'MAD',postalPrefix:'28'},{name:'Cataluña',abbr:'CAT',postalPrefix:'08'},
      {name:'Andalucía',abbr:'AND',postalPrefix:'41'},{name:'Comunidad Valenciana',abbr:'VAL',postalPrefix:'46'},
      {name:'País Vasco',abbr:'PV',postalPrefix:'48'},{name:'Galicia',abbr:'GAL',postalPrefix:'15'},
      {name:'Castilla y León',abbr:'CYL',postalPrefix:'47'},{name:'Canarias',abbr:'CAN',postalPrefix:'35'},
    ],
    postalFormat: (r) => { const p=COUNTRY_LOCALES.ES.regions.find(s=>s.abbr===r); return (p?p.postalPrefix:randomPick(['28','08','41','46']))+randomDigits(3); },
    phoneFormat: () => randomPick([`+34 ${randomInt(6,7)}${randomDigits(2)} ${randomDigits(3)} ${randomDigits(3)}`,`+34 9${randomInt(1,9)} ${randomDigits(3)} ${randomDigits(2)} ${randomDigits(2)}`]),
    cities: ['Madrid','Barcelona','Valencia','Sevilla','Zaragoza','Málaga','Murcia','Palma','Las Palmas','Bilbao','Alicante','Córdoba','Valladolid','Vigo','Gijón','Hospitalet','Vitoria-Gasteiz','Granada','A Coruña','Elche','Oviedo','Santander','San Sebastián'],
    streetSuffixes: ['Calle','Avenida','Paseo','Plaza','Camino','Carrera','Travesía','Ronda','Vía'],
    addressFormat: 'eu',
  },
  NL: {
    name: 'Netherlands', code: 'NL',
    regions: [
      {name:'Noord-Holland',abbr:'NH',postalPrefix:'10'},{name:'Zuid-Holland',abbr:'ZH',postalPrefix:'25'},
      {name:'Utrecht',abbr:'UT',postalPrefix:'35'},{name:'Noord-Brabant',abbr:'NB',postalPrefix:'50'},
      {name:'Gelderland',abbr:'GE',postalPrefix:'68'},{name:'Limburg',abbr:'LI',postalPrefix:'62'},
    ],
    postalFormat: () => randomDigits(4)+' '+randomPick('ABCDEFGHJKLMNPRSTUVWXYZ'.split(''))+randomPick('ABCDEFGHJKLMNPRSTUVWXYZ'.split('')),
    phoneFormat: () => randomPick([`+31 ${randomInt(10,70)} ${randomDigits(3)} ${randomDigits(4)}`,`+31 6 ${randomDigits(4)} ${randomDigits(4)}`]),
    cities: ['Amsterdam','Rotterdam','Den Haag','Utrecht','Eindhoven','Groningen','Tilburg','Almere','Breda','Nijmegen','Apeldoorn','Haarlem','Arnhem','Enschede','Amersfoort','Zaanstad','Maastricht','Leiden','Dordrecht','Zoetermeer'],
    streetSuffixes: ['straat','weg','laan','gracht','plein','kade','singel','steeg','dijk','pad'],
    addressFormat: 'eu',
  },
  KR: {
    name: 'South Korea', code: 'KR',
    regions: [
      {name:'Seoul',abbr:'서울',postalPrefix:'06'},{name:'Busan',abbr:'부산',postalPrefix:'48'},
      {name:'Incheon',abbr:'인천',postalPrefix:'21'},{name:'Daegu',abbr:'대구',postalPrefix:'41'},
      {name:'Daejeon',abbr:'대전',postalPrefix:'34'},{name:'Gwangju',abbr:'광주',postalPrefix:'61'},
      {name:'Gyeonggi',abbr:'경기',postalPrefix:'10'},{name:'Jeju',abbr:'제주',postalPrefix:'63'},
    ],
    postalFormat: (r) => { const p=COUNTRY_LOCALES.KR.regions.find(s=>s.name===r||s.abbr===r); return (p?p.postalPrefix:randomPick(['06','48','21','10']))+randomDigits(3); },
    phoneFormat: () => randomPick([`+82 ${randomInt(2,51)}-${randomDigits(4)}-${randomDigits(4)}`,`+82 10-${randomDigits(4)}-${randomDigits(4)}`]),
    cities: ['Seoul','Busan','Incheon','Daegu','Daejeon','Gwangju','Ulsan','Suwon','Changwon','Goyang','Yongin','Seongnam','Cheongju','Bucheon','Ansan','Jeonju','Cheonan','Anyang','Gimhae','Pohang'],
    streetSuffixes: ['로','길','대로','거리'],
    addressFormat: 'eu',
  },
  SE: {
    name: 'Sweden', code: 'SE',
    regions: [
      {name:'Stockholm',abbr:'AB',postalPrefix:'11'},{name:'Västra Götaland',abbr:'O',postalPrefix:'41'},
      {name:'Skåne',abbr:'M',postalPrefix:'21'},{name:'Uppsala',abbr:'C',postalPrefix:'75'},
      {name:'Östergötland',abbr:'E',postalPrefix:'58'},{name:'Norrbotten',abbr:'BD',postalPrefix:'97'},
    ],
    postalFormat: (r) => { const p=COUNTRY_LOCALES.SE.regions.find(s=>s.abbr===r); return (p?p.postalPrefix:randomPick(['11','41','21','75']))+randomDigits(1)+' '+randomDigits(2); },
    phoneFormat: () => randomPick([`+46 ${randomInt(8,70)} ${randomDigits(3)} ${randomDigits(2)} ${randomDigits(2)}`,`0${randomInt(8,70)}-${randomDigits(3)} ${randomDigits(2)} ${randomDigits(2)}`]),
    cities: ['Stockholm','Göteborg','Malmö','Uppsala','Linköping','Västerås','Örebro','Helsingborg','Norrköping','Jönköping','Umeå','Lund','Borås','Sundsvall','Gävle','Karlstad'],
    streetSuffixes: ['gatan','vägen','stigen','torget','platsen','allén','backen','gränd','leden'],
    addressFormat: 'eu',
  },
  CH: {
    name: 'Switzerland', code: 'CH',
    regions: [
      {name:'Zürich',abbr:'ZH',postalPrefix:'80'},{name:'Bern',abbr:'BE',postalPrefix:'30'},
      {name:'Genève',abbr:'GE',postalPrefix:'12'},{name:'Basel-Stadt',abbr:'BS',postalPrefix:'40'},
      {name:'Vaud',abbr:'VD',postalPrefix:'10'},{name:'Luzern',abbr:'LU',postalPrefix:'60'},
    ],
    postalFormat: () => randomPick(['10','12','15','20','30','40','50','60','80','90'])+randomDigits(2),
    phoneFormat: () => randomPick([`+41 ${randomInt(21,79)} ${randomDigits(3)} ${randomDigits(2)} ${randomDigits(2)}`]),
    cities: ['Zürich','Genève','Basel','Lausanne','Bern','Winterthur','Luzern','St. Gallen','Lugano','Biel','Thun','Köniz','La Chaux-de-Fonds','Fribourg','Schaffhausen'],
    streetSuffixes: ['Strasse','Weg','Gasse','Platz','Allee','Ring'],
    addressFormat: 'eu',
  },
  NO: {
    name: 'Norway', code: 'NO',
    regions: [
      {name:'Oslo',abbr:'OSL',postalPrefix:'0'},{name:'Bergen',abbr:'HOR',postalPrefix:'5'},
      {name:'Trondheim',abbr:'TRD',postalPrefix:'7'},{name:'Stavanger',abbr:'ROG',postalPrefix:'4'},
      {name:'Tromsø',abbr:'TRM',postalPrefix:'9'},
    ],
    postalFormat: () => randomDigits(4),
    phoneFormat: () => randomPick([`+47 ${randomDigits(2)} ${randomDigits(2)} ${randomDigits(2)} ${randomDigits(2)}`,`+47 4${randomDigits(1)} ${randomDigits(2)} ${randomDigits(2)} ${randomDigits(2)}`]),
    cities: ['Oslo','Bergen','Trondheim','Stavanger','Drammen','Fredrikstad','Kristiansand','Sandnes','Tromsø','Sarpsborg','Skien','Ålesund','Sandefjord','Haugesund','Tønsberg','Moss','Bodø'],
    streetSuffixes: ['gata','veien','vegen','torget','plass','allé','bakken','stien','lia'],
    addressFormat: 'eu',
  },
  SG: {
    name: 'Singapore', code: 'SG',
    regions: [
      {name:'Central',abbr:'CEN',postalPrefix:'01'},{name:'East',abbr:'EAST',postalPrefix:'42'},
      {name:'North',abbr:'NTH',postalPrefix:'72'},{name:'North-East',abbr:'NE',postalPrefix:'53'},
      {name:'West',abbr:'WST',postalPrefix:'60'},
    ],
    postalFormat: () => randomDigits(6),
    phoneFormat: () => randomPick([`+65 ${randomInt(6,9)}${randomDigits(3)} ${randomDigits(4)}`,`+65 8${randomDigits(3)} ${randomDigits(4)}`]),
    cities: ['Singapore','Jurong East','Tampines','Woodlands','Ang Mo Kio','Bedok','Clementi','Toa Payoh','Hougang','Yishun','Bukit Batok','Choa Chu Kang','Sengkang','Punggol','Pasir Ris'],
    streetSuffixes: ['Road','Street','Avenue','Drive','Lane','Way','Crescent','Boulevard','Place','Walk','Link','Close','Terrace'],
    addressFormat: 'us',
  },
  NZ: {
    name: 'New Zealand', code: 'NZ',
    regions: [
      {name:'Auckland',abbr:'AUK',postalPrefix:'10'},{name:'Wellington',abbr:'WGN',postalPrefix:'60'},
      {name:'Canterbury',abbr:'CAN',postalPrefix:'80'},{name:'Otago',abbr:'OTA',postalPrefix:'90'},
      {name:'Waikato',abbr:'WKO',postalPrefix:'32'},{name:'Bay of Plenty',abbr:'BOP',postalPrefix:'31'},
    ],
    postalFormat: () => randomDigits(4),
    phoneFormat: () => randomPick([`+64 ${randomInt(3,9)} ${randomDigits(3)} ${randomDigits(4)}`,`+64 21 ${randomDigits(3)} ${randomDigits(4)}`]),
    cities: ['Auckland','Wellington','Christchurch','Hamilton','Tauranga','Napier-Hastings','Dunedin','Palmerston North','Nelson','Rotorua','New Plymouth','Whangarei','Invercargill','Whanganui','Gisborne'],
    streetSuffixes: ['Street','Road','Avenue','Drive','Place','Crescent','Way','Terrace','Lane','Close'],
    addressFormat: 'us',
  },
  IE: {
    name: 'Ireland', code: 'IE',
    regions: [
      {name:'Dublin',abbr:'D',postalPrefix:'D0'},{name:'Cork',abbr:'CO',postalPrefix:'T12'},
      {name:'Galway',abbr:'G',postalPrefix:'H91'},{name:'Limerick',abbr:'LK',postalPrefix:'V94'},
      {name:'Waterford',abbr:'WD',postalPrefix:'X91'},{name:'Kilkenny',abbr:'KK',postalPrefix:'R95'},
    ],
    postalFormat: () => randomPick(['D','T','H','V','X','R','A','F','N','P','E','K','W','Y'])+randomDigits(2)+' '+randomPick('ABCDEFGHJKLMNPRSTUVWXYZ'.split(''))+randomPick('ABCDEFGHJKLMNPRSTUVWXYZ'.split(''))+randomDigits(2),
    phoneFormat: () => randomPick([`+353 ${randomInt(1,86)} ${randomDigits(3)} ${randomDigits(4)}`,`+353 8${randomInt(3,9)} ${randomDigits(3)} ${randomDigits(4)}`]),
    cities: ['Dublin','Cork','Galway','Limerick','Waterford','Drogheda','Dundalk','Swords','Bray','Navan','Ennis','Killarney','Tralee','Kilkenny','Athlone','Sligo','Letterkenny','Wexford','Carlow','Clonmel'],
    streetSuffixes: ['Street','Road','Avenue','Drive','Lane','Way','Close','Crescent','Park','Place','Terrace','Court','Green','Square'],
    addressFormat: 'uk',
  },
};

// ============== GENERATORS ==============

function generateFirstName(gender) {
  if (gender === 'male') return randomPick(MALE_FIRST_NAMES);
  if (gender === 'female') return randomPick(FEMALE_FIRST_NAMES);
  return Math.random() > 0.5 ? randomPick(MALE_FIRST_NAMES) : randomPick(FEMALE_FIRST_NAMES);
}

function generateStreetAddress(locale) {
  const num = randomInt(1, 9999).toString();
  const name = Math.random() > 0.5 ? randomPick(MALE_FIRST_NAMES) : randomPick(LAST_NAMES);
  const suffix = randomPick(locale.streetSuffixes);

  switch (locale.addressFormat) {
    case 'eu': return `${suffix} ${name} ${num}`;
    case 'jp': return `${randomInt(1,30)}-${randomInt(1,20)}-${randomInt(1,15)}`;
    case 'br': return `${suffix} ${name}, ${num}`;
    default: return `${num} ${name} ${suffix}`;
  }
}

function generateEmail(firstName, lastName) {
  const fn = firstName.toLowerCase().replace(/[^a-z]/g, '');
  const ln = lastName.toLowerCase().replace(/[^a-z]/g, '');
  const patterns = [`${fn}.${ln}`,`${fn}${ln}`,`${fn}.${ln}${randomInt(1,99)}`,`${fn[0]}${ln}`,`${fn}_${ln}`];
  return `${randomPick(patterns)}@${randomPick(EMAIL_DOMAINS)}`;
}

function generateAddresses({ quantity = 1, country = 'US', stateAbbr, gender = 'random', includePhone = true, includeEmail = true, includeSSN = true, includeDOB = true }) {
  const locale = COUNTRY_LOCALES[country] || COUNTRY_LOCALES.US;
  const addresses = [];

  for (let i = 0; i < quantity; i++) {
    const g = gender === 'random' ? undefined : gender;
    const firstName = generateFirstName(g);
    const lastName = randomPick(LAST_NAMES);
    const fullName = `${firstName} ${lastName}`;

    let region;
    if (stateAbbr) {
      region = locale.regions.find(s => s.abbr === stateAbbr) || randomPick(locale.regions);
    } else {
      region = randomPick(locale.regions);
    }

    const streetAddress = generateStreetAddress(locale);
    const secondaryAddress = Math.random() > 0.7 ? `Apt. ${randomInt(1, 999)}` : '';
    const city = randomPick(locale.cities);
    const zipCode = locale.postalFormat(region.abbr);

    let fullAddress;
    switch (locale.addressFormat) {
      case 'eu':
        fullAddress = `${streetAddress}, ${zipCode} ${city}, ${region.name}`;
        break;
      case 'uk':
        fullAddress = `${streetAddress}, ${city}, ${region.name}, ${zipCode}`;
        break;
      case 'jp':
        fullAddress = `${zipCode} ${region.name} ${city} ${streetAddress}`;
        break;
      case 'br':
        fullAddress = `${streetAddress} - ${city}, ${region.abbr}, ${zipCode}`;
        break;
      default:
        fullAddress = secondaryAddress
          ? `${secondaryAddress} ${streetAddress}, ${city}, ${region.abbr} ${zipCode}`
          : `${streetAddress}, ${city}, ${region.abbr} ${zipCode}`;
    }

    let dob = '';
    if (includeDOB) {
      const y = new Date().getFullYear() - randomInt(18, 80);
      dob = `${String(randomInt(1,12)).padStart(2,'0')}/${String(randomInt(1,28)).padStart(2,'0')}/${y}`;
    }

    addresses.push({
      firstName, lastName, fullName, streetAddress,
      secondaryAddress: secondaryAddress, city,
      state: region.name, stateAbbr: region.abbr, zipCode,
      country: locale.name, countryCode: locale.code,
      phone: includePhone ? locale.phoneFormat() : '',
      email: includeEmail ? generateEmail(firstName, lastName) : '',
      ssnLast4: includeSSN ? randomDigits(4) : '',
      dob, fullAddress,
    });
  }
  return addresses;
}
