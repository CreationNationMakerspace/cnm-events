# CNM Events

A Next.js application that displays upcoming events for Creation Nation Makerspace using the Eventbrite API.

## Features

- Real-time event listing from Eventbrite
- Display of event capacity and ticket availability
- Modern, responsive UI with Tailwind CSS
- Dynamic date formatting (Today, Tomorrow, or full date)
- Ticket status indicators (Available/Sold Out)
- Integration with Creation Nation Makerspace branding

## Tech Stack

- [Next.js 14](https://nextjs.org/) - React Framework
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Axios](https://axios-http.com/) - API Requests
- [Inter Font](https://fonts.google.com/specimen/Inter) - Typography

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn
- Eventbrite API Token
- Eventbrite Organization ID

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_EVENTBRITE_API_TOKEN=your_api_token_here
NEXT_PUBLIC_EVENTBRITE_ORG_ID=your_organization_id_here
```

### Installation

1. Clone the repository
```bash
git clone [repository-url]
```

2. Install dependencies
```bash
cd eventbrite-app
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
eventbrite-app/
├── src/
│   ├── app/
│   │   ├── page.tsx      # Main events listing page
│   │   ├── layout.tsx    # Root layout with global styles
│   │   └── globals.css   # Global CSS styles
│   └── types/
│       └── types.d.ts    # TypeScript type declarations
├── public/
│   ├── cnm.svg          # CNM logo
│   ├── backdrop.jpg     # Background image
│   └── favicon.ico      # Site favicon
└── package.json         # Project dependencies
```

## Features Explained

### Event Display
- Events are fetched from Eventbrite and displayed in a responsive grid
- Each event shows:
  - Event name with link to Eventbrite page
  - Date (with special formatting for today/tomorrow)
  - Total capacity
  - Number of tickets sold
  - Availability status

### Responsive Design
- Mobile-first approach
- Responsive grid layout (1 column on mobile, 2 on tablet, 3 on desktop)
- Adaptive typography and spacing

### Visual Elements
- Custom background with overlay
- Drop shadow effects for improved readability
- Hover effects on cards
- Status-based color coding (green for available, red for sold out)

## Contributing

[Add contribution guidelines if applicable]

## License

[Add license information]
