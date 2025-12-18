import { motion } from 'framer-motion';
import { portfolioData } from '../data/portfolioData';

export const Education = () => {
  const { education } = portfolioData;

  return (
    <section className="section bg-microsoft-gray dark:bg-microsoft-dark">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">Education</h2>

          <div className="bg-white dark:bg-microsoft-dark dark:border dark:border-microsoft-blue rounded-lg p-8 shadow-md">
            <h3 className="text-2xl font-bold text-microsoft-dark dark:text-white mb-2">
              {education.degree}
            </h3>
            <p className="text-xl text-microsoft-blue dark:text-microsoft-cyan font-semibold mb-1">
              {education.institution}
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {education.location} • Graduated {education.graduationYear}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase">
                  GPA
                </p>
                <p className="text-2xl font-bold text-microsoft-blue dark:text-microsoft-cyan">
                  {education.gpa}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase">
                  Relevant Coursework
                </p>
                <div className="flex flex-wrap gap-2">
                  {education.relevantCoursework.map((course) => (
                    <span
                      key={course}
                      className="text-xs bg-microsoft-blue text-white px-3 py-1 rounded-full"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-microsoft-blue">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase">
                Capstone Project
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                {education.capstoneProject}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
