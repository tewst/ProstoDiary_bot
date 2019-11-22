# ProstoDiary
[![Build Status](https://travis-ci.org/gotois/ProstoDiary_bot.svg?branch=master)](https://travis-ci.org/gotois/ProstoDiary_bot)
[![dependencies Status](https://david-dm.org/gotois/ProstoDiary_bot/status.svg)](https://david-dm.org/gotois/ProstoDiary_bot)
[![devDependencies Status](https://david-dm.org/gotois/ProstoDiary_bot/dev-status.svg)](https://david-dm.org/gotois/ProstoDiary_bot?type=dev)
[![Known Vulnerabilities](https://snyk.io/test/github/gotois/ProstoDiary_bot/badge.svg)](https://snyk.io/test/github/gotois/ProstoDiary_bot)
[![codecov](https://codecov.io/gh/gotois/ProstoDiary_bot/branch/master/graph/badge.svg)](https://codecov.io/gh/gotois/ProstoDiary_bot)
[![Maintainability](https://api.codeclimate.com/v1/badges/709ebb5f0eae1d062e5e/maintainability)](https://codeclimate.com/github/gotois/ProstoDiary_bot/maintainability)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/gotois/ProstoDiary_bot.svg?style=popout)
![GitHub repo size](https://img.shields.io/github/repo-size/gotois/ProstoDiary_bot.svg)
[![GitHub commit activity](https://img.shields.io/github/commit-activity/m/gotois/ProstoDiary_bot.svg)](https://github.com/gotois/ProstoDiary_bot/commits/master)
[![Website](https://img.shields.io/website/https/prosto-diary.gotointeractive.com.svg?link=https://prosto-diary.gotointeractive.com)](https://prosto-diary.gotointeractive.com)
[![GitHub](https://img.shields.io/github/license/gotois/ProstoDiary_bot.svg)](https://github.com/gotois/ProstoDiary_bot/blob/master/LICENSE)
[![sketchboard](https://img.shields.io/badge/sketchboard.me-orange.svg?link=https://gallery.sketchboard.me/team/tm_XjeyfGQC?s=TBE23WvgfgAg&style=flat&label=Schemes)](https://gallery.sketchboard.me/team/tm_XjeyfGQC?s=TBE23WvgfgAg)
[![Trello](https://img.shields.io/badge/trello-black.svg?style=flat&label=community)](https://trello.com/gotois)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-green.svg?style=flat&label=docs)](https://prosto-diary.gotointeractive.com/openapi.json)
[![Issuehunt](https://img.shields.io/badge/issuehunt.io-blueviolet.svg?link=https://issuehunt.io/r/gotois/ProstoDiary_bot&style=flat&label=jobs)](https://issuehunt.io/r/gotois/ProstoDiary_bot)

## About
Virtual trackers: text diary, email listener, food analyze, health watcher, sleep analyze

Install
---
```
brew install git-lfs
git lfs clone git@github.com:gotois/ProstoDiary_bot.git
chmod +x scripts/index
npm i
```

## Tests

### Unit
#### Checking Unit tests
```bash
npm run unit
```

### E2E
#### Match files

Example:
```
npm run e2e:fast -- --match='/start'
```

Example match titles starting with API:
```
npm run e2e -- --match='API:*'
```

Run
---
### Development
```bash
npm run dev
```

### Production Telegram Bot
```bash
npm start
```

### CRON: запуск считывателя письма
```bash
npm run start:vzor
```

Tools
---
#### Package upgrade
```bash
npx ncu -u
```

#### Fix lint
```bash
npm run lint -- --fix
```

#### docs
#### Install
```
sudo gem install bundler jekyll
cd docs
bundle install
```
#### Run
```
npm run docs:serve
```

Run Telegram Bot
---
```
/start
```