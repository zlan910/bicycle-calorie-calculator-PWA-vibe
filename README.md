# Bicycle Calorie Calculator PWA

An offline-first, installable Progressive Web App port of the 1997 Bicycle Ride Calorie Calculator by Greg Kondrasuk. The calculation logic in `calculator.js` is a direct JavaScript translation of the legacy calculator engine.

## Run locally

On Windows, right-click `start.ps1` and choose **Run with PowerShell**, or run:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\start.ps1
```

Alternatively, run `npx serve .`, then open the displayed URL in Chrome. On Android, use Chrome’s **Install app** option. HTTPS (or `localhost` during development) is required for offline installation.

## Verify

```sh
npm test
```

## License

GPL-2.0-or-later. This repository retains the original GPLv2 text in `COPYING.txt`; preserve the copyright notices and complete source when distributing the app.
