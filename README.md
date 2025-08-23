# FailNet

An anonymous posting platform built with Next.js, featuring real-time updates and AI-powered content moderation.

## Features

- **Anonymous Posting**: Share thoughts freely with complete anonymity
- **Real-time Updates**: Instant post updates powered by AWS AppSync
- **Content Moderation**: AI-based filtering using Amazon Bedrock
- **Mobile-First Design**: Responsive UI optimized for all devices
- **Japanese Localization**: Full support for Japanese language and culture

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Backend**: AWS Amplify Gen 2
- **Database**: DynamoDB
- **AI/ML**: Amazon Bedrock (Claude)
- **Real-time**: AWS AppSync GraphQL

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- AWS Account (for backend services)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/failnet.git
cd failnet/failnet_app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run amplify:sandbox` - Start Amplify sandbox

## Deployment

The application can be deployed using Vercel or AWS Amplify Hosting. See the deployment documentation for detailed instructions.

