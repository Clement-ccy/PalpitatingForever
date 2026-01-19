export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  date: string;
  tags: string[];
  content: string; // Markdown content
}

export const MOCK_BLOGS: BlogPost[] = [
  {
    id: '1',
    slug: 'reflecting-on-software-architecture',
    title: 'Reflecting on Software Architecture and Entropy',
    summary: 'Why do systems tend towards chaos? Examining the second law of thermodynamics in the context of React codebases.',
    date: '2025-10-24',
    tags: ['Architecture', 'React', 'Philosophy'],
    content: `
# Reflecting on Software Architecture and Entropy

As software engineers, we spend a lot of time fighting entropy. We build structures, define patterns, and enforce rules, all in an attempt to keep chaos at bay. But just like the physical universe, software systems have a natural tendency to disorder.

## The Rot is Real

You start with a clean slate. A fresh \`create-next-app\`. The folder structure is perfect. The components are pure. But then, features get added. Deadlines loom. "Just a quick hack" becomes a permanent fixture.

> "Software entropy increases over time unless work is actively done to reduce it."

## Counteracting the Chaos

1. **Strict boundaries**: Enforce module boundaries.
2. **Consistent Refactoring**: Don't wait for a "refactoring sprint".
3. **Delete Code**: The best code is no code.

This blog explores how we can apply these principles to modern React applications...
    `
  },
  {
    id: '2',
    slug: 'the-art-of-virtual-gardening',
    title: 'The Art of Virtual Gardening',
    summary: 'Building a digital garden is less about engineering and more about tending to ideas over time.',
    date: '2025-09-15',
    tags: ['Digital Garden', 'Personal Knowledge Management'],
    content: `
# The Art of Virtual Gardening

I've recently restructured my website to follow the "Digital Garden" philosophy. Unlike a traditional blog, which is a stream of chronological posts, a garden is a collection of evolving notes.

## Seeds, Saplings, and Trees

*   **Seeds**: Rough ideas, quick jots.
*   **Saplings**: Growing thoughts, starting to take shape.
*   **Trees**: Fully formed essays, rigorous and polished.

By allowing users to see the *process* of thought, we create a more authentic connection.
    `
  },
  {
    id: '3',
    slug: 'shaders-are-magic',
    title: 'Why Shaders are Actually Magic',
    summary: 'A deep dive into GLSL and how pixel manipulation creates the illusion of reality.',
    date: '2025-08-01',
    tags: ['WebGL', 'Graphics', 'Creative Coding'],
    content: `
# Why Shaders are Actually Magic

If you've ever looked at a modern website and wondered "how did they do that fluid effect?", the answer is almost always GLSL.

\`\`\`glsl
// A simple fragment shader
void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    gl_FragColor = vec4(st.x, st.y, 0.0, 1.0);
}
\`\`\`

The power of running code on the GPU for every single pixel in parallel opens up possibilities that CPU-based rendering can only dream of.
    `
  }
];
