import { motion } from 'motion/react';
import MediaRow from '../components/MediaRow';
import BrandIcon, { type BrandName } from '../components/BrandIcon';
import { sectionAnchorId, SECTIONS } from '../config/sections';
import { useDecorativeEntrance } from '../config/motion';
import './FunFactsSection.css';

const MOVIES = [
  { slug: 'everything-everywhere-all-at-once', title: 'Everything Everywhere All at Once' },
  { slug: 'didi', title: 'Didi' },
  { slug: 'the-end-of-evangelion', title: 'The End of Evangelion' },
  { slug: 'perfect-blue', title: 'Perfect Blue' },
  { slug: 'grave-of-the-fireflies', title: 'Grave of the Fireflies' },
];

const ALBUMS = [
  { slug: 'my-beautiful-dark-twisted-fantasy', title: 'My Beautiful Dark Twisted Fantasy', artist: 'Kanye West' },
  { slug: 'folklore', title: 'Folklore', artist: 'Taylor Swift' },
  { slug: 'to-pimp-a-butterfly', title: 'To Pimp a Butterfly', artist: 'Kendrick Lamar' },
  { slug: 'nurture', title: 'Nurture', artist: 'Porter Robinson' },
  { slug: 'brat', title: 'Brat', artist: 'Charli XCX' },
];

const MORE_SOCIALS: { key: BrandName; label: string; href: string }[] = [
  { key: 'spotify', label: 'Spotify', href: 'https://open.spotify.com/user/m0i5xsuih49u4lf6m9nn7i09m' },
  { key: 'letterboxd', label: 'Letterboxd', href: 'https://letterboxd.com/matthewcendana/' },
  { key: 'chessdotcom', label: 'Chess.com', href: 'https://www.chess.com/member/matthewcenzz' },
];

const anchorId = sectionAnchorId(SECTIONS.find((s) => s.table === 'fun_facts')!.path);

export default function FunFactsSection() {
  const item = useDecorativeEntrance();

  return (
    <section id={anchorId} className="fun-facts page-section" aria-labelledby="fun-facts-heading">
      <motion.h1
        id="fun-facts-heading"
        className="fun-facts__heading"
        variants={item}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        Fun Facts
      </motion.h1>

      <motion.div
        className="fun-facts__intro-block"
        variants={item}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <p className="fun-facts__text">
          I&rsquo;m originally from San Jose, California, and have lived in the Bay Area my whole life. I&rsquo;m
          also a proud Filipino American, and I currently work as a Community and Outreach Intern at UCSC&rsquo;s
          Asian American and Pacific Islander Resource Center. My background and experiences have played a
          meaningful role in shaping my interests, values, and the person I am today. You can even see some of that
          reflected in my favorite movies below!
        </p>
        <p className="fun-facts__text">
          Outside of coding, I enjoy going to the gym, playing chess, running, and playing pickleball.
        </p>
      </motion.div>

      <motion.div className="fun-facts__block" variants={item} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <h2 className="fun-facts__subheading">Favorite Movies</h2>
        <MediaRow
          items={MOVIES}
          aspectRatio="2 / 3"
          imageWidth={400}
          imageHeight={600}
          basePath="/media/movies"
          altSuffix="movie poster"
        />
      </motion.div>

      <motion.div className="fun-facts__block" variants={item} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <h2 className="fun-facts__subheading">Favorite Music Albums</h2>
        <MediaRow
          items={ALBUMS}
          aspectRatio="1 / 1"
          imageWidth={500}
          imageHeight={500}
          basePath="/media/albums"
          altSuffix="album cover"
        />
      </motion.div>

      <motion.div
        className="fun-facts__block fun-facts__block--socials"
        variants={item}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="fun-facts__subheading">More Socials</h2>
        <div className="fun-facts__more-socials">
          {MORE_SOCIALS.map((social) => (
            <a
              key={social.key}
              className="fun-facts__more-social-link"
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <BrandIcon name={social.key} />
              <span>{social.label}</span>
            </a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
