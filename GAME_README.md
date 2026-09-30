# WHO IS THIS? 🎮

An energetic English presentation warm-up game designed for classroom use with projector display.

## Features ✨

- **4×4 Puzzle Grid**: Secret image revealed tile by tile
- **4 Groups**: Turn-based gameplay rotating through Groups 1-4
- **16 English Questions**: Pre-loaded with vocabulary and presentation skills questions
- **Random Rewards**: Points, Free Pass, Double Next, Open Extra Tile
- **Lucky Wheel**: Unlocks after revealing all tiles with two spins
  - Spin 1: Clapping Hand (everyone claps!)
  - Spin 2: Big Chest → Bigger Clapping Hand reward
- **Animated UI**: Framer Motion animations, particle effects, celebrations
- **Sound Effects**: Web Audio API generated sounds
- **Single Screen**: No separate presenter dashboard needed

## Tech Stack 🛠

- **Next.js 16** with App Router
- **React 19** with TypeScript (strict mode)
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Web Audio API** for sound effects
- **Client-side only** - no backend required

## Getting Started 🚀

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## How to Use 📖

### Setup Phase

1. **Upload Secret Image**: Choose an image that will be hidden behind the puzzle
2. **Load Questions**: Default questions are pre-loaded, or import custom JSON
3. **Start Game**: Begin the presentation warm-up

### Gameplay

1. **Turn Rotation**: Groups take turns (1 → 2 → 3 → 4 → 1...)
2. **Select Tile**: Current group clicks a puzzle tile
3. **Answer Question**: Choose A, B, C, or D
4. **Get Reward**: Correct answers earn random rewards
5. **Reveal Tile**: Tile opens to show part of the secret image
6. **Continue**: Next group's turn

### Scoring

- **Correct Answer**: Random reward (points, free pass, etc.)
- **Wrong Answer**: -10 points, tile still opens
- **Points can go negative**
- **Rewards**:
  - +10, +20, +30, +50 points
  - -10, -20 points
  - Free Pass (skip one question)
  - Double Next (next reward ×2)
  - Open Extra (reveal bonus tile)

### Lucky Wheel

- **Locked** until presenter clicks "OPEN ALL"
- **First Spin**: Clapping Hand → everyone claps
- **Second Spin**: Big Chest → Bigger Clapping Hand celebration

### Controls

- **OPEN ALL**: Reveals all tiles and unlocks Lucky Wheel (anytime)
- **RESET**: Restart the game with new setup
- **Sound Toggle**: Mute/unmute sound effects (top right)

## Customization 🎨

### Custom Questions

Edit `data/questions.json` or use the Import/Export feature:

```json
[
  {
    "id": 1,
    "question": "Your question here?",
    "options": {
      "A": "Option A",
      "B": "Option B",
      "C": "Option C",
      "D": "Option D"
    },
    "correctAnswer": "A"
  }
]
```

**Requirements**:
- Exactly 16 questions
- All options (A, B, C, D) must be present
- correctAnswer must be "A", "B", "C", or "D"

### Audio Files

Sound effects are generated via Web Audio API. To add custom audio:

1. Create `/public/audio/` folder
2. Add audio files (.mp3, .wav)
3. Update `lib/audio.ts` to load custom sounds

## Project Structure 📁

```
game/
├── app/
│   ├── page.tsx          # Main game component
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── SetupScreen.tsx         # Initial setup screen
│   ├── PuzzleGrid.tsx          # 4×4 puzzle board
│   ├── QuestionModal.tsx       # Question display
│   ├── RewardModal.tsx         # Reward animation
│   ├── ScoreBoard.tsx          # Group scores
│   ├── LuckyWheel.tsx          # Lucky wheel component
│   ├── ChestReward.tsx         # Big chest opening
│   ├── CelebrationModal.tsx    # Wheel result celebration
│   ├── AudioControls.tsx       # Sound toggle
│   └── GameControls.tsx        # Open All & Reset
├── lib/
│   ├── types.ts          # TypeScript interfaces
│   ├── gameUtils.ts      # Game logic utilities
│   └── audio.ts          # Sound effects system
├── data/
│   └── questions.json    # Default questions
└── public/
    └── audio/            # (Optional) Custom audio files
```

## Design Principles 🎯

- **Large Typography**: Easy to read from projector
- **High Contrast**: Clear visibility in classroom
- **Single Screen**: No separate dashboards
- **Fast Interactions**: Quick gameplay flow
- **Energetic Animations**: Game show feel
- **No Backend**: Everything runs in browser
- **16:9 Optimized**: Desktop/projector priority

## Browser Support 🌐

- Chrome/Edge (recommended)
- Firefox
- Safari

Requires modern browser with Web Audio API support.

## Tips for Presenters 💡

1. **Test Before Class**: Upload image and verify questions
2. **Full Screen**: Use F11 for immersive experience
3. **Sound Check**: Ensure audio works on projector
4. **Backup Plan**: Export questions JSON as backup
5. **Engagement**: Encourage loud clapping on Clapping Hand rewards

## Troubleshooting 🔧

**Image not showing?**
- Check file format (JPG, PNG, WebP supported)
- Ensure image loads fully before starting

**No sound?**
- Click anywhere to initialize audio context
- Check browser audio permissions
- Use audio toggle button

**Build errors?**
- Run `npm install` to ensure dependencies
- Clear `.next` folder and rebuild
- Check Node.js version (18+ recommended)

## License

MIT License - feel free to use in your classroom!

---

**Have fun and break the ice!** 🎉
