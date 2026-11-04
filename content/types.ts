export type NavLink = { label: string; href: string };

export type SiteConfig = {
  name: string;
  titleTemplate: (page: string) => string;
  homeTitle: string;
  metaDescription: string;
  nav: NavLink[];
  hero: {
    lines: [string, string];
    sub: string;
    ctaPrimary: { label: string; href: string };
    ctaSecondary: { label: string; href: string };
  };
  statement: string;
  workSection: { heading: string; lead: string };
  about: {
    heading: string;
    cards: AboutCard[];
  };
  contact: {
    heading: string;
    sub: string;
    email: string;
    copyLabel: string;
    socials: { label: string; href: string; external?: boolean; download?: string }[];
  };
  footer: { copyright: string; tagline: string };
};

export type AboutCard =
  | {
      kicker: string;
      lead: string;
      figures?: { value: string; caption: string }[];
      body: string;
    }
  | {
      kicker: string;
      skills: { term: string; detail: string }[];
    }
  | {
      kicker: string;
      lead: string;
      figureValue?: string;
      figureCaption?: string;
      body: string;
    };

export type WorkTileVariant = 't1' | 't2' | 't3';

export type WorkEntry =
  | {
      kind: 'link';
      slug: string;
      title: string;
      blurb: string;
      href: string;
      tileVariant: WorkTileVariant;
      viewTransitionName: string;
      scrollTargetTile: string;
      stmt?: string;
      decorative?: 'eye';
    }
  | {
      kind: 'static';
      title: string;
      blurb: string;
      tileVariant: WorkTileVariant;
      note: string;
    };

export type CaseStudyMeta = {
  slug: string;
  title: string;
  description: string;
  introLede: string;
  heroTheme: 'dark' | 'light';
  stackLine: string;
  githubUrl?: string;
  extraFooterLinks?: { label: string; href: string }[];
  nextProject: { slug: string; title: string; desc: string };
};

export type GalleryShot = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  ariaLabel: string;
  layout?: 'hero' | 'wide';
  fetchPriority?: 'high';
  loading?: 'lazy';
};

export type CaseStudySection =
  | { type: 'prose'; heading: string; paragraphs: string[] }
  | { type: 'figure'; svgPath: string; caption: string }
  | {
      type: 'gallery';
      heading: string;
      rows: { layout?: 'pair'; shots: GalleryShot[] }[];
    }
  | { type: 'specs'; rows: { heading: string; body: string }[] }
  | {
      type: 'results';
      heading: string;
      metric: string;
      paragraphs: string[];
      noteLine?: string;
    }
  | { type: 'retro'; heading: string; items: string[] };

export type CaseStudyContent = CaseStudyMeta & { sections: CaseStudySection[] };
