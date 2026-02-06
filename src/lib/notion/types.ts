export interface NotionPage {
  id: string;
  title: string;
  summary: string;
  date: string;
  tags: string[];
  cover: string | null;
  category: string;
  theme: string | null;
  area: string;
  role: string;
  platforms: string[];
  rate: number | null;
  status: string;
  url: string;
}

export interface NotionBlock {
  id: string;
  type: string;
  content: unknown; // specific content based on type
  has_children?: boolean;
  is_toggleable?: boolean;
  children?: NotionBlock[];
}

/**
 * Clean version of a Blog Post
 */
export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  date: string;
  tags: string[];
  cover: string;
  category: 'Blogs' | 'PF-AIGC';
}

/**
 * Clean version of a Music Log
 */
export interface MusicLog {
  id: string;
  title: string;
  artist: string;
  cover: string;
  type: 'MUSIC' | 'PODCAST' | 'REVIEW' | 'MIXTAPE' | 'ALBUM';
  date: string;
  rating?: number;
  duration?: string;
  description: string;
  theme: 'rose' | 'indigo' | 'emerald' | 'orange';
}

export interface FullPost extends NotionPage {
  blocks: NotionBlock[];
}
