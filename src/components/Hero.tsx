import { motion } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export const Hero = () => {
  const { hero, contact } = portfolioData;

  return (
    <section className="section min-h-screen flex items-center justify-center bg-gradient-to-br from-microsoft-blue via-microsoft-blue-light to-microsoft-cyan dark:from-microsoft-dark dark:via-microsoft-dark dark:to-microsoft-dark">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            {hero.name}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="text-2xl md:text-3xl text-white font-light mb-6">
            {hero.title}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <p className="text-lg md:text-xl text-white text-opacity-90 mb-12 max-w-2xl mx-auto">
            {hero.tagline}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a
            href={contact.calendly}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary bg-white text-microsoft-blue hover:bg-microsoft-gray inline-flex items-center gap-2"
          >
            Hire Me <ArrowRight size={20} />
          </a>
          <a
            href={contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary border-white text-white hover:bg-white hover:text-microsoft-blue inline-flex items-center gap-2"
          >
            View Code <ArrowRight size={20} />
          </a>
          <a
            href="#contact"
            className="btn-secondary border-white text-white hover:bg-white hover:text-microsoft-blue inline-flex items-center gap-2"
          >
            <Download size={20} /> Resume
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-20"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <p className="text-white text-opacity-70">Scroll to explore</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
