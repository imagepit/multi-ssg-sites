#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const API_DIR = path.join(__dirname, '..', 'src', 'app', 'api', 'search')
const ROUTE_FILE = path.join(API_DIR, 'route.ts')
const DEV_FILE = path.join(API_DIR, 'route.dev.ts')

const isSSGExport = process.env.SSG_EXPORT === '1'
if (!fs.existsSync(API_DIR)) fs.mkdirSync(API_DIR, { recursive: true })

if (isSSGExport) {
  if (fs.existsSync(ROUTE_FILE)) fs.unlinkSync(ROUTE_FILE)
  console.log('[manage-api-route] SSG mode: Disabling API route')
} else {
  if (fs.existsSync(DEV_FILE) && !fs.existsSync(ROUTE_FILE)) {
    fs.copyFileSync(DEV_FILE, ROUTE_FILE)
    console.log('[manage-api-route] Dev mode: Enabling API route')
  }
}

