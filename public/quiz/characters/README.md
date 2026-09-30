# Secret Images

Place your secret images here for the quiz game.

## Instructions

1. Add your image file to this directory (e.g., `mystery-person.jpg`)
2. Update the `secretImage` path in `/data/quizData.ts`
3. Supported formats: JPG, PNG, WebP, GIF

## Example

```
/public/quiz/characters/
  ├── celebrity-1.jpg
  ├── celebrity-2.png
  └── mystery-person.jpg
```

Then in `/data/quizData.ts`:
```typescript
secretImage: '/quiz/characters/celebrity-1.jpg'
```

## Default Image

For testing, you can use any placeholder image. The game will work with any image you place here.
