# 🏏 Gully Cricket Score Board

A modern, mobile-first web application for tracking gully cricket matches in real-time. Maintains live scores for both teams and individual players with comprehensive statistics.

## ✨ Features

### Team & Player Tracking
- **Real-time scorekeeping** – Track runs, balls faced, and strike rate for every batsman
- **Bowler statistics** – Total overs bowled, maidens, runs conceded, economy rate
- **Two-innings support** – Full match management with innings switching
- **Wicket tracking** – Record wickets with type (bowled, caught, LBW, run out, etc.)

### Match Management
- **Team selection** – Custom team creation and player assignment
- **Innings transition** – Smooth switch between batting sides
- **Winning indicator** – Real-time winning hints for the 2nd innings team
- **Match completion** – Final score summary with match winner announcement

## 📸 Screenshots

| Select Teams | Overs Tracker | Who is Batting |
|:---:|:---:|:---:|
| ![Select Teams](public/images/1.PNG) | ![Overs](public/images/2.PNG) | ![Who is Batting](public/images/3.PNG) |

| Wicket Type | 2nd Innings Hint | Match Won |
|:---:|:---:|:---:|
| ![Wicket Type](public/images/4.PNG) | ![Winning Hint](public/images/5.PNG) | ![Match Won](public/images/6.PNG) |

| Final Score Board |
|:---:|
| ![Score Board](public/images/7.PNG) |

## 🚀 Live Demo

Try it live: [gully-cricket.netlify.app](https://gully-cricket.netlify.app/)

> **Tip:** Best experienced on a mobile or phone browser!

## ⚠️ Important Note

Match data is stored in memory (React state). **Do not refresh the page** during a match, or all progress will be lost. For persistent access, download the Android app from the [Releases](https://github.com/Thishyaketh/gully-cricket-score-board/releases) section.

## 🛠️ Tech Stack

| Category | Technology |
|:---|:---|
| **Framework** | React 17 (Create React App) |
| **UI Library** | Material-UI v5 + Emotion |
| **Icons** | @mui/icons-material |
| **Routing** | React Router DOM v5 |
| **Form Handling** | Formik + Yup validation |
| **Deployment** | Netlify |

## 📦 Getting Started

### Prerequisites
- Node.js >= 14.x
- npm or yarn

### Installation

```bash
git clone https://github.com/Thishyaketh/gully-cricket-score-board.git
cd gully-cricket-score-board
npm install
```

### Running Locally

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000). Edit files to see hot-reloaded updates.

## 📜 Available Scripts

| Script | Description |
|:---|:---|
| `npm start` | Starts the development server on localhost:3000 |
| `npm test` | Launches the Jest test runner in watch mode |
| `npm run build` | Builds the production bundle into the `build/` folder |
| `npm run eject` | Ejects from Create React App (irreversible) |

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Made with ❤️ for gully cricket enthusiasts everywhere! 🏏