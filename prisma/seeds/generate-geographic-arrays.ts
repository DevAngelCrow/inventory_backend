// import fs from 'fs'
// import path from 'path'
// import { fileURLToPath } from 'url'

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

// function read(file: string) {
//   return fs
//     .readFileSync(path.join(__dirname, file), 'utf8')
//     .split(/\r?\n/)
//     .filter(Boolean)
// }


// // ================= FILTRO DE PAISES =================
// const COUNTRIES = ['SV', 'US']

// // ================= ADMIN 1 =================
// const admin1 = read('Admin1codes.txt')
//   .map(line => {
//     const cols = line.split('\t')
//     const [country, a1] = cols[0].split('.')
//     return {
//       country,
//       a1,
//       name: cols[2],
//     }
//   })
//   .filter(row => COUNTRIES.includes(row.country))

// // ================= ADMIN 2 =================
// const admin2 = read('Admin2codes.txt')
//   .map(line => {
//     const cols = line.split('\t')
//     const [country, a1, a2] = cols[0].split('.')
//     return {
//       country,
//       a1,
//       a2,
//       name: cols[2],
//     }
//   })
//   .filter(row => COUNTRIES.includes(row.country))

// // ================= ADMIN 3 =================
// const admin3 = read('admin3.txt')
//   .slice(1)
//   .map(line => {
//     const cols = line.split('\t')
//     return {
//       country: cols[0],
//       a1: cols[1],
//       a2: cols[2],
//       a3: cols[3],
//       name: cols[4],
//     }
//   })
//   .filter(row => COUNTRIES.includes(row.country))

// // ================= ADMIN 4 =================
// const admin4 = read('admin4.txt')
//   .slice(1)
//   .map(line => {
//     const cols = line.split('\t')
//     return {
//       country: cols[0],
//       a1: cols[1],
//       a2: cols[2],
//       a3: cols[3],
//       a4: cols[4],
//       name: cols[5],
//     }
//   })
//   .filter(row => COUNTRIES.includes(row.country))

// // ================= WRITE FILE =================

// const output = `
// // AUTO-GENERATED FILE

// export const ADMIN1 = ${JSON.stringify(admin1, null, 2)}

// export const ADMIN2 = ${JSON.stringify(admin2, null, 2)}

// export const ADMIN3 = ${JSON.stringify(admin3, null, 2)}

// export const ADMIN4 = ${JSON.stringify(admin4, null, 2)}
// `

// fs.writeFileSync(
//   path.join(__dirname, 'geographic-arrays.ts'),
//   output
// )

// console.log('geographic-arrays.ts generado')