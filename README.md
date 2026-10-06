# Persona Life

A Persona 5-inspired productivity tracker that turns everyday self-improvement into a game.

Persona Life lets you complete real-life activities to earn XP, increase your social stats, set personal goals, and track your progress through an interface inspired by *Persona 5*.

Instead of treating productivity as a checklist, the project gamifies it by turning activities such as studying, exercising, practising a skill, or completing personal tasks into progress across five different stats.

## Features

### Social Stat System

Track five Persona-inspired social stats:

- 🎓 **Knowledge**
- 👊 **Guts**
- 🛠️ **Proficiency**
- 🍀 **Kindness**
- 💋 **Charm**

Each stat begins at Rank 1 and gains XP when you complete an associated activity.

Once enough XP is earned, the stat ranks up, with a maximum rank of 5.

Rank-up animations and XP feedback make progress feel more like a game than a traditional productivity tracker.

---

### Daily Activities

The Daily page contains activities that can be completed to gain XP.

Example activities include:

- Study at Library → Knowledge
- Burger Challenge → Guts
- Craft Tools → Proficiency
- Clean Leblanc → Kindness
- Work at Diner → Charm

Users can also create their own activities and choose which social stat they contribute towards.

Activities can be deleted and customised, allowing the tracker to reflect the user's actual routine.

---

### Persona-Style Time System

The application uses the user's real local time to determine the current time period.

The day is divided into:

- Morning
- Lunch
- After School
- Evening
- Night
- Late Night

The current date, weekday, and time period are displayed through a Persona-inspired calendar interface.

To imitate Persona's limited daily activity system, an activity can only be performed once during the current time block.

---

### Social Stat Visualisation

The Stats page displays progress using a five-point radar/star chart based on the Persona social stats screen.

Each stat has five named ranks.

For example, Knowledge progresses through:

`Oblivious → Learned → Scholarly → Encyclopedic → Erudite`

The chart automatically changes shape as each stat increases.

---

### Missions & Goals

Users can create personal missions with:

- A title
- A deadline
- A required social stat
- A target rank

For example:

> Reach Knowledge Rank 3 before an exam.

Each mission displays the required stat level and current progress.

Completed requirements are marked as cleared, while unfinished missions show how many ranks are still required.

The nearest upcoming mission is also displayed as a deadline tracker.

---

### Persistent Progress

Progress is automatically stored in the browser using `localStorage`.

This includes:

- Social stat ranks
- XP
- Custom activities
- Goals
- Current activity state

Refreshing or reopening the application therefore keeps the user's existing progress without requiring an account or backend.

---

## Tech Stack

- **React**
- **JavaScript**
- **Vite**
- **React Router**
- **HTML / CSS**
- **Browser LocalStorage**
- **SVG** for the social stat visualisation

The project is entirely client-side and does not currently require a backend or database.

---

## Project Structure

```text
persona-life/
├── public/
├── src/
│   ├── components/
│   │   ├── ActivityCreator.jsx
│   │   ├── Calendar.jsx
│   │   ├── DeadlineTracker.jsx
│   │   ├── GoalCreator.jsx
│   │   ├── NavBar.jsx
│   │   ├── RankUpPopup.jsx
│   │   ├── StatsStar.jsx
│   │   └── XPFeedback.jsx
│   │
│   ├── data/
│   │   ├── activities.js
│   │   ├── goals.js
│   │   └── stats.js
│   │
│   ├── pages/
│   │   ├── Daily.jsx
│   │   ├── Goals.jsx
│   │   └── Stats.jsx
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
├── vite.config.js
└── README.md
```

---

## Pages

### Daily

The main gameplay screen.

Complete or create activities to gain XP towards a selected social stat.

### Stats

Displays the current five social stats using a dynamic Persona-inspired stat chart.

### Goals

Create missions with deadlines and stat requirements and monitor progress towards completing them.

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/lurin4/persona-life.git
cd persona-life
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Vite will provide a local development URL which can be opened in your browser.

---

## Available Scripts

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run preview
```

Previews the production build locally.

```bash
npm run lint
```

Runs ESLint across the project.

---

## How Progression Works

Each activity is associated with one of the five social stats.

Completing an activity grants XP to that stat.

```text
Complete Activity
       ↓
Gain XP
       ↓
Reach 100 XP
       ↓
Rank Up
       ↓
Improve Social Stat
       ↓
Progress Towards Missions
```

XP exceeding the threshold contributes toward a new rank until the maximum rank of 5 is reached.

---

## Motivation

Persona Life was created to experiment with combining **game mechanics and productivity**.

The Persona series makes everyday actions such as studying, working, socialising, and improving skills feel meaningful because they contribute to visible character progression.

This project applies that same idea to real life: everyday activities become actions that gradually improve a personal character profile.

---

## Future Ideas

Possible additions include:

- Daily activity history
- Streak tracking
- Achievements
- More detailed XP balancing
- Mission rewards
- Activity statistics
- Custom social stats
- User profiles
- Cloud syncing
- Responsive mobile improvements
- Calendar planning
- More Persona-inspired animations and UI effects

---

## Disclaimer

This is a fan-made project inspired by the user interface and progression systems of the *Persona* series.

It is not affiliated with or endorsed by Atlus or SEGA.
