export interface Work {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  tech: string[];
  imageUrl: string;
  link: string;
  theme: 'emerald' | 'purple' | 'blue' | 'orange' | 'pink' | 'teal';
}

export const MOCK_WORKS: Work[] = [
  {
    id: 'neon-finance',
    title: 'Neon Finance',
    category: 'Fintech',
    year: '2023',
    description: 'Real-time cryptocurrency trading dashboard featuring WebSocket data streams and WebGL charting library integration.',
    tech: ['Next.js', 'D3.js', 'Tailwind'],
    imageUrl: 'https://images.unsplash.com/photo-1642427749670-f20e2e76ed8c?q=80&w=800&auto=format&fit=crop',
    link: '#',
    theme: 'emerald'
  },
  {
    id: 'prisma-lab',
    title: 'Prisma Lab',
    category: 'Generative AI',
    year: '2023',
    description: 'Browser-based node editor for stable diffusion workflows. Allows users to chain models and process images locally.',
    tech: ['React Flow', 'Python', 'WASM'],
    imageUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800&auto=format&fit=crop',
    link: '#',
    theme: 'purple'
  },
  {
    id: 'echo-player',
    title: 'Echo Player',
    category: 'Audio',
    year: '2022',
    description: 'An experimental spatial audio player that places sound sources in a 3D environment using the Web Audio API.',
    tech: ['Three.js', 'Web Audio', 'Vue'],
    imageUrl: 'https://images.unsplash.com/photo-1558486012-817176f84c6d?q=80&w=800&auto=format&fit=crop',
    link: '#',
    theme: 'blue'
  },
  {
    id: 'flux-analytics',
    title: 'Flux Analytics',
    category: 'SaaS',
    year: '2022',
    description: 'Product analytics platform helping teams understand user behavior through heatmaps and session replay.',
    tech: ['TypeScript', 'Node.js', 'ClickHouse'],
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
    link: '#',
    theme: 'orange'
  },
  {
    id: 'cosmos-ui',
    title: 'Cosmos UI',
    category: 'Open Source',
    year: '2021',
    description: 'A headless component library focusing on accessibility and keyboard navigation. 2k+ stars on GitHub.',
    tech: ['React', 'A11y', 'NPM'],
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
    link: '#',
    theme: 'pink'
  },
  {
    id: 'zen-focus',
    title: 'Zen Focus',
    category: 'iOS / Android',
    year: '2021',
    description: 'Productivity application combining pomodoro technique with ambient soundscapes. Featured on App Store.',
    tech: ['React Native', 'Swift', 'Firebase'],
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    link: '#',
    theme: 'teal'
  }
];
