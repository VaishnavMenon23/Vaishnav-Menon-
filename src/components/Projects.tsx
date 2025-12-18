import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export const Projects = () => {
  const { projects } = portfolioData;
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = Array.from(new Set(projects.flatMap((p) => p.tags)));

  const filteredProjects = selectedTag
    ? projects.filter((p) => p.tags.includes(selectedTag))
    : projects;

  return (
    <section className="section bg-white dark:bg-microsoft-dark">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">Featured Projects</h2>

          {/* Tag Filter */}
          <div className="flex flex-wrap gap-2 mb-12 justify-center">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                selectedTag === null
                  ? 'bg-microsoft-blue text-white'
                  : 'bg-gray-200 dark:bg-microsoft-dark dark:border dark:border-microsoft-blue text-gray-700 dark:text-microsoft-cyan'
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  selectedTag === tag
                    ? 'bg-microsoft-blue text-white'
                    : 'bg-gray-200 dark:bg-microsoft-dark dark:border dark:border-microsoft-blue text-gray-700 dark:text-microsoft-cyan'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="project-card"
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold text-microsoft-dark dark:text-white mb-3">
                    {project.title}
                  </h3>

                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-sm font-semibold text-microsoft-blue dark:text-microsoft-cyan mb-1">
                        Problem
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {project.problem}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-microsoft-blue dark:text-microsoft-cyan mb-1">
                        Solution
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {project.action}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-microsoft-blue dark:text-microsoft-cyan mb-1">
                        Impact
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {project.result}
                      </p>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="bg-microsoft-gray dark:bg-microsoft-dark dark:border dark:border-microsoft-blue rounded-lg p-3 mb-4">
                    <div className="flex flex-wrap gap-4">
                      {Object.entries(project.metrics).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                            {key}
                          </p>
                          <p className="text-lg font-bold text-microsoft-blue dark:text-microsoft-cyan">
                            {value}
                            {typeof value === 'number' && value > 0 ? '%' : ''}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Tech Stack */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase">
                      Tech Stack
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs bg-blue-100 dark:bg-microsoft-dark dark:border dark:border-microsoft-blue text-microsoft-blue dark:text-microsoft-cyan px-2 py-1 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Links */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-microsoft-blue">
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold text-microsoft-blue dark:text-microsoft-cyan hover:opacity-80 transition"
                    >
                      <Github size={16} /> Code
                    </a>
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold text-microsoft-blue dark:text-microsoft-cyan hover:opacity-80 transition"
                    >
                      <ExternalLink size={16} /> Demo
                    </a>
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
