import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  CalendarDays,
  Check,
  Compass,
  Eye,
  Layers3,
  LucideIcon,
  Mail,
  PenLine,
  Send,
  Sparkles,
  Users,
} from 'lucide-react';
import { FormEvent, ReactNode, useEffect, useRef, useState } from 'react';

type RoutePath = '/' | '/our-story' | '/collective' | '/workshops' | '/programs' | '/inquiries';
type Router = { path: RoutePath; href: (path: RoutePath) => string; navigate: (path: RoutePath) => void };
type MultiStyleSegment = { text: string; className?: string };
type Card = { title: string; body: string; eyebrow?: string; icon?: LucideIcon };
type FeatureCardProps = {
  index: number;
  title: string;
  number: string;
  iconUrl?: string;
  items?: string[];
  videoUrl?: string;
  videoLabel?: string;
  pagePath?: RoutePath;
};
type PageData = {
  eyebrow: string;
  title: string;
  intro: string;
  cta?: string;
  introSection: { eyebrow: string; title: string; body: string; items: string[] };
  cardsSection: { eyebrow: string; title: string; body?: string; cards: Card[] };
  extraSection: { eyebrow: string; title: string; body?: string; cards: Card[] };
  closing: { title: string; body: string };
};

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
const primaryText = '#E1E0CC';
const customEase = [0.16, 1, 0.3, 1] as const;
const cardEase = [0.22, 1, 0.36, 1] as const;

const heroVideoUrl =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4';
const featuresVideoUrl =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4';

const navItems: { label: string; path: Exclude<RoutePath, '/'> }[] = [
  { label: 'Our Story', path: '/our-story' },
  { label: 'Collective', path: '/collective' },
  { label: 'Workshops', path: '/workshops' },
  { label: 'Programs', path: '/programs' },
  { label: 'Inquiries', path: '/inquiries' },
];

const pageData: Record<Exclude<RoutePath, '/' | '/inquiries'>, PageData> = {
  '/our-story': {
    eyebrow: 'Our Story',
    title: 'A field for vision to gather.',
    intro:
      'GEOx began as a question: what happens when artists stop waiting for permission and start building the conditions for one another to make braver work?',
    cta: 'Start a conversation',
    introSection: {
      eyebrow: 'Mission',
      title: 'We build creative infrastructure for artists who think in worlds.',
      body:
        'The collective exists to connect visual artists, filmmakers, technologists, writers, and producers around projects that need more than a single discipline.',
      items: [
        'Create spaces where experimental ideas can become finished public work.',
        'Support emerging voices with critique, structure, and production literacy.',
        'Keep artistic process generous without sanding away individual point of view.',
        'Turn isolated practice into a living network of collaborators and witnesses.',
      ],
    },
    cardsSection: {
      eyebrow: 'Why GEOx exists',
      title: 'Because talent needs more than attention.',
      body:
        'It needs rooms where people can rehearse language, test images, study failure, and return to the work with sharper instincts.',
      cards: [
        {
          title: 'Shared authorship',
          eyebrow: '01',
          body: 'GEOx treats creativity as a collective signal: many hands, many disciplines, one coherent field of vision.',
          icon: Users,
        },
        {
          title: 'Cinematic care',
          eyebrow: '02',
          body: 'Every project is shaped with atmosphere, rhythm, and emotional precision, from the first sketch to the final frame.',
          icon: Eye,
        },
        {
          title: 'Open transmission',
          eyebrow: '03',
          body: 'Knowledge circulates through workshops, critique rooms, and programs built to make hidden craft visible.',
          icon: Sparkles,
        },
      ],
    },
    extraSection: {
      eyebrow: 'Journey',
      title: 'A quiet timeline of becoming.',
      body: 'The story is still being written, but its early chapters already carry a clear pulse.',
      cards: [
        { title: '2019', body: 'An informal circle of artists begins exchanging references, rough cuts, and notes across cities.' },
        { title: '2021', body: 'The circle becomes a working lab for moving image, narrative design, and critique.' },
        { title: '2024', body: 'GEOx expands into workshops and collaborative production sprints for public-facing work.' },
        { title: 'Now', body: 'The collective opens its programs to a wider network of creators ready to build together.' },
      ],
    },
    closing: {
      title: 'Bring your unfinished vision into the room.',
      body: 'GEOx is built for artists who are ready to move from private intensity into shared momentum.',
    },
  },
  '/collective': {
    eyebrow: 'Collective',
    title: 'Many practices. One field of attention.',
    intro:
      'GEOx gathers contributors who believe the best creative work comes from friction, trust, and a shared appetite for precision.',
    cta: 'Join the collective',
    introSection: {
      eyebrow: 'The collective',
      title: 'Not a roster. A living studio culture.',
      body:
        'Members move between critique circles, production teams, workshops, and research labs. The structure is light enough to stay alive and clear enough to make ambitious work possible.',
      items: [
        'Work in small teams that can move quickly without losing care.',
        'Share references, drafts, technical knowledge, and production language.',
        'Let critique become a craft instead of a performance.',
        'Build durable relationships around the work rather than hype around the room.',
      ],
    },
    cardsSection: {
      eyebrow: 'Contributor categories',
      title: 'A collective made of complementary instincts.',
      cards: [
        {
          title: 'Image makers',
          eyebrow: 'Lens',
          body: 'Directors, cinematographers, photographers, colorists, and editors shaping the visual language of the collective.',
          icon: Eye,
        },
        {
          title: 'Story builders',
          eyebrow: 'Voice',
          body: 'Writers, researchers, dramaturgs, and producers who turn fragments into narrative architecture.',
          icon: PenLine,
        },
        {
          title: 'System artists',
          eyebrow: 'Frame',
          body: 'Designers, technologists, and creative engineers building tools, spaces, and rituals around the work.',
          icon: Layers3,
        },
      ],
    },
    extraSection: {
      eyebrow: 'Community values',
      title: 'We protect the work by protecting the room.',
      cards: [
        { title: 'Precision', body: 'Give notes that sharpen the artist rather than replacing their instinct.', icon: Compass },
        { title: 'Credit', body: 'Name labor clearly and early, especially when ideas are still forming.', icon: Check },
        { title: 'Momentum', body: 'Turn admiration into practical next steps that help the project move.', icon: ArrowRight },
        { title: 'Difference', body: 'Let contrasting practices become composition instead of noise.', icon: Sparkles },
      ],
    },
    closing: {
      title: 'If your practice needs collaborators, GEOx is listening.',
      body: 'Tell us what you are building, what kind of room you need, and where your work wants to travel next.',
    },
  },
  '/workshops': {
    eyebrow: 'Workshops',
    title: 'Practice rooms for creative intensity.',
    intro:
      'GEOx workshops are built for artists who want sharper tools, better language, and a more generous relationship with process.',
    cta: 'Ask about workshops',
    introSection: {
      eyebrow: 'Workshop categories',
      title: 'Sessions that move between analysis and making.',
      body:
        'Each workshop is designed as a working environment: focused enough to produce progress, open enough to let unexpected forms appear.',
      items: [
        'Visual direction labs for mood, palette, shot language, and reference systems.',
        'Narrative design rooms for scene rhythm, atmosphere, and audience memory.',
        'Production labs for turning concepts into treatments, prototypes, and artifacts.',
        'Remote critique formats for teams working across different cities.',
      ],
    },
    cardsSection: {
      eyebrow: 'Example workshops',
      title: 'Built as cinematic exercises, not lectures.',
      cards: [
        {
          title: 'The Living Moodboard',
          eyebrow: '01',
          body: 'A two-day session for building visual systems that can guide a film, campaign, or installation from first reference to final tone.',
          icon: Eye,
        },
        {
          title: 'Critique Without Collapse',
          eyebrow: '02',
          body: 'A focused lab on giving and receiving notes that protect artistic identity while improving the work.',
          icon: Users,
        },
        {
          title: 'From Fragment to Treatment',
          eyebrow: '03',
          body: 'A writing and image workshop for turning loose concepts into pitchable creative documents.',
          icon: PenLine,
        },
        {
          title: 'Sound as Architecture',
          eyebrow: '04',
          body: 'A workshop exploring ambient sound, silence, rhythm, and texture as structural tools.',
          icon: Sparkles,
        },
      ],
    },
    extraSection: {
      eyebrow: 'Format',
      title: 'Flexible sessions for studios, schools, and independent artists.',
      cards: [
        { title: 'Evening salons', body: 'Short focused rooms for critique, references, and shared vocabulary.', icon: CalendarDays },
        { title: 'Weekend intensives', body: 'Two-day sprints that leave participants with edited references and next-step plans.', icon: Compass },
        { title: 'Cohort labs', body: 'Longer learning containers with recurring feedback and project accountability.', icon: Users },
      ],
    },
    closing: {
      title: 'Make the next session feel like a real threshold.',
      body: 'Bring a project, a question, or a room full of people who are ready to learn by making.',
    },
  },
  '/programs': {
    eyebrow: 'Programs',
    title: 'Structured paths for ambitious work.',
    intro:
      'GEOx programs give artists a container: enough pressure to move, enough care to keep the work honest, and enough structure to arrive somewhere visible.',
    cta: 'Apply or inquire',
    introSection: {
      eyebrow: 'Program goals',
      title: 'Programs are designed to leave evidence.',
      body:
        'Each track asks participants to turn creative pressure into a clear artifact: a treatment, prototype, edit, pitch, exhibition plan, or finished public work.',
      items: [
        'Clarify the project language so collaborators understand what is being built.',
        'Build a repeatable creative workflow across research, critique, production, and refinement.',
        'Identify the right audience, format, and distribution path for the work.',
        'Close with a concrete shareable outcome rather than a vague sense of progress.',
      ],
    },
    cardsSection: {
      eyebrow: 'Program paths',
      title: 'Choose the container that matches the stage of your vision.',
      cards: [
        {
          title: 'Origin Sprint',
          eyebrow: '4 weeks',
          body: 'For early-stage creators shaping a concept, visual thesis, treatment, or pilot body of work.',
          icon: Compass,
        },
        {
          title: 'Studio Circle',
          eyebrow: '8 weeks',
          body: 'For artists who need recurring critique, production accountability, and a trusted group of peers.',
          icon: Users,
        },
        {
          title: 'Public Work Lab',
          eyebrow: '12 weeks',
          body: 'For teams preparing a film, exhibition, campaign, or digital experience for a public audience.',
          icon: Layers3,
        },
      ],
    },
    extraSection: {
      eyebrow: 'Curriculum',
      title: 'A simple rhythm that keeps the work moving.',
      cards: [
        { title: 'Map', body: 'Define the concept, references, audience, constraints, and desired emotional afterimage.' },
        { title: 'Build', body: 'Create scenes, prototypes, outlines, treatments, or image systems with weekly feedback.' },
        { title: 'Refine', body: 'Use critique to remove noise, heighten tension, and clarify the project language.' },
        { title: 'Release', body: 'Prepare the work for presentation, pitch, publication, exhibition, or production.' },
      ],
    },
    closing: {
      title: 'Find the program that can hold your next body of work.',
      body: 'Tell us where the project is now and what kind of transformation it needs.',
    },
  },
};

const featureCards = [
  {
    title: 'Project Storyboard.',
    number: '01',
    pagePath: '/programs' as RoutePath,
    iconUrl:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171918_4a5edc79-d78f-4637-ac8b-53c43c220606.png&w=1280&q=85',
    items: ['Frame production with scene-by-scene clarity.', 'Track revisions, references, and visual arcs.', 'Share a living blueprint with collaborators.'],
  },
  {
    title: 'Smart Critiques.',
    number: '02',
    pagePath: '/collective' as RoutePath,
    iconUrl:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171741_ed9845ab-f5b2-4018-8ce7-07cc01823522.png&w=1280&q=85',
    items: ['Analyze pacing, rhythm, and emotional weight.', 'Surface creative notes without flattening voice.', 'Keep reviews flowing inside the studio stack.'],
  },
  {
    title: 'Immersion Capsule.',
    number: '03',
    pagePath: '/workshops' as RoutePath,
    iconUrl:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171809_f56666dc-c099-4778-ad82-9ad4f209567b.png&w=1280&q=85',
    items: ['Silence stray notifications during focused sessions.', 'Layer ambient soundscapes for creative work.', 'Sync schedules around shared practice.'],
  },
];

function normalizePath(pathname: string): RoutePath {
  let nextPath = pathname;

  if (basePath && nextPath.startsWith(basePath)) {
    nextPath = nextPath.slice(basePath.length) || '/';
  }

  if (!nextPath.startsWith('/')) {
    nextPath = `/${nextPath}`;
  }

  const cleanPath = (nextPath.replace(/\/$/, '') || '/') as RoutePath;
  const knownPaths: RoutePath[] = ['/', ...navItems.map((item) => item.path)];

  return knownPaths.includes(cleanPath) ? cleanPath : '/';
}

function useMiniRouter(): Router {
  const [path, setPath] = useState<RoutePath>(() => normalizePath(window.location.pathname));

  useEffect(() => {
    const onPopState = () => {
      setPath(normalizePath(window.location.pathname));
      window.scrollTo({ top: 0 });
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const href = (routePath: RoutePath) => `${basePath}${routePath === '/' ? '/' : routePath}`;

  const navigate = (routePath: RoutePath) => {
    window.history.pushState({}, '', href(routePath));
    setPath(routePath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return { path, href, navigate };
}

function RouteLink({
  to,
  router,
  className,
  style,
  children,
}: {
  to: RoutePath;
  router: Router;
  className?: string;
  style?: React.CSSProperties;
  children: ReactNode;
}) {
  return (
    <a
      href={router.href(to)}
      className={className}
      style={style}
      onClick={(event) => {
        event.preventDefault();
        router.navigate(to);
      }}
    >
      {children}
    </a>
  );
}

function WordsPullUp({
  text,
  className,
  showAsterisk = false,
}: {
  text: string;
  className?: string;
  showAsterisk?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const words = text.split(' ');

  return (
    <div ref={ref} className={`inline-flex flex-wrap ${className ?? ''}`}>
      {words.map((word, index) => {
        const isLastWord = index === words.length - 1;

        return (
          <span key={`${word}-${index}`} className="overflow-hidden">
            <motion.span
              className="mr-[0.16em] inline-block"
              initial={{ y: 20, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ duration: 0.8, delay: index * 0.08, ease: customEase }}
            >
              {showAsterisk && isLastWord ? (
                <>
                  {word.slice(0, -1)}
                  <span className="relative inline-block">
                    {word.slice(-1)}
                    <span className="absolute -right-[0.3em] top-[0.65em] text-[0.31em]">*</span>
                  </span>
                </>
              ) : (
                word
              )}
            </motion.span>
          </span>
        );
      })}
    </div>
  );
}

function WordsPullUpMultiStyle({
  segments,
  className,
}: {
  segments: MultiStyleSegment[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const words = segments.flatMap((segment) =>
    segment.text.split(' ').map((word) => ({ word, className: segment.className ?? '' })),
  );

  return (
    <div ref={ref} className={`inline-flex flex-wrap justify-center ${className ?? ''}`}>
      {words.map(({ word, className: wordClassName }, index) => (
        <span key={`${word}-${index}`} className="overflow-hidden">
          <motion.span
            className={`mr-[0.16em] inline-block ${wordClassName}`}
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ duration: 0.8, delay: index * 0.08, ease: customEase }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </div>
  );
}

function AnimatedLetter({
  character,
  index,
  totalChars,
  progress,
}: {
  character: string;
  index: number;
  totalChars: number;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const charProgress = index / totalChars;
  const opacity = useTransform(progress, [charProgress - 0.1, charProgress + 0.05], [0.2, 1]);

  return (
    <motion.span style={{ opacity }} className="whitespace-pre-wrap">
      {character}
    </motion.span>
  );
}

function NavBar({ router, variant = 'hero' }: { router: Router; variant?: 'hero' | 'page' }) {
  return (
    <nav className={`z-50 w-full px-4 ${variant === 'hero' ? 'absolute left-0 top-0' : 'fixed left-0 top-0'}`}>
      <div className="mx-auto flex max-w-fit items-center overflow-x-auto rounded-b-2xl bg-black px-4 py-2 shadow-2xl sm:px-5 md:rounded-b-3xl md:px-8">
        <RouteLink
          to="/"
          router={router}
          className="mr-4 shrink-0 text-[10px] font-bold uppercase tracking-[0.22em] text-primary transition-colors hover:text-[#E1E0CC] sm:mr-6 md:mr-10 md:text-xs"
        >
          GEOx
        </RouteLink>
        <div className="flex shrink-0 items-center gap-3 sm:gap-6 md:gap-12 lg:gap-14">
          {navItems.map((item) => (
            <RouteLink
              key={item.path}
              to={item.path}
              router={router}
              className="whitespace-nowrap text-[10px] transition-colors hover:text-[#E1E0CC] sm:text-xs md:text-sm"
              style={{ color: router.path === item.path ? primaryText : 'rgba(225, 224, 204, 0.8)' }}
            >
              {item.label}
            </RouteLink>
          ))}
        </div>
      </div>
    </nav>
  );
}

function CTAButton({ to, router, children }: { to: RoutePath; router: Router; children: ReactNode }) {
  return (
    <RouteLink
      to={to}
      router={router}
      className="group inline-flex items-center gap-2 rounded-full bg-primary px-3 py-3 pl-5 text-sm font-medium text-black transition-all hover:gap-3 sm:text-base"
    >
      <span>{children}</span>
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform group-hover:scale-110 sm:h-10 sm:w-10">
        <ArrowRight className="h-4 w-4 text-primary" />
      </span>
    </RouteLink>
  );
}

function PageHero({
  eyebrow,
  title,
  intro,
  router,
  cta,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  router: Router;
  cta?: string;
}) {
  return (
    <section className="relative min-h-[82vh] overflow-hidden bg-black px-4 pt-28 sm:px-6 md:px-8">
      <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay" />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(circle at 50% 0%, rgba(222,219,200,0.12), transparent 42%)' }}
      />
      <div className="relative mx-auto flex min-h-[72vh] max-w-7xl flex-col justify-end pb-12 sm:pb-16 md:pb-20">
        <motion.p
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: customEase }}
          className="mb-4 text-[10px] uppercase tracking-[0.28em] text-primary sm:text-xs"
        >
          {eyebrow}
        </motion.p>
        <WordsPullUp
          text={title}
          className="max-w-5xl text-6xl font-medium leading-[0.88] sm:text-7xl md:text-8xl lg:text-9xl"
        />
        <div className="mt-8 grid gap-8 md:grid-cols-12">
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.25, ease: customEase }}
            className="max-w-2xl text-sm leading-[1.45] text-primary/70 sm:text-base md:col-span-7"
          >
            {intro}
          </motion.p>
          {cta ? (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.4, ease: customEase }}
              className="md:col-span-5 md:flex md:justify-end"
            >
              <CTAButton to="/inquiries" router={router}>
                {cta}
              </CTAButton>
            </motion.div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function SectionIntro({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return (
    <div className="mb-10 max-w-3xl sm:mb-12">
      <p className="mb-4 text-[10px] uppercase tracking-[0.24em] text-primary sm:text-xs">{eyebrow}</p>
      <h2 className="text-3xl leading-[0.98] sm:text-4xl md:text-5xl" style={{ color: primaryText }}>
        {title}
      </h2>
      {body ? <p className="mt-5 text-sm leading-[1.55] text-gray-400 sm:text-base">{body}</p> : null}
    </div>
  );
}

function PageSection({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className={`bg-black px-4 py-16 sm:px-6 md:px-8 md:py-24 ${className}`}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

function InfoCard({ card, index }: { card: Card; index: number }) {
  const Icon = card.icon ?? Sparkles;

  return (
    <motion.article
      initial={{ y: 24, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.75, delay: index * 0.08, ease: customEase }}
      className="group flex min-h-[250px] flex-col justify-between rounded-[1.5rem] bg-[#212121] p-6 transition-transform duration-300 hover:-translate-y-1 sm:p-7"
    >
      <div>
        <div className="mb-8 flex items-center justify-between">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-primary">
            <Icon className="h-5 w-5" />
          </span>
          {card.eyebrow ? <span className="text-xs uppercase tracking-[0.18em] text-gray-500">{card.eyebrow}</span> : null}
        </div>
        <h3 className="text-2xl leading-[1.05]" style={{ color: primaryText }}>
          {card.title}
        </h3>
      </div>
      <p className="mt-8 text-sm leading-[1.5] text-gray-400">{card.body}</p>
    </motion.article>
  );
}

function SplitPanel({ section }: { section: PageData['introSection'] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <div className="rounded-[2rem] bg-[#101010] p-7 sm:p-9 lg:col-span-5">
        <SectionIntro eyebrow={section.eyebrow} title={section.title} body={section.body} />
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:col-span-7">
        {section.items.map((item, index) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.65, delay: index * 0.08, ease: cardEase }}
            className="rounded-[1.5rem] bg-[#212121] p-6"
          >
            <Check className="mb-8 h-5 w-5 text-primary" />
            <p className="text-base leading-[1.45] text-gray-300">{item}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function CardSection({ section, columns = 'md:grid-cols-3' }: { section: PageData['cardsSection']; columns?: string }) {
  return (
    <>
      <SectionIntro eyebrow={section.eyebrow} title={section.title} body={section.body} />
      <div className={`grid gap-3 ${columns}`}>
        {section.cards.map((card, index) => (
          <InfoCard key={card.title} card={card} index={index} />
        ))}
      </div>
    </>
  );
}

function Footer({ router }: { router: Router }) {
  return (
    <footer className="border-t border-white/10 bg-black px-4 py-10 sm:px-6 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <RouteLink to="/" router={router} className="text-2xl font-bold tracking-[0.08em] text-primary">
            GEOx
          </RouteLink>
          <p className="mt-3 max-w-md text-sm leading-[1.5] text-gray-500">
            A worldwide network of artists, filmmakers, designers, and storytellers building
            cinematic systems for shared imagination.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-gray-500 sm:gap-6">
          {navItems.map((item) => (
            <RouteLink key={item.path} to={item.path} router={router} className="transition-colors hover:text-primary">
              {item.label}
            </RouteLink>
          ))}
        </div>
      </div>
    </footer>
  );
}

function FeatureCard({
  index,
  title,
  number,
  iconUrl,
  items,
  videoUrl,
  videoLabel,
  pagePath = '/our-story',
  router,
}: FeatureCardProps & { router: Router }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  if (videoUrl) {
    return (
      <motion.article
        ref={ref}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.9, delay: index * 0.15, ease: cardEase }}
        className="relative min-h-[320px] overflow-hidden rounded-[1.75rem] bg-[#212121] lg:h-[480px]"
      >
        <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover" src={videoUrl} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/70" />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
          <p className="text-xl sm:text-2xl md:text-3xl" style={{ color: primaryText }}>
            {videoLabel}
          </p>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.9, delay: index * 0.15, ease: cardEase }}
      className="flex min-h-[320px] flex-col rounded-[1.75rem] bg-[#212121] p-5 sm:p-6 lg:h-[480px]"
    >
      <div className="mb-12 flex items-start justify-between gap-4">
        {iconUrl ? <img src={iconUrl} alt={title} className="h-10 w-10 rounded-xl object-cover sm:h-12 sm:w-12" /> : <div />}
        <span className="text-sm tracking-[0.16em] text-gray-500">{number}</span>
      </div>
      <h3 className="mb-8 text-2xl sm:text-[1.75rem]" style={{ color: primaryText }}>
        {title}
      </h3>
      <div className="flex flex-1 flex-col justify-between gap-8">
        <ul className="space-y-4">
          {items?.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="text-sm leading-[1.35] text-gray-400 sm:text-[15px]">{item}</span>
            </li>
          ))}
        </ul>
        <RouteLink to={pagePath} router={router} className="inline-flex items-center gap-2 text-sm text-primary transition-transform hover:translate-x-1">
          <span>Learn more</span>
          <ArrowRight className="-rotate-45 h-4 w-4" />
        </RouteLink>
      </div>
    </motion.article>
  );
}

function HomePage({ router }: { router: Router }) {
  const aboutParagraphRef = useRef<HTMLParagraphElement | null>(null);
  const aboutText =
    'Over the last seven years, I have worked with Parallax, a Berlin-based production house that crafts cinema, series, and Noir Studio in Paris. Together, we have created work that has earned international acclaim at several major festivals.';
  const characters = aboutText.split('');
  const { scrollYProgress } = useScroll({ target: aboutParagraphRef, offset: ['start 0.8', 'end 0.2'] });

  return (
    <>
      <section className="h-screen bg-black p-4 md:p-6">
        <div className="relative h-full overflow-hidden rounded-2xl md:rounded-[2rem]">
          <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover" src={heroVideoUrl} />
          <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.7] mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
          <NavBar router={router} />
          <div className="absolute bottom-0 left-0 right-0 z-10 p-5 sm:p-6 md:p-8 lg:p-10">
            <div className="grid items-end gap-6 md:grid-cols-12 md:gap-8">
              <div className="md:col-span-8">
                <WordsPullUp
                  text="Prisma"
                  showAsterisk
                  className="text-7xl font-medium leading-[0.85] sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem]"
                />
              </div>
              <div className="md:col-span-4 md:pb-6">
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.9, delay: 0.5, ease: customEase }}
                  className="max-w-md text-xs leading-[1.2] text-primary/70 sm:text-sm md:text-base"
                >
                  Prisma is a worldwide network of visual artists, filmmakers and storytellers
                  bound not by place, status or labels but by passion and hunger to unlock
                  potential through our unique perspectives.
                </motion.p>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.9, delay: 0.7, ease: customEase }}
                  className="mt-6"
                >
                  <CTAButton to="/inquiries" router={router}>
                    Join the lab
                  </CTAButton>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-black px-4 py-20 sm:px-6 md:px-8 md:py-28">
        <div className="mx-auto max-w-6xl rounded-[2rem] bg-[#101010] px-6 py-12 text-center sm:px-10 sm:py-16 md:px-14 md:py-20">
          <p className="mb-5 text-[10px] uppercase tracking-[0.24em] text-primary sm:text-xs">Visual arts</p>
          <WordsPullUpMultiStyle
            segments={[
              { text: 'I am Marcus Chen,', className: 'font-normal' },
              { text: 'a self-taught director.', className: 'font-serif italic' },
              { text: 'I have skills in color grading, visual effects, and narrative design.', className: 'font-normal' },
            ]}
            className="mx-auto max-w-3xl text-3xl font-normal leading-[0.95] sm:text-4xl sm:leading-[0.9] md:text-5xl lg:text-6xl xl:text-7xl"
          />
          <p
            ref={aboutParagraphRef}
            className="mx-auto mt-10 max-w-3xl text-xs leading-[1.5] sm:text-sm md:mt-12 md:text-base"
            style={{ color: '#DEDBC8' }}
          >
            {characters.map((character, index) => (
              <AnimatedLetter
                key={`${character}-${index}`}
                character={character}
                index={index}
                totalChars={characters.length}
                progress={scrollYProgress}
              />
            ))}
          </p>
        </div>
      </section>
      <section className="relative min-h-screen overflow-hidden bg-black px-4 py-20 sm:px-6 md:px-8 md:py-24">
        <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.15]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-4xl text-center sm:mb-16">
            <WordsPullUpMultiStyle
              segments={[
                { text: 'Studio-grade workflows for visionary creators.' },
                { text: 'Built for pure vision. Powered by art.', className: 'text-gray-500' },
              ]}
              className="justify-center text-xl font-normal leading-[1.1] sm:text-2xl md:text-3xl lg:text-4xl"
            />
          </div>
          <div className="grid gap-3 md:grid-cols-2 md:gap-1 lg:h-[480px] lg:grid-cols-4">
            <FeatureCard
              index={0}
              title="Your creative canvas."
              number="00"
              videoUrl={featuresVideoUrl}
              videoLabel="Your creative canvas."
              pagePath="/our-story"
              router={router}
            />
            {featureCards.map((card, index) => (
              <FeatureCard key={card.number} index={index + 1} {...card} router={router} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function StandardPage({ data, router }: { data: PageData; router: Router }) {
  return (
    <>
      <PageHero eyebrow={data.eyebrow} title={data.title} intro={data.intro} cta={data.cta} router={router} />
      <PageSection>
        <SplitPanel section={data.introSection} />
      </PageSection>
      <PageSection className="relative overflow-hidden">
        <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.12]" />
        <div className="relative">
          <CardSection section={data.cardsSection} />
        </div>
      </PageSection>
      <PageSection>
        <CardSection section={data.extraSection} columns="md:grid-cols-2 lg:grid-cols-4" />
      </PageSection>
      <ClosingCTA router={router} title={data.closing.title} body={data.closing.body} />
    </>
  );
}

function InquiriesPage({ router }: { router: Router }) {
  const [formState, setFormState] = useState({ name: '', email: '', type: 'Collective membership', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};

    if (!formState.name.trim()) nextErrors.name = 'Name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) nextErrors.email = 'Use a valid email address.';
    if (formState.message.trim().length < 12) nextErrors.message = 'Share a little more context.';

    setErrors(nextErrors);
    setSubmitted(Object.keys(nextErrors).length === 0);
  };

  return (
    <>
      <PageHero
        eyebrow="Inquiries"
        title="Open a line into the studio."
        intro="Use this page for membership, workshops, programs, collaborations, commissions, press, or the kind of strange project that needs a careful first conversation."
        router={router}
      />
      <PageSection>
        <div className="grid gap-4 lg:grid-cols-12">
          <div className="rounded-[2rem] bg-[#101010] p-7 sm:p-9 lg:col-span-5">
            <SectionIntro
              eyebrow="Contact"
              title="Tell us what you are carrying."
              body="The form validates your message and shows a clean confirmation. Connect it to a form service later when the studio is ready for live submissions."
            />
            <div className="space-y-5 text-sm text-gray-400">
              <p className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary" />
                studio@geox.collective
              </p>
              <p className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-primary" />
                Instagram / Vimeo / Are.na: @geox.collective
              </p>
            </div>
          </div>
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.75, ease: cardEase }}
            className="rounded-[2rem] bg-[#212121] p-6 sm:p-8 lg:col-span-7"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Name" error={errors.name}>
                <input
                  value={formState.name}
                  onChange={(event) => setFormState({ ...formState, name: event.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-primary outline-none transition-colors placeholder:text-gray-600 focus:border-primary/60"
                  placeholder="Your name"
                />
              </FormField>
              <FormField label="Email" error={errors.email}>
                <input
                  value={formState.email}
                  onChange={(event) => setFormState({ ...formState, email: event.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-primary outline-none transition-colors placeholder:text-gray-600 focus:border-primary/60"
                  placeholder="you@example.com"
                />
              </FormField>
            </div>
            <div className="mt-5">
              <FormField label="Inquiry type">
                <select
                  value={formState.type}
                  onChange={(event) => setFormState({ ...formState, type: event.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-primary outline-none transition-colors focus:border-primary/60"
                >
                  <option>Collective membership</option>
                  <option>Workshop registration</option>
                  <option>Program application</option>
                  <option>Collaboration</option>
                  <option>Press or partnership</option>
                </select>
              </FormField>
            </div>
            <div className="mt-5">
              <FormField label="Message" error={errors.message}>
                <textarea
                  value={formState.message}
                  onChange={(event) => setFormState({ ...formState, message: event.target.value })}
                  rows={7}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-primary outline-none transition-colors placeholder:text-gray-600 focus:border-primary/60"
                  placeholder="Tell us what you are making, seeking, or trying to understand."
                />
              </FormField>
            </div>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-black transition-all hover:gap-3"
              >
                Send inquiry
                <Send className="h-4 w-4" />
              </button>
              {submitted ? <p className="text-sm text-primary">Inquiry drafted. Connect a backend to send it live.</p> : null}
            </div>
          </motion.form>
        </div>
      </PageSection>
      <ClosingCTA
        router={router}
        title="Every lasting collaboration starts with one clear signal."
        body="Send the first note. We will meet it with attention."
      />
    </>
  );
}

function FormField({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-gray-500">{label}</span>
      {children}
      {error ? <span className="mt-2 block text-xs text-primary">{error}</span> : null}
    </label>
  );
}

function ClosingCTA({ router, title, body }: { router: Router; title: string; body: string }) {
  return (
    <section className="bg-black px-4 py-16 sm:px-6 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl rounded-[2rem] bg-[#101010] p-7 text-center sm:p-10 md:p-14">
        <h2 className="mx-auto max-w-4xl text-3xl leading-[1] sm:text-4xl md:text-6xl" style={{ color: primaryText }}>
          {title}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-[1.55] text-gray-400 sm:text-base">{body}</p>
        <div className="mt-8 flex justify-center">
          <CTAButton to="/inquiries" router={router}>
            Inquire now
          </CTAButton>
        </div>
      </div>
    </section>
  );
}

function RoutedPage({ router }: { router: Router }) {
  if (router.path === '/') return <HomePage router={router} />;
  if (router.path === '/inquiries') return <InquiriesPage router={router} />;

  return <StandardPage data={pageData[router.path]} router={router} />;
}

export default function App() {
  const router = useMiniRouter();
  const isHome = router.path === '/';

  return (
    <main className="bg-black">
      {!isHome ? <NavBar router={router} variant="page" /> : null}
      <RoutedPage router={router} />
      <Footer router={router} />
    </main>
  );
}
