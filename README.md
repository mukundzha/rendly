# Rendly - Code-First Video Creation Tool

<p align="center">
  <strong>Rendly</strong> is a powerful code-first video creation tool that lets you create stunning videos using a simple DSL (Domain Specific Language). Write code, preview in real-time, and export professional videos.
</p>

<p align="center">
  <a href="https://rendly.app">
    <img src="https://img.shields.io/badge/Live Demo-rendly.app-orange?style=for-the-badge" alt="Live Demo" />
  </a>
  <a href="https://github.com/mukundzha/rendly">
    <img src="https://img.shields.io/badge/GitHub-mukundzha/rendly-black?style=for-the-badge" alt="GitHub" />
  </a>
  <a href="https://vercel.com">
    <img src="https://img.shields.io/badge/Deployed on-Vercel-black?style=for-the-badge" alt="Vercel" />
  </a>
</p>

---

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [How It Works](#how-it-works)
- [DSL Reference](#dsl-reference)
  - [Commands](#commands)
  - [Animations](#animations)
  - [Shapes](#shapes)
- [Creating Multiple Scenes](#creating-multiple-scenes)
- [Example Projects](#example-projects)
- [Tech Stack](#tech-stack)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Features

- **Code-First Video Creation**: Write simple DSL code to create professional videos
- **Real-Time Preview**: See your changes instantly in the preview panel
- **Multiple Scenes**: Create complex videos with multiple scenes
- **Custom Animations**: Add fade, slide, pop, and bounce animations
- **Custom Fonts**: Use any font family for your text
- **Custom Colors**: Set any color for text and backgrounds
- **Video Export**: Export your videos in WebM format
- **Open Source**: Free and open source under MIT license

---

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/mukundzha/rendly.git
cd rendly
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Start the development server**

```bash
npm run dev
```

4. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

---

## How It Works

Rendly uses a simple DSL (Domain Specific Language) to define video scenes. Each scene consists of:

- **TEXT**: The content to display on screen
- **FONT**: The font family to use
- **SIZE**: The font size in pixels
- **COLOR**: The text color (hex or named color)
- **BACKGROUND**: The background color
- **ANIMATION**: The entrance animation
- **DURATION**: How long the scene lasts

### Basic Example

```dsl
TEXT "Hello World"
FONT Inter
SIZE 64
COLOR #FF4D00
BACKGROUND #FFFFFF
ANIMATION fade in
DURATION 1.5s
```

---

## DSL Reference

### Commands

| Command | Description | Example |
|---------|-------------|---------|
| `TEXT` | Display text on screen | `TEXT "Hello World"` |
| `SHAPE` | Add a geometric shape | `SHAPE circle` |
| `FONT` | Set font family | `FONT Inter` |
| `SIZE` | Font size in pixels | `SIZE 48` |
| `COLOR` | Text or shape color | `COLOR #FF4D00` |
| `BACKGROUND` | Canvas background | `BACKGROUND #000000` |
| `ANIMATION` | Animation type | `ANIMATION fade in` |
| `DURATION` | Scene duration | `DURATION 1.5s` |

### Animations

| Animation | Description |
|-----------|-------------|
| `fade in` | Fade in from transparent (default) |
| `slide up` | Slide up from bottom |
| `pop` | Pop in with scale effect |
| `bounce` | Bounce in from top |

### Shapes

| Shape | Description |
|-------|-------------|
| `circle` | Circle shape |
| `square` | Square shape |
| `rect` | Rectangle shape |
| `diamond` | Diamond/rotated square |

---

## Creating Multiple Scenes

To create multiple scenes, separate each scene with **2 or more empty lines**.

```dsl
TEXT "Scene 1"
COLOR #FF4D00
ANIMATION fade in
DURATION 1.5s


TEXT "Scene 2"
COLOR #00AAFF
ANIMATION slide up
DURATION 2s
```

Each scene can have its own:
- Text content or shape
- Font, size, and color
- Background color
- Animation type
- Duration

---

## Example Projects

### Simple Text Animation

```dsl
TEXT "Welcome"
FONT Inter
COLOR #1A1A1A
BACKGROUND #FFFFFF
ANIMATION fade in
DURATION 1.5s
```

### Multi-Scene Video

```dsl
TEXT "Welcome to Rendly"
FONT Inter
SIZE 48
COLOR #FF4D00
BACKGROUND #FFFFFF
ANIMATION fade in
DURATION 2s


TEXT "Code-first video creation"
FONT Inter
SIZE 36
COLOR #1A1A1A
ANIMATION slide up
DURATION 1.5s


SHAPE circle
COLOR #00AFFF
ANIMATION pop
DURATION 1s
```

### Custom Brand Video

```dsl
TEXT "Your Brand"
FONT Poppins
SIZE 72
COLOR #FF4D00
BACKGROUND #000000
ANIMATION fade in
DURATION 2s


SHAPE rect
COLOR #FF4D00
ANIMATION bounce
DURATION 1s
```

---

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org) 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: [Lucide React](https://lucide.dev)
- **Deployment**: Vercel
- **License**: MIT

---

## Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |

### Project Structure

```
rendly/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── editor/      # Code editor page
│   │   ├── dashboard/  # User dashboard
│   │   ├── examples/   # Example projects
│   │   └── page.tsx   # Landing page
│   ├── components/     # React components
│   └── styles/        # Global styles
├── public/             # Static assets
├── package.json       # Dependencies
└── README.md         # This file
```

---

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) before submitting PRs.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## Contact

- **Website**: [rendly-one.vercel.app](https://rendly-one.vercel.app)
- **GitHub**: [github.com/mukundzha/rendly](https://github.com/mukundzha/rendly)

---

<p align="center">
  Made with <span style="color: #FF4D00;">●</span> for developers who love code-first tools.
</p>