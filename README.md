# TrendScout: Your AI-Powered Trend Analyzer and Newsletter Generator

TrendScout is an innovative AI-powered application that keeps you up-to-date with the latest trends across social media, technology, and literature. It combines real-time trend analysis with the power of generative AI to provide insightful conversations and create engaging newsletters.

## How It Works

1. **Real-Time Trend Analysis**: TrendBot fetches the latest trends from various sources, categorizing them into Social Media, Tech, and Book trends.

2. **AI-Powered Chat**: Users can ask questions about trends, and TrendBot provides informative responses using the Gemini AI model.

3. **Automated Newsletter Generation**: With a single click, TrendBot creates a comprehensive newsletter based on current trends, perfect for content creators and marketers.

## Why Choose TrendScout?

- **Stay Informed**: Get instant access to the latest trends across multiple domains.
- **Save Time**: Automate your trend research and newsletter creation process.
- **Engage Your Audience**: Use AI-generated insights to create compelling content.
- **Versatile**: Suitable for marketers, content creators, researchers, and trend enthusiasts.
- **User-Friendly**: Intuitive interface accessible on both desktop and mobile devices.

## Video Demo

[Watch the video](https://youtu.be/p8ioiz0yx-c)


## Building and Running TrendBot

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/meshach5667/TrendScout.git
   cd TrendScout
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your Gemini API key:
   ```
   VITE_API_GENERATIVE_LANGUAGE_CLIENT=your_gemini_api_key_here
   ```

4. Replace the placeholder trend API:
   In `src/App.js`, replace `'https://api.example.com/trends'` with your actual trend API endpoint.

### Running the Application

1. Start the development server:
   ```
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:5174` (or the port specified in your console).

### Building for Production

To create a production build:

```
npm run build
```

The built files will be in the `dist` directory, ready for deployment to your preferred hosting platform.

## Customization

You can easily customize TrendScout by modifying the trend categories, adjusting the UI, or extending the AI capabilities. Refer to the source code comments for guidance on making changes.

Start using TrendScout today and revolutionize how you stay informed and create content!
