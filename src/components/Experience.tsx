import { motion } from 'framer-motion';
import { portfolioData } from '../data/portfolioData';

export const Experience = () => {
  const { experience } = portfolioData;

  return (
    <section className="section bg-microsoft-gray dark:bg-microsoft-dark">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">Experience</h2>

          <div className="space-y-8">
            {experience.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-microsoft-dark dark:border dark:border-microsoft-blue rounded-lg p-6 shadow-md"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-microsoft-dark dark:text-white">
                      {job.title}
                    </h3>
                    <p className="text-microsoft-blue dark:text-microsoft-cyan font-semibold">
                      {job.company}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 md:mt-0">
                    {job.startDate} - {job.endDate}
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  {job.location}
                </p>

                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {job.description}
                </p>

                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase">
                    Tools & Services
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {job.tools.map((tool) => (
                      <span
                        key={tool}
                        className="text-xs bg-microsoft-blue text-white px-3 py-1 rounded-full"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
