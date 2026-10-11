#!/usr/bin/env node
// Usage: node scripts/add-guests.mjs guests.txt --base-url https://example.com [--remote]
// guests.txt: one guest name per line. Writes links.csv and inserts rows into D1.
import { randomBytes } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--") && a !== args[args.indexOf("--base-url") + 1]);
const baseUrl = (args[args.indexOf("--base-url") + 1] || "").replace(/\/$/, "");
const remote = args.includes("--remote");
if (!file || !baseUrl) {
  console.error("Usage: add-guests.mjs <names-file> --base-url <url> [--remote]");
  process.exit(1);
}

const names = readFileSync(file, "utf8").split("\n").map((l) => l.trim()).filter(Boolean);
const guests = names.map((name) => ({ name, token: randomBytes(16).toString("base64url") }));

const esc = (s) => "'" + s.replaceAll("'", "''") + "'";
const sql = guests.map((g) => `INSERT INTO guests (token, name) VALUES (${esc(g.token)}, ${esc(g.name)});`).join("\n");
const sqlFile = "guests.sql";
writeFileSync(sqlFile, sql + "\n");

const csv = ["name,url", ...guests.map((g) => `"${g.name.replaceAll('"', '""')}",${baseUrl}/?g=${g.token}`)];
writeFileSync("links.csv", csv.join("\n") + "\n");

execFileSync("npx", ["wrangler", "d1", "execute", "DB", "--file", sqlFile, remote ? "--remote" : "--local"], { stdio: "inherit" });
console.log(`Added ${guests.length} guests. Links written to links.csv`);
