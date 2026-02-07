export type AudioTrack = {
  id: string;
  title: string;
  artist?: string;
  cover?: string | null;
  src: string;
  kind?: 'mlog' | 'blog';
};
