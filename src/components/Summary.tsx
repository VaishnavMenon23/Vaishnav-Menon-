import { motion } from 'framer-motion';
import { portfolioData } from '../data/portfolioData';

export const Summary = () => {
  const { summary } = portfolioData;

  return (
    <section className="section bg-white dark:bg-microsoft-dark">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">About Me</h2>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-microsoft-gray">
            {summary}
          </p>
        </motion.div>
      </div>
    </section>
  );
};
