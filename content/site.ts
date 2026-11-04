import type { SiteConfig } from './types';

export const site: SiteConfig = {
  name: 'Arnav Poswal',
  homeTitle: 'Arnav Poswal – Software engineer',
  titleTemplate: (page) => `${page} – Arnav Poswal`,
  metaDescription:
    'Portfolio of Arnav Poswal, a software engineer building backend systems and production AI.',
  nav: [
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ],
  hero: {
    lines: ['Thoughtful software.', 'Obsessively crafted.'],
    sub: 'I’m Arnav, a software engineer. I build backend platforms and put AI features into production.',
    ctaPrimary: { label: 'See my work', href: '#work' },
    ctaSecondary: { label: 'Get in touch', href: '#contact' },
  },
  statement:
    'Good infrastructure is invisible. Nobody notices the pipeline that never drops a log, or the checkout that never oversells. I build the things people only notice when they are missing.',
  workSection: {
    heading: 'Selected work.',
    lead: 'Three projects, from a distributed order platform to computer vision.',
  },
  about: {
    heading: 'About.',
    cards: [
      {
        kicker: 'Experience',
        lead: 'Software developer since March 2025.',
        figures: [
          { value: '20 GB', caption: 'logs a day · 18 services' },
          { value: '70%', caption: 'fewer manual uploads' },
        ],
        body: 'Most of my week is backend work—REST APIs and the services behind them—on a vehicle-management platform and a pet-health product. I ship RAG and agent features there too when the product needs them. Built our ELK logging pipeline and, with one teammate, moved company CI from Jenkins to GitHub Actions.',
      },
      {
        kicker: 'Skills',
        skills: [
          { term: 'Languages', detail: 'Java · TypeScript · Python · SQL' },
          { term: 'Backend', detail: 'Spring Boot · Node.js · Kafka · PostgreSQL · Redis' },
          { term: 'AI', detail: 'LangChain · LangGraph · LlamaIndex · Anthropic · OpenAI' },
          { term: 'Cloud & DevOps', detail: 'AWS · Docker · GitHub Actions · ELK · Grafana' },
        ],
      },
      {
        kicker: 'Education',
        lead: 'B.Tech, Computer Science',
        figureValue: '8.33',
        figureCaption: 'CGPA',
        body: 'SRM University, Chennai · 2021–2025',
      },
      {
        kicker: 'Community',
        lead: 'SRM Tech Club',
        body: 'Organized the club’s AI workshop and mentored students through project work—more than 50 peers over the year.',
      },
    ],
  },
  contact: {
    heading: 'Let’s talk.',
    sub: 'Open to conversations about backend and AI engineering.',
    email: 'poswalarnav37@gmail.com',
    copyLabel: 'Copy',
    socials: [
      { label: 'GitHub', href: 'https://github.com/ArnavPoswal15' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/arnavposwal/' },
      {
        label: 'Resume',
        href: 'Arnav_CV.pdf',
        external: false,
        download: 'Arnav_Poswal_Resume.pdf',
      },
    ],
  },
  footer: {
    copyright: '© 2026 Arnav Poswal',
    tagline: 'Designed and built by hand.',
  },
  clarityProjectId: 'z89s67wejb',
};
