import fs from 'fs';
import readline from 'readline';
import { randomUUID } from 'crypto';

const stream = fs.createReadStream('PAISES.txt');

const rl = readline.createInterface({
  input: stream,
  crlfDelay: Infinity,
});

const countries: any[] = [];

void (async () => {
  for await (const line of rl) {
    if (!line || line.startsWith('#')) continue;

    const cols = line.split('\t');

    countries.push({
      id: randomUUID(),
      name: cols[4],
      iso2: cols[0],
      abbreviation: cols[1],
      code: cols[2],
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    });
  }

  // imprime como JSON formateado para copiar
  console.log(JSON.stringify(countries, null, 2));
})();
