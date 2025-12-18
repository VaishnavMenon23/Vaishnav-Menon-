import { motion } from 'framer-motion';
import { Mail, Phone, Linkedin, Github, Calendar } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export const Contact = () => {
  const { contact } = portfolioData;

  const contactItems = [
    {
      icon: Mail,
      label: 'Email',
      value: contact.email,
      href: `mailto:${contact.email}`,
    },
    {
      icon: Phone,
      label: 'Phone',
      value: contact.phone,
      href: `tel:${contact.phone}`,
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'Connect',
      href: contact.linkedin,
    },
    {
      icon: Github,
      label: 'GitHub',
      value: 'View',
      href: contact.github,
    },
  ];

  return (
    <section id="contact" className="section bg-white dark:bg-microsoft-dark">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title text-center">Get In Touch</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {contactItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.a
                  key={index}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-microsoft-gray dark:bg-microsoft-dark dark:border dark:border-microsoft-blue rounded-lg p-6 hover:shadow-lg transition-shadow flex items-center gap-4"
                >
                  <div className="bg-microsoft-blue text-white p-4 rounded-lg">
                    <Icon size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 uppercase font-semibold">
                      {item.label}
                    </p>
                    <p className="text-lg font-semibold text-microsoft-dark dark:text-white truncate">
                      {item.value}
                    </p>
                  </div>
                </motion.a>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center space-y-4"
          >
            <a
              href={contact.calendly}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2 bg-microsoft-blue text-white hover:bg-microsoft-blue-light"
            >
              <Calendar size={20} /> Schedule Interview
            </a>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <a
                href={contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary border-microsoft-blue text-microsoft-blue dark:border-microsoft-cyan dark:text-microsoft-cyan"
              >
                Explore My Code
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="btn-secondary border-microsoft-blue text-microsoft-blue dark:border-microsoft-cyan dark:text-microsoft-cyan"
              >
                Send Me a Message
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
