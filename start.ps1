# Starts the Bicycle Calorie Calculator PWA from this script directory.
# Requires Node.js; npx runs the lightweight static server.

$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot

if (-not (Get-Command npx -ErrorAction SilentlyContinue)) {
    throw 'Node.js (including npx) is required. Install it from https://nodejs.org/ and try again.'
}

Write-Host 'Starting Bicycle Calorie Calculator at http://localhost:3000'
Write-Host 'Press Ctrl+C to stop the server.'
npx serve .
