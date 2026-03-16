// GenAddress API - Serverless function for Vercel
// Also used in server.js for local/Ubuntu deployment

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

// ============== ADDRESS GENERATOR (self-contained for serverless) ==============

const MALE_FIRST_NAMES = [
  'Aaron','Abdul','Abraham','Adam','Adrian','Ahmad','Al','Alan','Albert','Alberto',
  'Alex','Alexander','Alfonso','Alfred','Alfredo','Ali','Allan','Allen','Alonso',
  'Alvaro','Alvin','Ambrose','Anderson','Andre','Andres','Andrew','Andy','Angel',
  'Angelo','Anthony','Antoine','Antonio','Archie','Armando','Arnold','Arthur','Arturo',
  'Austin','Avery','Barry','Ben','Benjamin','Bennett','Bernard','Bill','Billy','Blake',
  'Bob','Bobby','Boris','Brad','Bradley','Brandon','Brent','Brett','Brian','Bruce',
  'Bruno','Bryan','Bryant','Byron','Caleb','Calvin','Cameron','Carl','Carlos','Carlton',
  'Carmen','Carroll','Carson','Carter','Casey','Cecil','Cesar','Chad','Charles','Charlie',
  'Chase','Chester','Chris','Christian','Christopher','Chuck','Clarence','Clark','Claude',
  'Clay','Clayton','Cleveland','Cliff','Clifford','Clinton','Clyde','Cody','Cole','Colin',
  'Colton','Conrad','Corey','Craig','Curtis','Cyrus','Dale','Dallas','Dalton','Damian',
  'Damon','Dan','Daniel','Danny','Dante','Darius','Darrell','Darren','Darryl','Darwin',
  'Dave','David','Dean','Dennis','Denver','Derek','Derrick','Desmond','Devin','Diego',
  'Dillon','Dominic','Dominick','Don','Donald','Donovan','Douglas','Drew','Duane','Duncan',
  'Dustin','Dwight','Dylan','Earl','Eddie','Edgar','Eduardo','Edward','Edwin','Eli','Elijah',
  'Elliott','Ellis','Elton','Emanuel','Emilio','Emmanuel','Emmett','Enrique','Eric','Erik',
  'Ernest','Ernesto','Ethan','Eugene','Evan','Everett','Ezekiel','Ezra','Fabian','Felipe',
  'Felix','Fernando','Floyd','Francis','Francisco','Frank','Franklin','Fred','Frederick',
  'Gabriel','Garrett','Gary','Gavin','Gene','George','Gerald','Gerard','Gilbert','Glen',
  'Glenn','Gordon','Graham','Grant','Greg','Gregory','Guillermo','Gustavo','Guy','Harold',
  'Harrison','Harry','Harvey','Hayden','Heath','Hector','Henry','Herbert','Herman','Homer',
  'Howard','Hubert','Hugh','Hugo','Hunter','Ian','Ignacio','Isaac','Isaiah','Ivan','Jack',
  'Jackson','Jacob','Jacques','Jaime','Jake','Jamal','James','Jamie','Jared','Jarrod',
  'Jason','Jasper','Javier','Jay','Jeff','Jeffrey','Jeremiah','Jeremy','Jerome','Jerry',
  'Jesse','Jesus','Jim','Jimmy','Joaquin','Joe','Joel','Joey','John','Johnny','Jon','Jonah',
  'Jonathan','Jordan','Jorge','Jose','Joseph','Josh','Joshua','Juan','Julian','Julio',
  'Julius','Justin','Karl','Keith','Kelly','Kelvin','Ken','Kenneth','Kenny','Kent','Kerry',
  'Kevin','Kirk','Kurt','Kyle','Lance','Larry','Lawrence','Lee','Leo','Leon','Leonard',
  'Leonardo','Leroy','Leslie','Lester','Levi','Lewis','Lincoln','Lionel','Lloyd','Logan',
  'Lorenzo','Louis','Lucas','Luis','Luke','Luther','Malcolm','Manuel','Marc','Marco',
  'Marcos','Marcus','Mario','Mark','Marshall','Martin','Marvin','Mason','Matt','Matthew',
  'Maurice','Max','Maxwell','Melvin','Michael','Miguel','Mike','Miles','Milton','Mitchell',
  'Mohamed','Morgan','Morris','Moses','Nathan','Nathaniel','Neal','Neil','Nelson','Nicholas',
  'Nick','Nicolas','Noah','Noel','Norman','Oliver','Omar','Orlando','Oscar','Otto','Owen',
  'Pablo','Parker','Patrick','Paul','Pedro','Perry','Pete','Peter','Phil','Philip','Phillip',
  'Preston','Quentin','Rafael','Ralph','Ramon','Randall','Randy','Raphael','Raul','Ray',
  'Raymond','Reginald','Rene','Rex','Ricardo','Richard','Rick','Ricky','Riley','Rob',
  'Robert','Roberto','Robin','Rod','Rodney','Rodrigo','Roger','Roland','Roman','Ron','Ronald',
  'Ronnie','Ross','Roy','Ruben','Rudy','Russell','Ryan','Salvador','Sam','Samuel','Santiago',
  'Santos','Scott','Sean','Sergio','Seth','Shane','Shaun','Shawn','Sidney','Simon','Solomon',
  'Spencer','Stanley','Stefan','Stephen','Steve','Steven','Stewart','Stuart','Taylor','Ted',
  'Terence','Terry','Theodore','Thomas','Tim','Timothy','Todd','Tom','Tommy','Tony','Tracy',
  'Travis','Trevor','Troy','Tyler','Tyrone','Van','Vernon','Victor','Vincent','Virgil',
  'Wade','Wallace','Walter','Warren','Wayne','Wesley','Whitney','Will','William','Willie',
  'Wilson','Winston','Xavier','Zachary',
];

const FEMALE_FIRST_NAMES = [
  'Abigail','Ada','Adeline','Adriana','Agnes','Aimee','Alana','Alexa','Alexandra','Alexis',
  'Alice','Alicia','Alison','Allison','Alma','Alyssa','Amanda','Amber','Amelia','Amy','Ana',
  'Andrea','Angela','Angelica','Angelina','Anita','Ann','Anna','Annette','Annie','April',
  'Ariana','Arlene','Ashley','Audrey','Aurora','Autumn','Ava','Barbara','Beatrice','Becky',
  'Belinda','Bernice','Beth','Bethany','Betty','Beverly','Bianca','Blair','Bonnie','Brandi',
  'Brandy','Brenda','Bridget','Brittany','Brooke','Caitlin','Camille','Candace','Cara',
  'Carla','Carmen','Carol','Caroline','Carolyn','Carrie','Casey','Cassandra','Catherine',
  'Cathy','Cecilia','Celeste','Charlene','Charlotte','Chelsea','Cheryl','Chloe','Christina',
  'Christine','Cindy','Claire','Clara','Claudia','Colleen','Connie','Constance','Courtney',
  'Crystal','Cynthia','Daisy','Dana','Danielle','Darlene','Dawn','Deanna','Debbie','Deborah',
  'Debra','Denise','Diana','Diane','Dolores','Donna','Dora','Doris','Dorothy','Edith',
  'Eileen','Elaine','Eleanor','Elena','Elizabeth','Ella','Ellen','Emily','Emma','Erica',
  'Erin','Esther','Eva','Evelyn','Faith','Faye','Felicia','Florence','Frances','Francesca',
  'Gabriela','Gail','Genevieve','Georgia','Geraldine','Gina','Gladys','Gloria','Grace',
  'Gretchen','Gwendolyn','Haley','Hannah','Harriet','Hazel','Heather','Heidi','Helen',
  'Helena','Hilary','Holly','Hope','Ida','Irene','Iris','Isabel','Isabella','Ivy','Jackie',
  'Jacqueline','Jade','Jamie','Jan','Jane','Janet','Janice','Jasmine','Jean','Jenna',
  'Jennifer','Jenny','Jessica','Jessie','Jill','Joan','Joanna','Joanne','Jocelyn','Josephine',
  'Joy','Joyce','Judith','Judy','Julia','Julie','June','Karen','Karla','Kate','Katherine',
  'Kathleen','Kathryn','Kathy','Katie','Katrina','Kay','Kayla','Kelly','Kelsey','Kendra',
  'Kerry','Kim','Kimberly','Kristen','Kristin','Kristina','Krystal','Laura','Lauren','Laurie',
  'Leah','Leigh','Lena','Leslie','Leticia','Lillian','Lily','Linda','Lindsay','Lisa','Lois',
  'Lola','Loretta','Lori','Lorraine','Louise','Lucia','Lucy','Lydia','Lynn','Mabel','Madeline',
  'Madison','Maggie','Mandy','Margaret','Margarita','Maria','Marian','Marie','Marilyn',
  'Marina','Marjorie','Marlene','Marsha','Martha','Mary','Maureen','Megan','Melanie','Melinda',
  'Melissa','Mercedes','Meredith','Michelle','Mildred','Miranda','Miriam','Molly','Monica',
  'Monique','Morgan','Muriel','Nancy','Naomi','Natalie','Natasha','Nellie','Nicole','Nina',
  'Nora','Norma','Olivia','Opal','Pam','Pamela','Patricia','Patsy','Patti','Paula','Pauline',
  'Pearl','Peggy','Penny','Phyllis','Priscilla','Rachel','Ramona','Rebecca','Regina','Renee',
  'Rhonda','Rita','Roberta','Robin','Rosa','Rose','Rosemary','Ruby','Ruth','Sabrina','Sally',
  'Samantha','Sandra','Sara','Sarah','Savannah','Shannon','Sharon','Sheila','Shelby','Shelly',
  'Sherry','Shirley','Sierra','Simone','Sofia','Sonia','Sophia','Sophie','Stacey','Stacy',
  'Stella','Stephanie','Sue','Susan','Susanne','Suzanne','Sylvia','Tabitha','Tamara','Tammy',
  'Tanya','Tara','Teresa','Terri','Terry','Theresa','Tiffany','Tina','Toni','Tonya','Tracey',
  'Tracy','Ursula','Valerie','Vanessa','Vera','Veronica','Vicki','Victoria','Viola','Violet',
  'Virginia','Vivian','Wanda','Wendy','Wilma','Yolanda','Yvette','Yvonne',
];

const LAST_NAMES = [
  'Abbott','Acosta','Adams','Aguilar','Alexander','Allen','Allison','Alvarez','Anderson',
  'Andrews','Armstrong','Arnold','Ashley','Atkins','Austin','Avery','Ayala','Bailey','Baker',
  'Baldwin','Banks','Barber','Barnes','Barnett','Barrett','Barry','Barton','Bass','Bates',
  'Bauer','Beck','Bell','Bennett','Benson','Berg','Berry','Bishop','Black','Blair','Blake',
  'Bolton','Bond','Booker','Boone','Booth','Bowen','Boyd','Boyer','Boyle','Bradford','Bradley',
  'Brady','Branch','Brennan','Brewer','Bridges','Briggs','Brock','Brooks','Brown','Bruce',
  'Bryan','Bryant','Buchanan','Buck','Buckley','Bullock','Burgess','Burke','Burns','Burton',
  'Bush','Butler','Byrd','Cain','Caldwell','Callahan','Cameron','Campbell','Cannon','Carlson',
  'Carpenter','Carr','Carroll','Carson','Carter','Casey','Castillo','Castro','Chambers','Chan',
  'Chandler','Chang','Chapman','Chase','Chen','Christensen','Clark','Clay','Clayton','Cline',
  'Cobb','Cohen','Cole','Coleman','Collins','Combs','Cook','Cooper','Copeland','Cortez','Cox',
  'Craig','Crawford','Cross','Cruz','Cummings','Cunningham','Curtis','Dale','Daniel','Daniels',
  'Davidson','Davis','Dawson','Day','Dean','Dennis','Diaz','Dixon','Donaldson','Douglas',
  'Drake','Dudley','Duncan','Dunn','Durham','Edwards','Elliott','Ellis','English','Erickson',
  'Espinoza','Evans','Farmer','Ferguson','Fernandez','Fields','Fischer','Fisher','Fitzgerald',
  'Fleming','Fletcher','Flores','Floyd','Flynn','Ford','Foster','Fowler','Fox','Francis',
  'Frank','Franklin','Frazier','Freeman','French','Frost','Fuller','Gallagher','Garcia',
  'Gardner','Garner','Garrett','Garrison','Gates','George','Gibson','Gilbert','Gill','Glenn',
  'Glover','Gomez','Gonzalez','Goodman','Gordon','Graham','Grant','Graves','Gray','Green',
  'Greene','Gregory','Griffin','Griffith','Gross','Guerrero','Gutierrez','Guzman','Hale','Hall',
  'Hamilton','Hammond','Hampton','Hansen','Hanson','Hardy','Harmon','Harper','Harris','Harrison',
  'Hart','Harvey','Hawkins','Hayes','Heath','Henderson','Henry','Hernandez','Herrera','Hicks',
  'Higgins','Hill','Hines','Hodges','Hoffman','Hogan','Holland','Holloway','Holmes','Holt',
  'Hood','Hopkins','Horn','Houston','Howard','Howell','Hubbard','Hudson','Hughes','Hunt',
  'Hunter','Hyde','Ingram','Jackson','Jacobs','James','Jefferson','Jenkins','Jennings','Jensen',
  'Jimenez','Johnson','Johnston','Jones','Jordan','Joseph','Kane','Keith','Keller','Kelley',
  'Kelly','Kennedy','Kent','Kim','King','Kirk','Klein','Knight','Knox','Kramer','Lambert',
  'Lane','Lang','Lara','Larson','Lawrence','Lawson','Lee','Leonard','Lester','Levy','Lewis',
  'Little','Lloyd','Logan','Long','Lopez','Lowe','Lucas','Luna','Lynch','Lyons','Malone',
  'Manning','Marks','Marsh','Marshall','Martin','Martinez','Mason','Massey','Matthews',
  'Maxwell','May','McCarthy','McCoy','McDonald','McGee','McGuire','McKenzie','McLaughlin',
  'McMillan','Meadows','Medina','Mendez','Mendoza','Mercer','Meyers','Miles','Miller','Mills',
  'Miranda','Mitchell','Molina','Monroe','Montgomery','Moore','Morales','Moran','Morgan',
  'Morris','Morrison','Morse','Moss','Mullins','Murphy','Murray','Myers','Nash','Navarro',
  'Neal','Nelson','Newman','Newton','Nguyen','Nichols','Nixon','Nolan','Norman','Norris',
  'Norton','Oliver','Olsen','Olson','Oneill','Ortega','Ortiz','Osborne','Owen','Owens',
  'Pace','Padilla','Page','Palmer','Park','Parker','Parks','Parsons','Patel','Patrick',
  'Patterson','Patton','Paul','Payne','Pearson','Pena','Perez','Perkins','Perry','Peters',
  'Peterson','Phelps','Phillips','Pierce','Pope','Porter','Potter','Powell','Powers','Price',
  'Pruitt','Quinn','Ramirez','Ramos','Ramsey','Randall','Ray','Reed','Reese','Reeves','Reid',
  'Reyes','Reynolds','Rhodes','Rice','Richards','Richardson','Riley','Rios','Rivera','Robbins',
  'Roberts','Robertson','Robinson','Rodgers','Rodriguez','Rogers','Roman','Romero','Rose',
  'Ross','Roth','Rowe','Roy','Ruiz','Rush','Russell','Ryan','Salazar','Sanchez','Sanders',
  'Sandoval','Santiago','Santos','Saunders','Savage','Sawyer','Schmidt','Schneider','Schultz',
  'Schwartz','Scott','Shannon','Sharp','Shaw','Shelton','Shepherd','Sherman','Silva','Simmons',
  'Simon','Simpson','Sims','Singh','Singleton','Smith','Snyder','Solomon','Soto','Spencer',
  'Stanley','Stark','Steele','Stephens','Stevens','Stevenson','Stewart','Stokes','Stone',
  'Strickland','Stuart','Sullivan','Summers','Sutton','Swanson','Tanner','Tate','Taylor',
  'Terry','Thomas','Thompson','Thornton','Todd','Torres','Townsend','Tran','Travis','Tucker',
  'Turner','Tyler','Valdez','Vargas','Vasquez','Vaughn','Vega','Vincent','Wade','Wagner',
  'Walker','Wallace','Walsh','Walters','Walton','Ward','Warner','Warren','Washington','Waters',
  'Watkins','Watson','Watts','Weaver','Webb','Weber','Webster','Wells','West','Wheeler',
  'White','Whitney','Wiggins','Wilcox','Wiley','Wilkins','Williams','Williamson','Willis',
  'Wilson','Wolf','Wolfe','Wong','Wood','Woods','Wright','Wyatt','Yates','Young','Zimmerman',
];

const STREET_SUFFIXES = [
  'Avenue','Boulevard','Circle','Court','Cove','Creek','Crossing','Drive','Estate',
  'Expressway','Fork','Freeway','Garden','Glen','Green','Grove','Harbor','Haven','Heights',
  'Highway','Hill','Hills','Hollow','Junction','Key','Knoll','Lake','Landing','Lane','Light',
  'Loop','Manor','Meadow','Mill','Mission','Mount','Parkway','Pass','Path','Pike','Pine',
  'Place','Plaza','Point','Port','Ranch','Ridge','River','Road','Route','Run','Shore',
  'Spring','Square','Station','Street','Summit','Terrace','Trail','Turnpike','Valley',
  'Via','View','Vista','Walk','Way',
];

const CITY_PREFIXES = ['North','East','West','South','New','Lake','Port'];
const CITY_SUFFIXES = ['town','ton','land','ville','berg','burgh','borough','bury','view','port','mouth','chester','fort','haven','side','shire'];

const US_STATES = [
  { name: 'Alabama', abbr: 'AL', zip: '350' }, { name: 'Alaska', abbr: 'AK', zip: '995' },
  { name: 'Arizona', abbr: 'AZ', zip: '850' }, { name: 'Arkansas', abbr: 'AR', zip: '717' },
  { name: 'California', abbr: 'CA', zip: '900' }, { name: 'Colorado', abbr: 'CO', zip: '800' },
  { name: 'Connecticut', abbr: 'CT', zip: '061' }, { name: 'Delaware', abbr: 'DE', zip: '198' },
  { name: 'Florida', abbr: 'FL', zip: '322' }, { name: 'Georgia', abbr: 'GA', zip: '301' },
  { name: 'Hawaii', abbr: 'HI', zip: '967' }, { name: 'Idaho', abbr: 'ID', zip: '832' },
  { name: 'Illinois', abbr: 'IL', zip: '600' }, { name: 'Indiana', abbr: 'IN', zip: '463' },
  { name: 'Iowa', abbr: 'IA', zip: '510' }, { name: 'Kansas', abbr: 'KS', zip: '666' },
  { name: 'Kentucky', abbr: 'KY', zip: '404' }, { name: 'Louisiana', abbr: 'LA', zip: '701' },
  { name: 'Maine', abbr: 'ME', zip: '042' }, { name: 'Maryland', abbr: 'MD', zip: '210' },
  { name: 'Massachusetts', abbr: 'MA', zip: '026' }, { name: 'Michigan', abbr: 'MI', zip: '480' },
  { name: 'Minnesota', abbr: 'MN', zip: '555' }, { name: 'Mississippi', abbr: 'MS', zip: '387' },
  { name: 'Missouri', abbr: 'MO', zip: '650' }, { name: 'Montana', abbr: 'MT', zip: '590' },
  { name: 'Nebraska', abbr: 'NE', zip: '688' }, { name: 'Nevada', abbr: 'NV', zip: '898' },
  { name: 'New Hampshire', abbr: 'NH', zip: '036' }, { name: 'New Jersey', abbr: 'NJ', zip: '076' },
  { name: 'New Mexico', abbr: 'NM', zip: '880' }, { name: 'New York', abbr: 'NY', zip: '122' },
  { name: 'North Carolina', abbr: 'NC', zip: '288' }, { name: 'North Dakota', abbr: 'ND', zip: '586' },
  { name: 'Ohio', abbr: 'OH', zip: '444' }, { name: 'Oklahoma', abbr: 'OK', zip: '730' },
  { name: 'Oregon', abbr: 'OR', zip: '979' }, { name: 'Pennsylvania', abbr: 'PA', zip: '186' },
  { name: 'Rhode Island', abbr: 'RI', zip: '029' }, { name: 'South Carolina', abbr: 'SC', zip: '299' },
  { name: 'South Dakota', abbr: 'SD', zip: '577' }, { name: 'Tennessee', abbr: 'TN', zip: '383' },
  { name: 'Texas', abbr: 'TX', zip: '798' }, { name: 'Utah', abbr: 'UT', zip: '847' },
  { name: 'Vermont', abbr: 'VT', zip: '050' }, { name: 'Virginia', abbr: 'VA', zip: '222' },
  { name: 'Washington', abbr: 'WA', zip: '990' }, { name: 'West Virginia', abbr: 'WV', zip: '247' },
  { name: 'Wisconsin', abbr: 'WI', zip: '549' }, { name: 'Wyoming', abbr: 'WY', zip: '831' },
];

const COUNTRIES = [
  { name: 'United States', code: 'US' }, { name: 'United Kingdom', code: 'GB' },
  { name: 'Canada', code: 'CA' }, { name: 'Australia', code: 'AU' },
  { name: 'Germany', code: 'DE' }, { name: 'France', code: 'FR' },
  { name: 'Japan', code: 'JP' }, { name: 'Brazil', code: 'BR' },
  { name: 'India', code: 'IN' }, { name: 'Mexico', code: 'MX' },
];

const PHONE_AREA_CODES = ['201','212','213','305','310','312','321','347','404','415','416','503','514','602','604','613','617','619','646','702','713','718','786','832','905','917','929','949','954','972'];
const SECONDARY_ADDRESS_PREFIX = ['Apt. ','Suite ','Unit '];
const EMAIL_DOMAINS = ['gmail.com','yahoo.com','hotmail.com','outlook.com','icloud.com','protonmail.com','mail.com','aol.com'];

function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomPick(arr) { return arr[randomInt(0, arr.length - 1)]; }
function randomDigits(count) { let s = ''; for (let i = 0; i < count; i++) s += randomInt(0, 9).toString(); return s; }

function generateAddresses({ quantity, country, stateAbbr, gender, includePhone, includeEmail, includeSSN, includeDOB }) {
  const addresses = [];
  for (let i = 0; i < quantity; i++) {
    const isMale = gender === 'male' ? true : gender === 'female' ? false : Math.random() > 0.5;
    const firstName = isMale ? randomPick(MALE_FIRST_NAMES) : randomPick(FEMALE_FIRST_NAMES);
    const lastName = randomPick(LAST_NAMES);
    const fullName = `${firstName} ${lastName}`;

    let state;
    if (stateAbbr) {
      state = US_STATES.find(s => s.abbr === stateAbbr) || randomPick(US_STATES);
    } else {
      state = randomPick(US_STATES);
    }

    const streetNum = randomInt(1, 9999).toString();
    const streetName = (Math.random() > 0.5 ? (isMale ? randomPick(MALE_FIRST_NAMES) : randomPick(FEMALE_FIRST_NAMES)) : randomPick(LAST_NAMES));
    const streetSuffix = randomPick(STREET_SUFFIXES);
    const streetAddress = `${streetNum} ${streetName} ${streetSuffix}`;
    const secondaryAddress = Math.random() > 0.6 ? `${randomPick(SECONDARY_ADDRESS_PREFIX)}${randomInt(1, 999)}` : '';

    const pattern = randomInt(0, 3);
    let city;
    const cfn = randomPick(MALE_FIRST_NAMES);
    if (pattern === 0) city = `${randomPick(CITY_PREFIXES)} ${cfn}${randomPick(CITY_SUFFIXES)}`;
    else if (pattern === 1) city = `${randomPick(CITY_PREFIXES)} ${cfn}`;
    else if (pattern === 2) city = `${cfn}${randomPick(CITY_SUFFIXES)}`;
    else city = `${randomPick(LAST_NAMES)}${randomPick(CITY_SUFFIXES)}`;

    const zipCode = state.zip + randomDigits(2);
    const countryInfo = COUNTRIES.find(c => c.code === country) || COUNTRIES[0];

    const fullAddress = secondaryAddress
      ? `${secondaryAddress} ${streetAddress}, ${city}, ${state.abbr} ${zipCode}`
      : `${streetAddress}, ${city}, ${state.abbr} ${zipCode}`;

    // Phone
    let phone = '';
    if (includePhone) {
      const ac = randomPick(PHONE_AREA_CODES);
      const ex = randomDigits(3);
      const sub = randomDigits(4);
      const fmts = [`(${ac}) ${ex}-${sub}`, `${ac}-${ex}-${sub}`, `+1 ${ac} ${ex} ${sub}`];
      phone = randomPick(fmts);
    }

    // Email
    let email = '';
    if (includeEmail) {
      const fn = firstName.toLowerCase().replace(/[^a-z]/g, '');
      const ln = lastName.toLowerCase().replace(/[^a-z]/g, '');
      const pats = [`${fn}.${ln}`,`${fn}${ln}`,`${fn}.${ln}${randomInt(1,99)}`,`${fn[0]}${ln}`,`${fn}_${ln}`];
      email = `${randomPick(pats)}@${randomPick(EMAIL_DOMAINS)}`;
    }

    // SSN last 4
    const ssnLast4 = includeSSN ? randomDigits(4) : '';

    // DOB
    let dobStr = '';
    if (includeDOB) {
      const year = new Date().getFullYear() - randomInt(18, 80);
      const month = randomInt(1, 12);
      const day = randomInt(1, 28);
      dobStr = `${String(month).padStart(2,'0')}/${String(day).padStart(2,'0')}/${year}`;
    }

    addresses.push({
      firstName, lastName, fullName,
      streetAddress, secondaryAddress, city,
      state: state.name, stateAbbr: state.abbr, zipCode,
      country: countryInfo.name, countryCode: countryInfo.code,
      phone, email, ssnLast4, dob: dobStr, fullAddress,
    });
  }
  return addresses;
}
