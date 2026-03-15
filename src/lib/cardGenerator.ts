// Card Generator - Ported from Rust to TypeScript
// Implements Luhn algorithm, BIN-based card generation, etc.

export interface CardNetwork {
  id: string;
  name: string;
  bins: string[];
  lengths: number[];
  cvvLength: number;
}

export interface CardData {
  number: string;
  network: string;
  exp_month: string;
  exp_year: string;
  expiry: string;
  cvv?: string;
  balance?: number;
  currency?: string;
  bin: string;
}

export interface ValidationResult {
  valid: boolean;
  luhn_valid: boolean;
  network: string | null;
  length: number;
  reason: string;
}

export interface GenerateParams {
  network: string;
  quantity: number;
  expMonth: number | null;
  expYear: number | null;
  includeCvv: boolean;
  includeBalance: boolean;
  currency: string | null;
  binCode: string | null;
}

// Card network registry
const CARD_NETWORKS: Record<string, CardNetwork> = {
  visa: {
    id: 'visa',
    name: 'Visa',
    bins: ['4'],
    lengths: [16],
    cvvLength: 3,
  },
  mastercard: {
    id: 'mastercard',
    name: 'Mastercard',
    bins: ['51', '52', '53', '54', '55', '2221', '2720'],
    lengths: [16],
    cvvLength: 3,
  },
  amex: {
    id: 'amex',
    name: 'American Express',
    bins: ['34', '37'],
    lengths: [15],
    cvvLength: 4,
  },
  discover: {
    id: 'discover',
    name: 'Discover',
    bins: ['6011', '644', '645', '646', '647', '648', '649', '65'],
    lengths: [16],
    cvvLength: 3,
  },
  unionpay: {
    id: 'unionpay',
    name: 'UnionPay',
    bins: ['62'],
    lengths: [16, 17, 18, 19],
    cvvLength: 3,
  },
  diners: {
    id: 'diners',
    name: 'Diners Club',
    bins: ['300', '301', '302', '303', '304', '305', '36', '38'],
    lengths: [14, 16],
    cvvLength: 3,
  },
  jcb: {
    id: 'jcb',
    name: 'JCB',
    bins: ['3528', '3589'],
    lengths: [16],
    cvvLength: 3,
  },
};

const CURRENCIES: [string, string][] = [
  ['USD', 'United States Dollar'],
  ['PHP', 'Philippine Peso'],
  ['EUR', 'Euro'],
  ['JPY', 'Japanese Yen'],
  ['GBP', 'British Pound Sterling'],
  ['CHF', 'Swiss Franc'],
  ['CAD', 'Canadian Dollar'],
  ['AUD', 'Australian Dollar'],
  ['CNY', 'Chinese Yuan Renminbi'],
  ['INR', 'Indian Rupee'],
  ['BRL', 'Brazilian Real'],
  ['ZAR', 'South African Rand'],
  ['RUB', 'Russian Ruble'],
  ['SAR', 'Saudi Riyal'],
  ['SGD', 'Singapore Dollar'],
  ['MXN', 'Mexican Peso'],
];

// Luhn algorithm
function luhnChecksum(cardNum: string): number {
  const digits = cardNum.split('').map(Number);
  const reversed = [...digits].reverse();
  
  let oddSum = 0;
  let evenSum = 0;
  
  for (let i = 0; i < reversed.length; i++) {
    if (i % 2 === 0) {
      oddSum += reversed[i];
    } else {
      let doubled = reversed[i] * 2;
      if (doubled > 9) doubled -= 9;
      evenSum += doubled;
    }
  }
  
  return (oddSum + evenSum) % 10;
}

function isLuhnValid(cardNum: string): boolean {
  return luhnChecksum(cardNum) === 0;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Detect card network from number
function detectNetwork(cardNumber: string): string | null {
  for (const [, network] of Object.entries(CARD_NETWORKS)) {
    for (const bin of network.bins) {
      if (cardNumber.startsWith(bin)) {
        return network.name;
      }
    }
  }
  return null;
}

// Generate a single card number
function generateCardNumber(networkId: string, binCode?: string | null): string {
  const network = CARD_NETWORKS[networkId];
  if (!network) throw new Error(`Unsupported network: ${networkId}`);
  
  let chosenBin: string;
  let targetLength: number;
  
  if (binCode) {
    if (binCode.includes('x') || binCode.includes('X')) {
      // BIN with placeholder
      const fixedPart = binCode.replace(/[xX]/g, '');
      const xCount = (binCode.match(/[xX]/g) || []).length;
      
      chosenBin = fixedPart;
      for (let i = 0; i < xCount - 1; i++) {
        chosenBin += randomInt(0, 9).toString();
      }
      targetLength = binCode.length;
    } else {
      chosenBin = binCode;
      targetLength = network.lengths[randomInt(0, network.lengths.length - 1)];
    }
  } else {
    const binIndex = randomInt(0, network.bins.length - 1);
    chosenBin = network.bins[binIndex];
    targetLength = network.lengths[randomInt(0, network.lengths.length - 1)];
  }
  
  // Generate random digits
  let cardNumber = chosenBin;
  while (cardNumber.length < targetLength - 1) {
    cardNumber += randomInt(0, 9).toString();
  }
  
  // Truncate if too long
  if (cardNumber.length > targetLength - 1) {
    cardNumber = cardNumber.slice(0, targetLength - 1);
  }
  
  // Calculate check digit
  const checksum = luhnChecksum(cardNumber + '0');
  const checkDigit = (10 - checksum) % 10;
  cardNumber += checkDigit.toString();
  
  return cardNumber;
}

// Generate expiry date
function generateExpiry(month: number | null, year: number | null): [string, string] {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  
  let expMonth: number;
  let expYear: number;
  
  if (month !== null && year !== null) {
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      expYear = randomInt(currentYear, currentYear + 8);
      expMonth = expYear === currentYear ? randomInt(currentMonth, 12) : randomInt(1, 12);
    } else {
      expMonth = month;
      expYear = year;
    }
  } else if (month !== null) {
    expYear = randomInt(currentYear, currentYear + 8);
    if (expYear === currentYear && month < currentMonth) {
      expMonth = randomInt(currentMonth, 12);
    } else {
      expMonth = month;
    }
  } else if (year !== null) {
    expYear = year;
    if (year === currentYear) {
      expMonth = randomInt(currentMonth, 12);
    } else {
      expMonth = randomInt(1, 12);
    }
  } else {
    expYear = randomInt(currentYear, currentYear + 8);
    expMonth = expYear === currentYear ? randomInt(currentMonth, 12) : randomInt(1, 12);
  }
  
  return [expMonth.toString().padStart(2, '0'), expYear.toString()];
}

// Generate CVV
function generateCvv(networkId: string): string {
  const network = CARD_NETWORKS[networkId];
  if (!network) throw new Error(`Unsupported network: ${networkId}`);
  
  let cvv = '';
  for (let i = 0; i < network.cvvLength; i++) {
    cvv += randomInt(0, 9).toString();
  }
  return cvv;
}

// Generate balance
function generateBalance(min: number = 100, max: number = 10000): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

// Main generate function
export function generateCards(params: GenerateParams): CardData[] {
  const cards: CardData[] = [];
  const allNetworkIds = Object.keys(CARD_NETWORKS);
  
  for (let i = 0; i < params.quantity; i++) {
    const chosenNetwork = params.network === 'random' 
      ? allNetworkIds[randomInt(0, allNetworkIds.length - 1)]
      : params.network;
    
    const cardNumber = generateCardNumber(chosenNetwork, params.binCode);
    const [month, year] = generateExpiry(params.expMonth, params.expYear);
    
    const cvv = params.includeCvv ? generateCvv(chosenNetwork) : undefined;
    const balance = params.includeBalance ? generateBalance() : undefined;
    
    const networkName = CARD_NETWORKS[chosenNetwork]?.name || 'Unknown';
    const yearShort = year.slice(2);
    const expiry = `${month}/${yearShort}`;
    const bin = cardNumber.slice(0, 6);
    
    cards.push({
      number: cardNumber,
      network: networkName,
      exp_month: month,
      exp_year: year,
      expiry,
      cvv,
      balance,
      currency: params.includeBalance ? (params.currency || 'USD') : undefined,
      bin,
    });
  }
  
  return cards;
}

// Validate card number
export function validateCard(cardNumber: string): ValidationResult {
  const cleanNumber = cardNumber.replace(/\D/g, '');
  
  if (cleanNumber.length < 13 || cleanNumber.length > 19) {
    return {
      valid: false,
      luhn_valid: false,
      network: null,
      length: cleanNumber.length,
      reason: 'Invalid card number length',
    };
  }
  
  const luhnValid = isLuhnValid(cleanNumber);
  const network = detectNetwork(cleanNumber);
  
  const valid = luhnValid && network !== null;
  let reason: string;
  if (valid) {
    reason = 'Valid';
  } else if (!luhnValid) {
    reason = 'Luhn checksum failed';
  } else {
    reason = 'Unknown card network';
  }
  
  return {
    valid,
    luhn_valid: luhnValid,
    network,
    length: cleanNumber.length,
    reason,
  };
}

// Export functions
export function exportToPipe(cards: CardData[]): string {
  return cards.map(card => {
    const parts = [card.number, card.expiry];
    if (card.cvv) parts.push(card.cvv);
    return parts.join('|');
  }).join('\n');
}

export function exportToCsv(cards: CardData[]): string {
  const header = 'number,network,exp_month,exp_year,expiry,cvv,balance,currency,bin';
  const rows = cards.map(card => 
    [card.number, card.network, card.exp_month, card.exp_year, card.expiry,
     card.cvv || '', card.balance?.toString() || '', card.currency || '', card.bin].join(',')
  );
  return [header, ...rows].join('\n');
}

export function exportToJson(cards: CardData[]): string {
  return JSON.stringify(cards, null, 2);
}

export function exportToXml(cards: CardData[]): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<cards>\n';
  for (const card of cards) {
    xml += '  <card>\n';
    xml += `    <number>${card.number}</number>\n`;
    xml += `    <network>${card.network}</network>\n`;
    xml += `    <exp_month>${card.exp_month}</exp_month>\n`;
    xml += `    <exp_year>${card.exp_year}</exp_year>\n`;
    xml += `    <expiry>${card.expiry}</expiry>\n`;
    if (card.cvv) xml += `    <cvv>${card.cvv}</cvv>\n`;
    if (card.balance) xml += `    <balance>${card.balance}</balance>\n`;
    if (card.currency) xml += `    <currency>${card.currency}</currency>\n`;
    xml += `    <bin>${card.bin}</bin>\n`;
    xml += '  </card>\n';
  }
  xml += '</cards>';
  return xml;
}

export function exportToSql(cards: CardData[], tableName: string = 'test_cards'): string {
  const lines: string[] = [];
  lines.push(`CREATE TABLE IF NOT EXISTS ${tableName} (`);
  lines.push('    number VARCHAR(20),');
  lines.push('    network VARCHAR(50),');
  lines.push('    exp_month VARCHAR(4),');
  lines.push('    exp_year VARCHAR(4),');
  lines.push('    expiry VARCHAR(10),');
  lines.push('    cvv VARCHAR(4),');
  lines.push('    balance DECIMAL(10,2),');
  lines.push('    currency VARCHAR(10),');
  lines.push('    bin VARCHAR(20)');
  lines.push(');');
  lines.push('');
  
  for (const card of cards) {
    const cvv = card.cvv ? `'${card.cvv}'` : 'NULL';
    const balance = card.balance?.toString() || 'NULL';
    const currency = card.currency ? `'${card.currency}'` : 'NULL';
    lines.push(`INSERT INTO ${tableName} (number, network, exp_month, exp_year, expiry, cvv, balance, currency, bin) VALUES ('${card.number}', '${card.network}', '${card.exp_month}', '${card.exp_year}', '${card.expiry}', ${cvv}, ${balance}, ${currency}, '${card.bin}');`);
  }
  
  return lines.join('\n');
}

export function exportToCard(cards: CardData[]): string {
  return cards.map((card, i) => {
    const lines = [
      `🔖 Card #${i + 1}`,
      `💳 Number: ${card.number}`,
      `🌐 Network: ${card.network}`,
      `📅 Expiry: ${card.expiry}`,
    ];
    if (card.cvv) lines.push(`🔒 CVV: ${card.cvv}`);
    if (card.balance) lines.push(`💰 Balance: ${card.balance} ${card.currency || 'USD'}`);
    lines.push('─'.repeat(40));
    return lines.join('\n');
  }).join('\n');
}

export function getNetworks(): { id: string; name: string }[] {
  return Object.entries(CARD_NETWORKS).map(([id, net]) => ({ id, name: net.name }));
}

export function getCurrencies(): [string, string][] {
  return CURRENCIES;
}

export function getCurrentYear(): number {
  return new Date().getFullYear();
}

export function getYearOptions(count: number = 9): number[] {
  const currentYear = getCurrentYear();
  return Array.from({ length: count }, (_, i) => currentYear + i);
}

export type ExportFormat = 'CARD' | 'PIPE' | 'CSV' | 'JSON' | 'XML' | 'SQL';

export function exportCards(cards: CardData[], format: ExportFormat): string {
  switch (format) {
    case 'PIPE': return exportToPipe(cards);
    case 'CSV': return exportToCsv(cards);
    case 'JSON': return exportToJson(cards);
    case 'XML': return exportToXml(cards);
    case 'SQL': return exportToSql(cards);
    case 'CARD': return exportToCard(cards);
    default: throw new Error(`Unsupported format: ${format}`);
  }
}
