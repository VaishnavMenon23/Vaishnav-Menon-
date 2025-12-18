import { motion } from 'framer-motion';
import { Award, ExternalLink } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export const Certifications = () => {
  const { certifications } = portfolioData;

  return (
    <section className="section bg-white dark:bg-microsoft-dark">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">Certifications</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {certifications.map((cert, index) => (
              <motion.a
                key={cert.id}
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-microsoft-blue to-microsoft-blue-light dark:from-microsoft-dark dark:to-microsoft-dark dark:border dark:border-microsoft-blue rounded-lg p-6 text-white dark:text-microsoft-cyan text-center hover:shadow-lg transition-shadow cursor-pointer"
              >
                <Award className="mx-auto mb-4" size={40} />
                <h3 className="font-bold text-lg mb-2">{cert.name}</h3>
                <p className="text-sm opacity-90 mb-3">{cert.issuer}</p>
                <p className="text-xs opacity-75 mb-3">Issued: {cert.date}</p>
                <div className="flex items-center justify-center gap-1 text-sm">
                  <ExternalLink size={14} /> View Credential
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
