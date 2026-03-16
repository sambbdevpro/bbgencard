// Address Generator - Data sourced from faker-ruby/faker
// https://github.com/faker-ruby/faker

// ============== DATA ==============

const MALE_FIRST_NAMES = [
  'Aaron','Abdul','Abe','Abel','Abraham','Adam','Adrian','Ahmad','Ahmed','Al','Alan','Albert',
  'Alberto','Alec','Alejandro','Alex','Alexander','Alexis','Alfonso','Alfred','Alfredo','Ali',
  'Allan','Allen','Alonso','Alonzo','Alvaro','Alvin','Ambrose','Amos','Anderson','Andre','Andres',
  'Andrew','Andy','Angel','Angelo','Anthony','Antoine','Anton','Antonio','Antony','Archie',
  'Ariel','Armando','Arnold','Arthur','Arturo','Ashley','Aubrey','August','Augustine','Austin',
  'Avery','Barry','Ben','Benedict','Benjamin','Bennett','Benny','Bernard','Bill','Billy','Blake',
  'Bob','Bobby','Boris','Boyd','Brad','Bradford','Bradley','Brady','Brandon','Brent','Brett',
  'Brian','Brice','Brock','Bruce','Bruno','Bryan','Bryant','Bryce','Byron','Caleb','Calvin',
  'Cameron','Carl','Carlos','Carlton','Carmen','Carroll','Carson','Carter','Casey','Cecil','Cesar',
  'Chad','Charles','Charlie','Chase','Chester','Chris','Christian','Christopher','Chuck','Clarence',
  'Clark','Claude','Clay','Clayton','Clement','Cleveland','Cliff','Clifford','Clifton','Clint',
  'Clinton','Clyde','Cody','Cole','Colin','Collin','Colton','Conrad','Corey','Cornelius','Cory',
  'Craig','Curtis','Cyrus','Dale','Dallas','Dalton','Damian','Damon','Dan','Dana','Daniel',
  'Danny','Dante','Darin','Darius','Darnell','Darrell','Darren','Darrick','Darryl','Darwin',
  'Dave','David','Davis','Dean','Deandre','Del','Delbert','Demetrius','Dennis','Denver','Derek',
  'Derrick','Desmond','Devin','Devon','Dewey','Dexter','Diego','Dillon','Dino','Dirk','Domingo',
  'Dominic','Dominick','Dominique','Don','Donald','Donnell','Donnie','Donovan','Dorian','Doug',
  'Douglas','Drew','Duane','Dudley','Duncan','Dustin','Dwight','Dylan','Earl','Ed','Eddie',
  'Edgar','Edison','Edmund','Eduardo','Edward','Edwin','Eli','Elias','Elijah','Elliot','Elliott',
  'Ellis','Elmer','Elton','Elvis','Emanuel','Emerson','Emil','Emilio','Emmanuel','Emmett',
  'Enrique','Eric','Erich','Erick','Erik','Ernest','Ernesto','Ervin','Ethan','Eugene','Evan',
  'Everett','Ezekiel','Ezra','Fabian','Federico','Felipe','Felix','Fernando','Fidel','Fletcher',
  'Floyd','Forest','Francis','Francisco','Frank','Frankie','Franklin','Fred','Freddie','Freddy',
  'Frederick','Fredrick','Gabriel','Gale','Garland','Garrett','Garry','Gary','Gavin','Gene',
  'Geoffrey','George','Gerald','Gerard','Gerardo','German','Gilbert','Glen','Glenn','Gordon',
  'Graham','Grant','Greg','Gregg','Gregory','Guadalupe','Guillermo','Gus','Gustavo','Guy',
  'Hal','Hank','Hans','Harold','Harrison','Harry','Harvey','Hayden','Heath','Hector','Henry',
  'Herbert','Herman','Hershel','Homer','Horace','Howard','Hubert','Hugh','Hugo','Hunter',
  'Ian','Ignacio','Ira','Irving','Isaac','Isaiah','Ismael','Israel','Ivan','Jack','Jackie',
  'Jackson','Jacob','Jacques','Jaime','Jake','Jamal','James','Jamie','Jan','Jared','Jarrett',
  'Jarrod','Jarvis','Jason','Jasper','Javier','Jay','Jean','Jeff','Jefferson','Jeffery','Jeffrey',
  'Jerald','Jeremiah','Jeremy','Jermaine','Jerome','Jerry','Jesse','Jessie','Jesus','Jim','Jimmie',
  'Jimmy','Joaquin','Joe','Joel','Joey','John','Johnathan','Johnnie','Johnny','Jon','Jonah',
  'Jonas','Jonathan','Jonathon','Jordan','Jorge','Jose','Joseph','Josh','Joshua','Juan','Jude',
  'Julian','Julio','Julius','Junior','Justin','Kareem','Karl','Keith','Kelly','Kelvin','Ken',
  'Kendall','Kenneth','Kenny','Kent','Kerry','Kevin','Kim','King','Kirk','Kris','Kurt','Kyle',
  'Lamar','Lance','Lane','Larry','Laurence','Lawrence','Lee','Leland','Leo','Leon','Leonard',
  'Leonardo','Leopoldo','Leroy','Leslie','Lester','Levi','Lewis','Lincoln','Lionel','Lloyd',
  'Logan','Lon','Lonnie','Lorenzo','Lou','Louie','Louis','Lowell','Lucas','Luciano','Luis','Luke',
  'Luther','Lyle','Lyndon','Mac','Malcolm','Malik','Manuel','Marc','Marcel','Marcelo','Marco',
  'Marcos','Marcus','Mario','Marion','Mark','Markus','Marlin','Marlon','Marshall','Martin',
  'Marty','Marvin','Mason','Matt','Matthew','Maurice','Max','Maximiliano','Maxwell','Melvin',
  'Merle','Michael','Micheal','Miguel','Mike','Miles','Milton','Mitchell','Mohamed','Monte',
  'Morgan','Morris','Moses','Myron','Nathan','Nathaniel','Neal','Neil','Nelson','Nestor',
  'Nicholas','Nick','Nicolas','Noah','Noel','Nolan','Norman','Oliver','Omar','Orlando','Oscar',
  'Osvaldo','Otto','Owen','Pablo','Parker','Pat','Patrick','Paul','Pedro','Percy','Perry','Pete',
  'Peter','Phil','Philip','Phillip','Pierre','Preston','Quentin','Rafael','Ralph','Ramiro',
  'Ramon','Randall','Randolph','Randy','Raphael','Raul','Ray','Raymond','Reginald','Rene',
  'Rex','Ricardo','Richard','Rick','Rickey','Ricky','Riley','Rob','Robbie','Robert','Roberto',
  'Robin','Rod','Roderick','Rodney','Rodolfo','Rodrigo','Roger','Roland','Rolando','Roman',
  'Romeo','Ron','Ronald','Ronnie','Roosevelt','Rory','Ross','Roy','Ruben','Rudolph','Rudy',
  'Rufus','Russel','Russell','Ryan','Salvador','Salvatore','Sam','Sammy','Samuel','Sandy',
  'Santiago','Santos','Scott','Sean','Sergio','Seth','Shane','Shannon','Shaun','Shawn','Sheldon',
  'Sherman','Sidney','Simon','Sol','Solomon','Spencer','Stacey','Stanley','Stefan','Stephen',
  'Sterling','Steve','Steven','Stewart','Stuart','Sylvester','Taylor','Ted','Teodoro','Terence',
  'Terry','Theodore','Thomas','Tim','Timmy','Timothy','Tobias','Todd','Tom','Tomas','Tommy',
  'Tony','Tracy','Travis','Trevor','Trey','Troy','Tyler','Tyrone','Ulysses','Van','Vance',
  'Vernon','Victor','Vince','Vincent','Virgil','Wade','Wallace','Walter','Ward','Warren','Wayne',
  'Wendell','Wesley','Weston','Whitney','Wilbert','Wilbur','Wilfredo','Will','Willard','William',
  'Willie','Willis','Wilson','Winston','Woodrow','Xavier','Zachary','Zane',
];

const FEMALE_FIRST_NAMES = [
  'Abigail','Ada','Addie','Adelaide','Adele','Adeline','Adriana','Adrienne','Agnes','Aileen',
  'Aimee','Aisha','Alana','Alberta','Alexa','Alexandra','Alexis','Alice','Alicia','Alina',
  'Alisa','Alison','Allison','Alma','Alyssa','Amanda','Amber','Amelia','Amy','Ana','Anastasia',
  'Andrea','Angela','Angelica','Angelina','Angie','Anita','Ann','Anna','Annabelle','Anne',
  'Annette','Annie','April','Ariana','Ariel','Arlene','Ashlee','Ashley','Audrey','Aurora',
  'Autumn','Ava','Barbara','Beatrice','Becky','Belinda','Bernadette','Bernice','Bertha','Beth',
  'Bethany','Betty','Beverly','Bianca','Billie','Blair','Blanche','Bobbie','Bonnie','Brandi',
  'Brandy','Brenda','Bridget','Brittany','Brooke','Caitlin','Callie','Camille','Candace','Cara',
  'Carina','Carla','Carmen','Carol','Caroline','Carolyn','Carrie','Casey','Cassandra','Catherine',
  'Cathy','Cecelia','Cecilia','Celeste','Celia','Charlene','Charlotte','Chelsea','Cheri','Cheryl',
  'Chloe','Christie','Christina','Christine','Christy','Cindy','Claire','Clara','Claudia',
  'Colleen','Connie','Constance','Cora','Corinne','Courtney','Crystal','Cynthia','Daisy','Dana',
  'Danielle','Daphne','Darlene','Dawn','Deanna','Debbie','Deborah','Debra','Delia','Denise',
  'Desiree','Diana','Diane','Dianne','Dolores','Donna','Dora','Doreen','Doris','Dorothy',
  'Edith','Edna','Eileen','Elaine','Eleanor','Elena','Elizabeth','Ella','Ellen','Eloise','Elsie',
  'Emily','Emma','Erica','Erin','Ernestine','Esmeralda','Estelle','Esther','Ethel','Eva',
  'Evelyn','Faith','Faye','Felicia','Flora','Florence','Frances','Francesca','Gabriela',
  'Gabriella','Gail','Geneva','Genevieve','Georgia','Geraldine','Gina','Ginger','Gladys',
  'Glenda','Gloria','Grace','Gretchen','Gwendolyn','Haley','Hannah','Harriet','Hattie','Hazel',
  'Heather','Heidi','Helen','Helena','Henrietta','Hilary','Hilda','Holly','Hope','Ida','Ilene',
  'Imogene','Inez','Ingrid','Irene','Iris','Irma','Isabel','Isabella','Ivy','Jackie','Jacqueline',
  'Jade','Jaime','Jamie','Jan','Jana','Jane','Janet','Janice','Jasmine','Jean','Jeanette',
  'Jeanne','Jenna','Jennifer','Jenny','Jessica','Jessie','Jewel','Jill','Jillian','Jo','Joan',
  'Joann','Joanna','Joanne','Jocelyn','Jodi','Jodie','Johanna','Josefina','Josephine','Joy',
  'Joyce','Juanita','Judith','Judy','Julia','Juliana','Julie','June','Karen','Karina','Karla',
  'Kate','Katherine','Kathleen','Kathryn','Kathy','Katie','Katrina','Kay','Kayla','Kelley',
  'Kelli','Kelly','Kelsey','Kendra','Kerry','Kim','Kimberly','Kirsten','Krista','Kristen',
  'Kristin','Kristina','Kristine','Kristy','Krystal','Lacey','Lana','Latasha','Latoya','Laura',
  'Lauren','Laurie','Laverne','Leah','Leigh','Lena','Leona','Leslie','Leticia','Lillian','Lillie',
  'Lily','Linda','Lindsay','Lindsey','Lisa','Lois','Lola','Lorena','Loretta','Lori','Lorraine',
  'Louise','Lucia','Lucille','Lucy','Lydia','Lynn','Lynne','Mabel','Madeleine','Madeline',
  'Madison','Mae','Maggie','Mandy','Marcella','Marcia','Margaret','Margarita','Marguerite',
  'Maria','Marian','Marianne','Marie','Marilyn','Marina','Marjorie','Marlene','Marsha','Martha',
  'Mary','Maureen','Maxine','May','Megan','Melanie','Melinda','Melissa','Mercedes','Meredith',
  'Michele','Michelle','Mildred','Millicent','Mindy','Minnie','Miranda','Miriam','Misty',
  'Molly','Monica','Monique','Morgan','Muriel','Myra','Myrtle','Nadine','Nancy','Naomi',
  'Natalie','Natasha','Nellie','Nicole','Nina','Nora','Norma','Olga','Olive','Olivia','Opal',
  'Pam','Pamela','Pat','Patricia','Patsy','Patti','Patty','Paula','Paulette','Pauline','Pearl',
  'Peggy','Penny','Phyllis','Polly','Priscilla','Rachel','Ramona','Rebecca','Regina','Renee',
  'Rhonda','Rita','Roberta','Robin','Robyn','Rochelle','Rosa','Rosalie','Rose','Rosemary',
  'Rosie','Roxanne','Ruby','Ruth','Sabrina','Sadie','Sally','Samantha','Sandra','Sandy','Sara',
  'Sarah','Savannah','Selma','Shannon','Sharon','Sheila','Shelby','Shelly','Sheri','Sherri',
  'Sherry','Shirley','Sierra','Silvia','Simone','Sofia','Sonia','Sonya','Sophia','Sophie',
  'Stacey','Stacy','Stella','Stephanie','Sue','Summer','Susan','Susanne','Susie','Suzanne',
  'Sylvia','Tabitha','Tamara','Tammy','Tanya','Tara','Teresa','Teri','Terri','Terry','Tess',
  'Thelma','Theresa','Tiffany','Tina','Toni','Tonya','Tracey','Tracy','Ursula','Valerie',
  'Vanessa','Vera','Verna','Veronica','Vicki','Vickie','Vicky','Victoria','Viola','Violet',
  'Virginia','Vivian','Wanda','Wendy','Whitney','Wilma','Winifred','Yolanda','Yvette','Yvonne',
];

const LAST_NAMES = [
  'Abbott','Acevedo','Acosta','Adams','Adkins','Aguilar','Aguirre','Albert','Alexander','Alford',
  'Allen','Allison','Alston','Alvarado','Alvarez','Anderson','Andrews','Anthony','Armstrong',
  'Arnold','Ashley','Atkins','Atkinson','Austin','Avery','Avila','Ayala','Ayers','Bailey','Baker',
  'Baldwin','Ball','Ballard','Banks','Barber','Barker','Barlow','Barnes','Barnett','Barr',
  'Barrett','Barron','Barry','Bartlett','Barton','Bass','Bates','Battle','Bauer','Baxter','Bean',
  'Beard','Beasley','Beck','Becker','Bell','Bender','Benjamin','Bennett','Benson','Bentley',
  'Benton','Berg','Berger','Bernard','Berry','Best','Bird','Bishop','Black','Blackburn',
  'Blackwell','Blair','Blake','Blanchard','Blankenship','Blevins','Bolton','Bond','Booker',
  'Boone','Booth','Bowen','Bowers','Bowman','Boyd','Boyer','Boyle','Bradford','Bradley','Brady',
  'Branch','Bray','Brennan','Brewer','Bridges','Briggs','Bright','Britt','Brock','Brooks',
  'Brown','Browning','Bruce','Bryan','Bryant','Buchanan','Buck','Buckley','Buckner','Bullock',
  'Burch','Burgess','Burke','Burnett','Burns','Burris','Burt','Burton','Bush','Butler','Byrd',
  'Cabrera','Cain','Calderon','Caldwell','Calhoun','Callahan','Camacho','Cameron','Campbell',
  'Campos','Cannon','Cantrell','Cantu','Cardenas','Carey','Carlson','Carney','Carpenter','Carr',
  'Carrillo','Carroll','Carson','Carter','Carver','Case','Casey','Cash','Castaneda','Castillo',
  'Castro','Cervantes','Chambers','Chan','Chandler','Chang','Chapman','Charles','Chase','Chavez',
  'Chen','Cherry','Christensen','Christian','Church','Clark','Clarke','Clay','Clayton','Clements',
  'Cline','Cobb','Cochran','Coffey','Cohen','Cole','Coleman','Collier','Collins','Colon',
  'Combs','Compton','Conley','Conner','Conrad','Contreras','Conway','Cook','Cooke','Cooley',
  'Cooper','Copeland','Cortez','Costa','Couch','Cox','Craft','Craig','Crane','Crawford','Cross',
  'Cruz','Cummings','Cunningham','Curry','Curtis','Dale','Dalton','Daniel','Daniels','David',
  'Davidson','Davis','Dawson','Day','Dean','Decker','Dejesus','Delacruz','Deleon','Delgado',
  'Dennis','Diaz','Dickerson','Dickson','Dillard','Dixon','Dodson','Donaldson','Donovan',
  'Dorsey','Dougherty','Douglas','Downs','Doyle','Drake','Dudley','Duffy','Duke','Duncan',
  'Dunlap','Dunn','Duran','Durham','Dyer','Eaton','Edwards','Elliott','Ellis','Ellison',
  'English','Erickson','Espinoza','Estes','Estrada','Evans','Everett','Ewing','Farmer',
  'Farrell','Faulkner','Ferguson','Fernandez','Ferrell','Fields','Figueroa','Finch','Finley',
  'Fischer','Fisher','Fitzgerald','Fitzpatrick','Fleming','Fletcher','Flores','Flowers','Floyd',
  'Flynn','Foley','Forbes','Ford','Foreman','Foster','Fowler','Fox','Francis','Franco','Frank',
  'Franklin','Frazier','Frederick','Freeman','French','Frost','Fry','Frye','Fuentes','Fuller',
  'Fulton','Gallagher','Gallegos','Galloway','Gamble','Garcia','Gardner','Garner','Garrett',
  'Garrison','Garza','Gates','Gay','Gentry','George','Gibbs','Gibson','Gilbert','Giles','Gill',
  'Gillespie','Gilliam','Gilmore','Glass','Glenn','Glover','Goff','Golden','Gomez','Gonzales',
  'Gonzalez','Good','Goodman','Goodwin','Gordon','Gould','Graham','Grant','Graves','Gray',
  'Green','Greene','Greer','Gregory','Griffin','Griffith','Grimes','Gross','Guerra','Guerrero',
  'Gutierrez','Guy','Guzman','Hahn','Hale','Haley','Hall','Hamilton','Hammond','Hampton',
  'Hancock','Haney','Hansen','Hanson','Hardin','Harding','Hardy','Harmon','Harper','Harrell',
  'Harrington','Harris','Harrison','Hart','Hartman','Harvey','Hatfield','Hawkins','Hayden',
  'Hayes','Haynes','Hays','Heath','Hebert','Henderson','Hendricks','Hendrix','Henry','Hensley',
  'Henson','Herman','Hernandez','Herrera','Herring','Hess','Hester','Hewitt','Hickman','Hicks',
  'Higgins','Hill','Hines','Hinton','Ho','Hobbs','Hodge','Hodges','Hoffman','Hogan','Holcomb',
  'Holden','Holder','Holland','Holloway','Holman','Holmes','Holt','Hood','Hooper','Hopkins',
  'Horn','Horne','Horton','House','Houston','Howard','Howe','Howell','Hubbard','Huber','Hudson',
  'Huffman','Hughes','Hull','Humphrey','Hunt','Hunter','Hurley','Hurst','Hutchinson','Hyde',
  'Ingram','Irwin','Jackson','Jacobs','Jacobson','James','Jarvis','Jefferson','Jenkins',
  'Jennings','Jensen','Jimenez','Johns','Johnson','Johnston','Jones','Jordan','Joseph','Joyce',
  'Juarez','Justice','Kane','Kaufman','Keith','Keller','Kelley','Kelly','Kemp','Kennedy','Kent',
  'Kerr','Key','Kidd','Kim','King','Kinney','Kirk','Klein','Kline','Knapp','Knight','Knowles',
  'Knox','Koch','Kramer','Lamb','Lambert','Lancaster','Landry','Lane','Lang','Langley','Lara',
  'Larsen','Larson','Lawrence','Lawson','Le','Leach','Leblanc','Lee','Leon','Leonard','Lester',
  'Levine','Levy','Lewis','Lindsay','Little','Livingston','Lloyd','Logan','Long','Lopez',
  'Lott','Love','Lowe','Lowery','Lucas','Luna','Lynch','Lynn','Lyons','Macias','Mack','Madden',
  'Maddox','Maldonado','Malone','Mann','Manning','Marks','Marquez','Marsh','Marshall','Martin',
  'Martinez','Mason','Massey','Mathews','Mathis','Matthews','Maxwell','May','Mayer','Maynard',
  'Mayo','Mays','McBride','McCall','McCarthy','McClain','McCormick','McCoy','McCullough',
  'McDonald','McDowell','McFarland','McGee','McGowan','McGuire','McIntosh','McIntyre','McKay',
  'McKee','McKenzie','McKinney','McLaughlin','McLean','McMillan','McNeil','McPherson','Meadows',
  'Medina','Mejia','Melendez','Melton','Mendez','Mendoza','Mercado','Mercer','Merrill','Merritt',
  'Meyer','Meyers','Michael','Middleton','Miles','Miller','Mills','Miranda','Mitchell','Molina',
  'Monroe','Montgomery','Montoya','Moody','Moon','Moore','Morales','Moran','Moreno','Morgan',
  'Morris','Morrison','Morrow','Morse','Morton','Moses','Mosley','Moss','Mueller','Mullen',
  'Mullins','Munoz','Murphy','Murray','Myers','Nash','Navarro','Neal','Nelson','Newman','Newton',
  'Nguyen','Nichols','Nicholson','Nielsen','Nixon','Noble','Noel','Nolan','Norman','Norris',
  'Norton','Novak','Nunez','Obrien','Ochoa','Oconnor','Odom','Odonnell','Oliver','Olsen','Olson',
  'Oneal','Oneill','Orr','Ortega','Ortiz','Osborn','Osborne','Owen','Owens','Pace','Pacheco',
  'Padilla','Page','Palmer','Park','Parker','Parks','Parrish','Parsons','Pate','Patel','Patrick',
  'Patterson','Patton','Paul','Payne','Pearson','Peck','Pena','Pennington','Perez','Perkins',
  'Perry','Peters','Petersen','Peterson','Petty','Phelps','Phillips','Pierce','Pittman','Pitts',
  'Pollard','Poole','Pope','Porter','Potter','Potts','Powell','Powers','Pratt','Preston','Price',
  'Prince','Pruitt','Pugh','Quinn','Ramirez','Ramos','Ramsey','Randall','Randolph','Rangel',
  'Rasmussen','Ratliff','Ray','Raymond','Reed','Reese','Reeves','Reid','Reilly','Reyes',
  'Reynolds','Rhodes','Rice','Rich','Richard','Richards','Richardson','Richmond','Riley','Rios',
  'Rivas','Rivera','Rivers','Roach','Robbins','Roberson','Roberts','Robertson','Robinson',
  'Robles','Rocha','Rodgers','Rodriguez','Rogers','Rojas','Rollins','Roman','Romero','Rosa',
  'Rosales','Rosario','Rose','Ross','Roth','Rowe','Rowland','Roy','Rubio','Ruiz','Rush',
  'Russell','Russo','Rutledge','Ryan','Salas','Salazar','Salinas','Sampson','Sanchez','Sanders',
  'Sandoval','Sanford','Santiago','Santos','Sargent','Saunders','Savage','Sawyer','Schmidt',
  'Schneider','Schroeder','Schultz','Schwartz','Scott','Sears','Sellers','Serrano','Sexton',
  'Shaffer','Shannon','Sharp','Sharpe','Shaw','Shelton','Shepard','Shepherd','Sheppard',
  'Sherman','Shields','Short','Silva','Simmons','Simon','Simpson','Sims','Singleton','Skinner',
  'Slater','Sloan','Small','Smith','Snider','Snow','Snyder','Solis','Solomon','Sosa','Soto',
  'Sparks','Spears','Spence','Spencer','Stafford','Stanley','Stanton','Stark','Steele','Stein',
  'Stephens','Stephenson','Stevens','Stevenson','Stewart','Stokes','Stone','Stout','Strickland',
  'Strong','Stuart','Suarez','Sullivan','Summers','Sutton','Swanson','Sweeney','Sweet','Sykes',
  'Talley','Tanner','Tate','Taylor','Terrell','Terry','Thomas','Thompson','Thornton','Tillman',
  'Todd','Torres','Townsend','Tran','Travis','Trevino','Trujillo','Tucker','Turner','Tyler',
  'Underwood','Valdez','Valencia','Valentine','Valenzuela','Vance','Vargas','Vasquez','Vaughan',
  'Vaughn','Vazquez','Vega','Velasquez','Velazquez','Velez','Villarreal','Vincent','Wade',
  'Wagner','Walker','Wall','Wallace','Waller','Wallis','Walsh','Walter','Walters','Walton',
  'Ward','Ware','Warner','Warren','Washington','Waters','Watkins','Watson','Watts','Weaver',
  'Webb','Weber','Webster','Weeks','Weiss','Welch','Wells','West','Wheeler','Whitaker','White',
  'Whitehead','Whitfield','Whitley','Whitney','Wiggins','Wilcox','Wilder','Wiley','Wilkerson',
  'Wilkins','Wilkinson','William','Williams','Williamson','Willis','Wilson','Winters','Wise',
  'Wolf','Wolfe','Wong','Wood','Woodard','Woods','Woodward','Wooten','Workman','Wright','Wyatt',
  'Yates','York','Young','Zamora','Zimmerman',
];

const STREET_SUFFIXES = [
  'Alley','Avenue','Branch','Bridge','Brook','Bypass','Canyon','Cape','Causeway','Center','Circle',
  'Cliff','Club','Common','Corner','Court','Cove','Creek','Crescent','Crest','Crossing','Curve',
  'Dale','Dam','Divide','Drive','Drives','Estate','Expressway','Extension','Fall','Falls','Ferry',
  'Field','Fields','Flat','Ford','Forest','Forge','Fork','Forks','Fort','Freeway','Garden',
  'Gateway','Glen','Green','Grove','Harbor','Haven','Heights','Highway','Hill','Hills','Hollow',
  'Inlet','Island','Isle','Junction','Key','Knoll','Lake','Lakes','Landing','Lane','Light','Loaf',
  'Lock','Lodge','Loop','Mall','Manor','Meadow','Meadows','Mews','Mill','Mills','Mission',
  'Motorway','Mount','Mountain','Mountains','Neck','Orchard','Oval','Overpass','Park','Parkway',
  'Pass','Passage','Path','Pike','Pine','Pines','Place','Plain','Plains','Plaza','Point','Port',
  'Prairie','Radial','Ramp','Ranch','Rapid','Rapids','Rest','Ridge','River','Road','Roads',
  'Route','Row','Rue','Run','Shore','Skyway','Spring','Springs','Spur','Square','Station',
  'Stream','Street','Summit','Terrace','Throughway','Trace','Track','Trail','Tunnel','Turnpike',
  'Underpass','Union','Valley','Via','Viaduct','View','Village','Vista','Walk','Wall','Way',
  'Well','Wells',
];

const CITY_PREFIXES = ['North','East','West','South','New','Lake','Port'];
const CITY_SUFFIXES = [
  'town','ton','land','ville','berg','burgh','borough','bury','view','port',
  'mouth','stad','furt','chester','fort','haven','side','shire',
];

const US_STATES: { name: string; abbr: string; zipPrefix: string }[] = [
  { name: 'Alabama', abbr: 'AL', zipPrefix: '350' },
  { name: 'Alaska', abbr: 'AK', zipPrefix: '995' },
  { name: 'Arizona', abbr: 'AZ', zipPrefix: '850' },
  { name: 'Arkansas', abbr: 'AR', zipPrefix: '717' },
  { name: 'California', abbr: 'CA', zipPrefix: '900' },
  { name: 'Colorado', abbr: 'CO', zipPrefix: '800' },
  { name: 'Connecticut', abbr: 'CT', zipPrefix: '061' },
  { name: 'Delaware', abbr: 'DE', zipPrefix: '198' },
  { name: 'Florida', abbr: 'FL', zipPrefix: '322' },
  { name: 'Georgia', abbr: 'GA', zipPrefix: '301' },
  { name: 'Hawaii', abbr: 'HI', zipPrefix: '967' },
  { name: 'Idaho', abbr: 'ID', zipPrefix: '832' },
  { name: 'Illinois', abbr: 'IL', zipPrefix: '600' },
  { name: 'Indiana', abbr: 'IN', zipPrefix: '463' },
  { name: 'Iowa', abbr: 'IA', zipPrefix: '510' },
  { name: 'Kansas', abbr: 'KS', zipPrefix: '666' },
  { name: 'Kentucky', abbr: 'KY', zipPrefix: '404' },
  { name: 'Louisiana', abbr: 'LA', zipPrefix: '701' },
  { name: 'Maine', abbr: 'ME', zipPrefix: '042' },
  { name: 'Maryland', abbr: 'MD', zipPrefix: '210' },
  { name: 'Massachusetts', abbr: 'MA', zipPrefix: '026' },
  { name: 'Michigan', abbr: 'MI', zipPrefix: '480' },
  { name: 'Minnesota', abbr: 'MN', zipPrefix: '555' },
  { name: 'Mississippi', abbr: 'MS', zipPrefix: '387' },
  { name: 'Missouri', abbr: 'MO', zipPrefix: '650' },
  { name: 'Montana', abbr: 'MT', zipPrefix: '590' },
  { name: 'Nebraska', abbr: 'NE', zipPrefix: '688' },
  { name: 'Nevada', abbr: 'NV', zipPrefix: '898' },
  { name: 'New Hampshire', abbr: 'NH', zipPrefix: '036' },
  { name: 'New Jersey', abbr: 'NJ', zipPrefix: '076' },
  { name: 'New Mexico', abbr: 'NM', zipPrefix: '880' },
  { name: 'New York', abbr: 'NY', zipPrefix: '122' },
  { name: 'North Carolina', abbr: 'NC', zipPrefix: '288' },
  { name: 'North Dakota', abbr: 'ND', zipPrefix: '586' },
  { name: 'Ohio', abbr: 'OH', zipPrefix: '444' },
  { name: 'Oklahoma', abbr: 'OK', zipPrefix: '730' },
  { name: 'Oregon', abbr: 'OR', zipPrefix: '979' },
  { name: 'Pennsylvania', abbr: 'PA', zipPrefix: '186' },
  { name: 'Rhode Island', abbr: 'RI', zipPrefix: '029' },
  { name: 'South Carolina', abbr: 'SC', zipPrefix: '299' },
  { name: 'South Dakota', abbr: 'SD', zipPrefix: '577' },
  { name: 'Tennessee', abbr: 'TN', zipPrefix: '383' },
  { name: 'Texas', abbr: 'TX', zipPrefix: '798' },
  { name: 'Utah', abbr: 'UT', zipPrefix: '847' },
  { name: 'Vermont', abbr: 'VT', zipPrefix: '050' },
  { name: 'Virginia', abbr: 'VA', zipPrefix: '222' },
  { name: 'Washington', abbr: 'WA', zipPrefix: '990' },
  { name: 'West Virginia', abbr: 'WV', zipPrefix: '247' },
  { name: 'Wisconsin', abbr: 'WI', zipPrefix: '549' },
  { name: 'Wyoming', abbr: 'WY', zipPrefix: '831' },
];

const COUNTRIES = [
  { name: 'United States', code: 'US' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'Canada', code: 'CA' },
  { name: 'Australia', code: 'AU' },
  { name: 'Germany', code: 'DE' },
  { name: 'France', code: 'FR' },
  { name: 'Japan', code: 'JP' },
  { name: 'Brazil', code: 'BR' },
  { name: 'India', code: 'IN' },
  { name: 'Mexico', code: 'MX' },
  { name: 'Italy', code: 'IT' },
  { name: 'Spain', code: 'ES' },
  { name: 'Netherlands', code: 'NL' },
  { name: 'South Korea', code: 'KR' },
  { name: 'Sweden', code: 'SE' },
  { name: 'Switzerland', code: 'CH' },
  { name: 'Norway', code: 'NO' },
  { name: 'Singapore', code: 'SG' },
  { name: 'New Zealand', code: 'NZ' },
  { name: 'Ireland', code: 'IE' },
];

const PHONE_AREA_CODES = [
  '201','212','213','305','310','312','321','347','404','415',
  '416','503','514','602','604','613','617','619','646','702',
  '713','718','786','832','905','917','929','949','954','972',
];

const SECONDARY_ADDRESS = ['Apt. ', 'Suite ', 'Unit '];

const EMAIL_DOMAINS = [
  'gmail.com','yahoo.com','hotmail.com','outlook.com','icloud.com',
  'protonmail.com','mail.com','aol.com','live.com','zoho.com',
];

// ============== UTILITIES ==============

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPick<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)];
}

function randomDigits(count: number): string {
  let s = '';
  for (let i = 0; i < count; i++) s += randomInt(0, 9).toString();
  return s;
}

// ============== GENERATORS ==============

function generateFirstName(gender?: 'male' | 'female'): string {
  if (gender === 'male') return randomPick(MALE_FIRST_NAMES);
  if (gender === 'female') return randomPick(FEMALE_FIRST_NAMES);
  return Math.random() > 0.5 ? randomPick(MALE_FIRST_NAMES) : randomPick(FEMALE_FIRST_NAMES);
}

function generateLastName(): string {
  return randomPick(LAST_NAMES);
}

function generateStreetName(): string {
  const name = Math.random() > 0.5 ? generateFirstName() : generateLastName();
  return `${name} ${randomPick(STREET_SUFFIXES)}`;
}

function generateStreetAddress(): string {
  const buildingNum = randomInt(1, 9999).toString();
  return `${buildingNum} ${generateStreetName()}`;
}

function generateSecondaryAddress(): string {
  return `${randomPick(SECONDARY_ADDRESS)}${randomInt(1, 999)}`;
}

function generateCityName(): string {
  const pattern = randomInt(0, 3);
  switch (pattern) {
    case 0: return `${randomPick(CITY_PREFIXES)} ${generateFirstName()}${randomPick(CITY_SUFFIXES)}`;
    case 1: return `${randomPick(CITY_PREFIXES)} ${generateFirstName()}`;
    case 2: return `${generateFirstName()}${randomPick(CITY_SUFFIXES)}`;
    default: return `${generateLastName()}${randomPick(CITY_SUFFIXES)}`;
  }
}

function generateZipCode(stateAbbr?: string): string {
  if (stateAbbr) {
    const state = US_STATES.find(s => s.abbr === stateAbbr);
    if (state) return state.zipPrefix + randomDigits(2);
  }
  return randomDigits(5);
}

function generateState(): typeof US_STATES[0] {
  return randomPick(US_STATES);
}

function generatePhoneNumber(): string {
  const areaCode = randomPick(PHONE_AREA_CODES);
  const exchange = randomDigits(3);
  const subscriber = randomDigits(4);
  const formats = [
    `(${areaCode}) ${exchange}-${subscriber}`,
    `${areaCode}-${exchange}-${subscriber}`,
    `${areaCode}.${exchange}.${subscriber}`,
    `+1 ${areaCode} ${exchange} ${subscriber}`,
  ];
  return randomPick(formats);
}

function generateEmail(firstName: string, lastName: string): string {
  const fn = firstName.toLowerCase().replace(/[^a-z]/g, '');
  const ln = lastName.toLowerCase().replace(/[^a-z]/g, '');
  const patterns = [
    `${fn}.${ln}`,
    `${fn}${ln}`,
    `${fn}.${ln}${randomInt(1, 99)}`,
    `${fn[0]}${ln}`,
    `${fn}_${ln}`,
    `${fn}${randomInt(100, 999)}`,
  ];
  return `${randomPick(patterns)}@${randomPick(EMAIL_DOMAINS)}`;
}

function generateSSNLast4(): string {
  return randomDigits(4);
}

function generateDOB(minAge: number = 18, maxAge: number = 80): string {
  const now = new Date();
  const year = now.getFullYear() - randomInt(minAge, maxAge);
  const month = randomInt(1, 12);
  const day = randomInt(1, 28);
  return `${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}/${year}`;
}

// ============== MAIN EXPORT ==============

export interface AddressData {
  firstName: string;
  lastName: string;
  fullName: string;
  streetAddress: string;
  secondaryAddress: string;
  city: string;
  state: string;
  stateAbbr: string;
  zipCode: string;
  country: string;
  countryCode: string;
  phone: string;
  email: string;
  ssnLast4: string;
  dob: string;
  fullAddress: string;
}

export interface GenerateAddressParams {
  quantity: number;
  country?: string;
  stateAbbr?: string;
  gender?: 'male' | 'female' | 'random';
  includePhone?: boolean;
  includeEmail?: boolean;
  includeSSN?: boolean;
  includeDOB?: boolean;
}

export function generateAddresses(params: GenerateAddressParams): AddressData[] {
  const {
    quantity = 1,
    country = 'US',
    stateAbbr,
    gender = 'random',
    includePhone = true,
    includeEmail = true,
    includeSSN = true,
    includeDOB = true,
  } = params;

  const addresses: AddressData[] = [];

  for (let i = 0; i < quantity; i++) {
    const g = gender === 'random' ? undefined : gender;
    const firstName = generateFirstName(g);
    const lastName = generateLastName();
    const fullName = `${firstName} ${lastName}`;

    let state: typeof US_STATES[0];
    if (stateAbbr) {
      state = US_STATES.find(s => s.abbr === stateAbbr) || generateState();
    } else {
      state = generateState();
    }

    const streetAddress = generateStreetAddress();
    const secondaryAddr = Math.random() > 0.6 ? generateSecondaryAddress() : '';
    const city = generateCityName();
    const zipCode = generateZipCode(state.abbr);

    const countryInfo = COUNTRIES.find(c => c.code === country) || COUNTRIES[0];

    const fullAddress = secondaryAddr
      ? `${secondaryAddr} ${streetAddress}, ${city}, ${state.abbr} ${zipCode}`
      : `${streetAddress}, ${city}, ${state.abbr} ${zipCode}`;

    addresses.push({
      firstName,
      lastName,
      fullName,
      streetAddress,
      secondaryAddress: secondaryAddr,
      city,
      state: state.name,
      stateAbbr: state.abbr,
      zipCode,
      country: countryInfo.name,
      countryCode: countryInfo.code,
      phone: includePhone ? generatePhoneNumber() : '',
      email: includeEmail ? generateEmail(firstName, lastName) : '',
      ssnLast4: includeSSN ? generateSSNLast4() : '',
      dob: includeDOB ? generateDOB() : '',
      fullAddress,
    });
  }

  return addresses;
}

export function getAvailableStates() {
  return US_STATES.map(s => ({ name: s.name, abbr: s.abbr }));
}

export function getAvailableCountries() {
  return COUNTRIES;
}

export type { };
