# Bicycle Calorie Calculator PWA

An offline-first, installable Progressive Web App port of the 1997 Bicycle Ride Calorie Calculator by Greg Kondrasuk. The calculation logic in `calculator.js` is a direct JavaScript translation of the legacy calculator engine.

Hosted on Github here: https://zlan910.github.io/bicycle-calorie-calculator-PWA-vibe/

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

### Icon attribution

The bicycle and flame paths in `icons/bicycle_cals.svg` are adapted from [Lucide Icons](https://lucide.dev/), licensed under the ISC License. A copy of that license is included in `icons/LICENSE-lucide.txt`.
