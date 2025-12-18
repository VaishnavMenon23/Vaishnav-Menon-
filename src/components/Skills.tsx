import { useState } from 'react';
import { motion } from 'framer-motion';
import { portfolioData } from '../data/portfolioData';

export const Skills = () => {
  const { skills } = portfolioData;
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof skills>('ai');

  const categories = [
    { key: 'ai', label: 'AI & ML', icon: '🧠' },
    { key: 'data', label: 'Data & Analytics', icon: '📊' },
    { key: 'security', label: 'Cybersecurity', icon: '🔒' },
    { key: 'devsecops', label: 'DevSecOps', icon: '⚙️' },
    { key: 'productivity', label: 'Productivity', icon: '💻' },
  ];

  const selectedSkills = skills[selectedCategory];

  return (
    <section className="section bg-microsoft-gray dark:bg-microsoft-dark">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">Skills & Tools</h2>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key as keyof typeof skills)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 flex items-center gap-2 ${
                  selectedCategory === cat.key
                    ? 'bg-microsoft-blue text-white shadow-lg'
                    : 'bg-white dark:bg-microsoft-dark dark:border dark:border-microsoft-blue text-microsoft-dark dark:text-microsoft-cyan hover:shadow-md'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedSkills.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="skill-card"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-microsoft-dark dark:text-white">
                    {skill.name}
                  </h3>
                  <span className="text-sm font-bold text-microsoft-blue dark:text-microsoft-cyan">
                    {skill.proficiency}%
                  </span>
                </div>
                <div className="w-full bg-gray-300 dark:bg-microsoft-dark rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.proficiency}%` }}
                    transition={{ duration: 1, delay: 0.2 + index * 0.05 }}
                    viewport={{ once: true }}
                    className="h-full bg-gradient-to-r from-microsoft-blue to-microsoft-cyan rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
