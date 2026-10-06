# Persona Life

https://personalife.netlify.app/

A Persona 5-inspired productivity tracker that turns everyday self-improvement into a game.

Persona Life lets you complete real-life activities to earn XP, increase your social stats, set personal goals, and track your progress through an interface inspired by _Persona 5_.

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

Flexible mode (default) lets you log activities whenever you complete them in real life. Settings also offers Persona mode, which allows one action per local date and time block. Undo Last Activity restores its previous XP and rank.

---

### Social Stat Visualisation

The Stats page displays progress using a five-point radar/star chart based on the Persona social stats screen.

Each stat has five named ranks.

For example, Knowledge progresses through:

`Oblivious → Learned → Scholarly → Encyclopedic → Erudite`

The chart automatically changes shape as each stat increases.

---

### Missions & Goals

New missions have two types:

- **Reward mission:** Choose a stat and a reward of 15, 30, 50, or 100 XP. Mark complete after finishing the goal to claim XP once. Reward missions cannot be reopened; deleting them does not revoke earned XP. Rewards do not use Persona time-block actions.

- **Stat target:** Clears immediately when the selected stat reaches the target rank. Existing missions use this type. Undoing XP can make a target active again if its required rank is no longer met.

Deadlines are optional reminders. You never have to wait for a deadline to clear a mission. Overdue missions stay available and can still be completed. Stat targets award no additional XP. Older saved tasks are preserved, but new tasks cannot be created. Activities and reward missions increase stats.

The deadline tracker shows the earliest uncleared dated mission, including overdue missions.

---

### Persistent Progress

Progress is automatically stored in the browser using `localStorage`.

This includes:

- Social stat ranks
- XP
- Custom activities
- Goals
- Current activity state and its undo snapshot

Existing saved stats, activities, and valid goals are migrated automatically. Old action locks without a date are cleared once during migration.

Refreshing or reopening the application therefore keeps the user's existing progress without requiring an account or backend.

---

## Tech Stack

- **React**
- **JavaScript**
- **Vite**
- **React Router**
- **Motion for React** for page transitions, activity interactions, form reveals, and rank-up feedback
- **Lucide React** for consistent interface icons
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

This is a fan-made project inspired by the user interface and progression systems of the _Persona_ series.

It is not affiliated with or endorsed by Atlus or SEGA.

## Interface

The responsive interface uses a desktop command sidebar and mobile bottom navigation, a red/black/paper palette, cutout headings, and a gold social-stat profile. Motion effects respect the system reduced-motion preference. All activity and mission controls support keyboard navigation.

### Background settings

Settings offers a background color, a custom image upload (JPG, PNG, WebP, GIF, or AVIF, up to 20 MB), and an image shade control. Images are saved in IndexedDB in the current browser; color, shade, and activity mode are saved in localStorage. Removing the image restores the selected color. The default is red, with black-outlined interface panels.

### Sound effects

Original synthesized cues accompany menu interactions, navigation, activity XP, mission rewards, undo, and rank-ups. Sound starts only after an interaction. Settings includes a saved mute toggle and volume slider; no audio files are downloaded.

## Code style

Run `npm run format` to format source code, styles, tests, configuration, and documentation with Prettier. Run `npm run format:check` to verify formatting without changing files. The shared configuration uses two-space indentation, double quotes, semicolons, and an 80-column target. EditorConfig applies the same indentation and line-ending conventions in compatible editors.

Before submitting changes, run `npm run format:check`, `npm run lint`, `npm test`, and `npm run build`.
