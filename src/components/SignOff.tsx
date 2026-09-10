import { motion } from 'motion/react';
import { useDecorativeEntrance } from '../config/motion';
import './SignOff.css';

// The closing block: just "Thanks for visiting!" — the last thing on the
// page, after Fun Facts. Not one of the scroll-spied sections. Contact
// links (email, LinkedIn, GitHub) live in the About Me section and the
// persistent nav instead of being repeated here.
export default function SignOff() {
  const item = useDecorativeEntrance();

  return (
    <div className="sign-off">
      <motion.p className="sign-off__message" variants={item} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        Thanks for visiting!
      </motion.p>
    </div>
  );
}
