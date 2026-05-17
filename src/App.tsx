import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { useRef } from 'react';

type MultiStyleSegment = {
  text: string;
  className?: string;
};

type FeatureCardProps = {
  index: number;
  title: string;
  number: string;
  iconUrl?: string;
  items?: string[];
  videoUrl?: string;
  videoLabel?: string;
};

const heroVideoUrl =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4';

const featuresVideoUrl =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4';

const featureCards: FeatureCardProps[] = [
  {
    index: 0,
    title: 'Your creative canvas.',
    number: '00',
    videoUrl: featuresVideoUrl,
    videoLabel: 'Your creative canvas.',
  },
  {
    index: 1,
    title: 'Project Storyboard.',
    number: '01',
    iconUrl:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171918_4a5edc79-d78f-4637-ac8b-53c43c220606.png&w=1280&q=85',
    items: [
      'Frame your production with scene-by-scene clarity.',
      'Track revisions, references, and visual arcs in one place.',
      'Shape tone boards that stay aligned with the final cut.',
      'Share a living blueprint with your creative collaborators.',
    ],
  },
  {
    index: 2,
    title: 'Smart Critiques.',
    number: '02',
    iconUrl:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171741_ed9845ab-f5b2-4018-8ce7-07cc01823522.png&w=1280&q=85',
    items: [
      'AI analysis tuned for pacing, visual rhythm, and emotional weight.',
      'Creative notes that surface opportunities without flattening your voice.',
      'Tool integrations that keep reviews flowing inside your studio stack.',
    ],
  },
  {
    index: 3,
    title: 'Immersion Capsule.',
    number: '03',
    iconUrl:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171809_f56666dc-c099-4778-ad82-9ad4f209567b.png&w=1280&q=85',
    items: [
      'Silence stray notifications while you move through focused sessions.',
      'Layer ambient soundscapes that match the world you are building.',
      'Sync schedules so the studio can slip into the same creative window.',
    ],
  },
];

const customEase = [0.16, 1, 0.3, 1] as const;
const cardEase = [0.22, 1, 0.36, 1] as const;

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
    segment.text.split(' ').map((word) => ({
      word,
      className: segment.className ?? '',
    })),
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

function FeatureCard({ index, title, number, iconUrl, items, videoUrl, videoLabel }: FeatureCardProps) {
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
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          src={videoUrl}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/70" />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
          <p className="text-xl sm:text-2xl md:text-3xl" style={{ color: '#E1E0CC' }}>
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
        {iconUrl ? (
          <img
            src={iconUrl}
            alt={title}
            className="h-10 w-10 rounded-xl object-cover sm:h-12 sm:w-12"
          />
        ) : (
          <div />
        )}
        <span className="text-sm tracking-[0.16em] text-gray-500">{number}</span>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl sm:text-[1.75rem]" style={{ color: '#E1E0CC' }}>
          {title}
        </h3>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-8">
        <ul className="space-y-4">
          {items?.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="text-sm leading-[1.35] text-gray-400 sm:text-[15px]">{item}</span>
            </li>
          ))}
        </ul>

        <a
          href="#"
          className="inline-flex items-center gap-2 text-sm text-primary transition-transform hover:translate-x-1"
        >
          <span>Learn more</span>
          <ArrowRight className="-rotate-45 h-4 w-4" />
        </a>
      </div>
    </motion.article>
  );
}

export default function App() {
  const aboutParagraphRef = useRef<HTMLParagraphElement | null>(null);
  const aboutText =
    'Over the last seven years, I have worked with Parallax, a Berlin-based production house that crafts cinema, series, and Noir Studio in Paris. Together, we have created work that has earned international acclaim at several major festivals.';
  const characters = aboutText.split('');
  const { scrollYProgress } = useScroll({
    target: aboutParagraphRef,
    offset: ['start 0.8', 'end 0.2'],
  });

  return (
    <main className="bg-black">
      <section className="h-screen bg-black p-4 md:p-6">
        <div className="relative h-full overflow-hidden rounded-2xl md:rounded-[2rem]">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
            src={heroVideoUrl}
          />
          <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.7] mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

          <nav className="absolute left-1/2 top-0 z-20 -translate-x-1/2">
            <div className="flex items-center gap-3 rounded-b-2xl bg-black px-4 py-2 sm:gap-6 md:rounded-b-3xl md:px-8 lg:gap-14 md:gap-12">
              {['Our story', 'Collective', 'Workshops', 'Programs', 'Inquiries'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-[10px] transition-colors sm:text-xs md:text-sm"
                  style={{ color: 'rgba(225, 224, 204, 0.8)' }}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.color = '#E1E0CC';
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.color = 'rgba(225, 224, 204, 0.8)';
                  }}
                >
                  {item}
                </a>
              ))}
            </div>
          </nav>

          <div className="absolute bottom-0 left-0 right-0 z-10 p-5 sm:p-6 md:p-8 lg:p-10">
            <div className="grid items-end gap-6 md:grid-cols-12 md:gap-8">
              <div className="md:col-span-8">
                <WordsPullUp
                  text="Prisma"
                  showAsterisk
                  className="text-[26vw] font-medium leading-[0.85] tracking-[-0.07em] sm:text-[24vw] md:text-[22vw] lg:text-[20vw] xl:text-[19vw] 2xl:text-[20vw]"
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

                <motion.a
                  href="#"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.9, delay: 0.7, ease: customEase }}
                  className="group mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-3 py-3 pl-5 text-sm font-medium text-black transition-all hover:gap-3 sm:text-base"
                >
                  <span>Join the lab</span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform group-hover:scale-110 sm:h-10 sm:w-10">
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </span>
                </motion.a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black px-4 py-20 sm:px-6 md:px-8 md:py-28">
        <div className="mx-auto max-w-6xl rounded-[2rem] bg-[#101010] px-6 py-12 text-center sm:px-10 sm:py-16 md:px-14 md:py-20">
          <p className="mb-5 text-[10px] uppercase tracking-[0.24em] text-primary sm:text-xs">
            Visual arts
          </p>

          <WordsPullUpMultiStyle
            segments={[
              { text: 'I am Marcus Chen,', className: 'font-normal' },
              {
                text: 'a self-taught director.',
                className: 'font-serif italic',
              },
              {
                text: 'I have skills in color grading, visual effects, and narrative design.',
                className: 'font-normal',
              },
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
                {
                  text: 'Studio-grade workflows for visionary creators.',
                  className: '',
                },
                {
                  text: 'Built for pure vision. Powered by art.',
                  className: 'text-gray-500',
                },
              ]}
              className="justify-center text-xl font-normal leading-[1.1] sm:text-2xl md:text-3xl lg:text-4xl"
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2 md:gap-1 lg:h-[480px] lg:grid-cols-4">
            {featureCards.map((card) => (
              <FeatureCard key={card.number} {...card} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
