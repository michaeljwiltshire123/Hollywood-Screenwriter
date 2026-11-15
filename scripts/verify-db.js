// scripts/verify-db.js
// Storage and IndexedDB state alignment verification script
import fs from 'fs';
import path from 'path';

console.log('--- Screenwriter Storage & IndexedDB Verification ---');

const dbFile = path.resolve(process.cwd(), 'src/lib/dbPersistence.ts');
if (!fs.existsSync(dbFile)) {
  console.error('FAIL: src/lib/dbPersistence.ts not found');
  process.exit(1);
}

const content = fs.readFileSync(dbFile, 'utf8');

const checks = [
  { label: 'Database Name (screenwriter_db)', pass: content.includes("'screenwriter_db'") },
  { label: 'Store Name (scripts)', pass: content.includes("'scripts'") },
  { label: 'Primary Key (active_script)', pass: content.includes("'active_script'") },
  { label: 'LocalStorage Backup (screenwriter_active_script)', pass: content.includes("'screenwriter_active_script'") },
  { label: 'Transaction readwrite handler', pass: content.includes("'readwrite'") },
  { label: 'Transaction readonly handler', pass: content.includes("'readonly'") }
];

let allPassed = true;
checks.forEach((c) => {
  if (c.pass) {
    console.log(`✓ PASS: ${c.label}`);
  } else {
    console.error(`✗ FAIL: ${c.label}`);
    allPassed = false;
  }
});

if (!allPassed) {
  console.error('Storage schema verification failed!');
  process.exit(1);
}

console.log('All IndexedDB and session persistence assertions passed successfully.');
