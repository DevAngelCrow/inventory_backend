import fs from 'fs';
import readline from 'readline';

const stream = fs.createReadStream('allCountries.txt');

const rl = readline.createInterface({
  input: stream,
  crlfDelay: Infinity,
});

const admin3Stream = fs.createWriteStream('admin3.txt');
const admin4Stream = fs.createWriteStream('admin4.txt');

// headers (opcional pero útil)
admin3Stream.write('country\tadmin1\tadmin2\tadmin3\tname\n');
admin4Stream.write('country\tadmin1\tadmin2\tadmin3\tadmin4\tname\n');
void (async () => {
  for await (const line of rl) {
    const cols = line.split('\t');

    const featureCode = cols[7];

    // columnas correctas
    const country = cols[8];
    const admin1 = cols[10];
    const admin2 = cols[11];
    const admin3 = cols[12];
    const admin4 = cols[13];
    const name = cols[1];

    if (featureCode === 'ADM3') {
      admin3Stream.write(
        `${country}\t${admin1}\t${admin2}\t${admin3}\t${name}\n`,
      );
    }

    if (featureCode === 'ADM4') {
      admin4Stream.write(
        `${country}\t${admin1}\t${admin2}\t${admin3}\t${admin4}\t${name}\n`,
      );
    }
  }

  admin3Stream.end();
  admin4Stream.end();

  console.log('admin3.txt y admin4.txt generados');
})();
