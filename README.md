# Expense Tracker

![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/wemiibidun/expense-tracker)
![GitHub languages count](https://img.shields.io/github/languages/count/wemiibidun/expense-tracker)
[![Website shields.io](https://img.shields.io/website-up-down-green-red/http/shields.io.svg)](https://wemiibidun.github.io/expense-tracker/)

## Table of contents
* [Introduction](#introduction)
* [Screenshot](#screenshot)
* [Technologies](#technologies)
* [Features](#features)
* [Deployment (Vite + GitHub Pages)](#deployment-vite--github-pages)
* [Link to Published Project](#link-to-published-project)
* [Status](#status)
* [Contact](#contact)

## Introduction
A clean expense tracker built with React and Vite. Add income and expenses, filter by type or category, and see your balance update instantly. All data is saved locally in the browser, so you can pick up right where you left off.

## Screenshot
![Expense tracker preview](public/preview.png)

## Technologies
![React](https://img.shields.io/badge/React-239120?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-239120?style=for-the-badge&logo=vite&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-239120?&style=for-the-badge&logo=css3&logoColor=white)

* React — component-based UI, state management, and interactive form handling
* Vite — fast dev server, optimized build output, and GitHub Pages deployment
* CSS — responsive layout, card styling, and chart visuals

## Features
* Add income and expenses with categories and dates
* Search and filter transactions by type or category
* Live balance, income, and expense totals
* Category breakdown chart for top spending areas
* Local storage persistence (no account needed)

## Deployment (Vite + GitHub Pages)
1. Set the base path in `vite.config.js`:
   * `base: "/expense-tracker/"`
2. Install the deploy tool:
   * `npm install --save-dev gh-pages`
3. Add scripts in `package.json`:
   * `"predeploy": "npm run build"`
   * `"deploy": "gh-pages -d dist"`
4. Deploy:
   * `npm run deploy`
5. In GitHub: **Settings → Pages** → Source: **Deploy from a branch** → **gh-pages** → **/ (root)**.

## Link to Published Project
[Expense Tracker Webpage](https://wemiibidun.github.io/expense-tracker/)

## Status
Project is: _Complete_

## Contact
Created by [@wemiibidun](https://github.com/wemiibidun)
