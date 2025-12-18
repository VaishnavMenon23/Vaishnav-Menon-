import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Hero } from './components/Hero';
import { Summary } from './components/Summary';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Experience } from './components/Experience';
import { Certifications } from './components/Certifications';
import { Education } from './components/Education';
import { Contact } from './components/Contact';
import { ThemeToggle } from './components/ThemeToggle';
import { portfolioData } from './data/portfolioData';
import './components/Navigation.css';

export const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Search through projects
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return portfolioData.projects.filter((project: any) =>
      project.title.toLowerCase().includes(query) ||
      project.description?.toLowerCase().includes(query) ||
      project.tags.some((tag: string) => tag.toLowerCase().includes(query)) ||
      project.tech.some((t: string) => t.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  return (
    <div className="font-segoe bg-white dark:bg-microsoft-dark text-microsoft-dark dark:text-microsoft-gray transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-microsoft-dark bg-opacity-95 dark:bg-opacity-95 backdrop-blur-md border-b border-gray-200 dark:border-microsoft-blue">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <a href="#" className="text-xl font-bold text-microsoft-blue dark:text-microsoft-cyan">
            VM
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="hover:text-microsoft-blue transition text-sm font-semibold">
              Home
            </a>
            <a href="#skills" className="hover:text-microsoft-blue transition text-sm font-semibold">
              Skills
            </a>
            <a href="#projects" className="hover:text-microsoft-blue transition text-sm font-semibold">
              Projects
            </a>
            <a href="#experience" className="hover:text-microsoft-blue transition text-sm font-semibold">
              Experience
            </a>
            <a href="#contact" className="hover:text-microsoft-blue transition text-sm font-semibold">
              Contact
            </a>
          </div>

          {/* Search & Mobile Menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-microsoft-dark rounded-lg transition"
            >
              <Search size={20} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="px-4 md:px-8 pb-4 border-t border-gray-200 dark:border-microsoft-blue">
            <div className="flex items-center gap-2 bg-microsoft-gray dark:bg-microsoft-dark border border-microsoft-blue rounded-lg px-3 py-2">
              <Search size={18} className="text-microsoft-blue" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm"
                autoFocus
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')}>
                  <X size={18} className="text-gray-500" />
                </button>
              )}
            </div>
            {searchResults.length > 0 && (
              <div className="mt-4 space-y-2">
                {searchResults.map((project: any) => (
                  <a
                    key={project.id}
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-microsoft-gray dark:bg-microsoft-dark border border-microsoft-blue rounded-lg hover:shadow-md transition text-sm"
                  >
                    <p className="font-semibold text-microsoft-blue dark:text-microsoft-cyan">
                      {project.title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {project.problem}
                    </p>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        <Hero />
        <Summary />
        <section id="skills">
          <Skills />
        </section>
        <section id="projects">
          <Projects />
        </section>
        <section id="experience">
          <Experience />
        </section>
        <Certifications />
        <Education />
        <Contact />
      </main>

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Footer */}
      <footer className="bg-microsoft-dark text-microsoft-gray py-8">
        <div className="max-w-6xl mx-auto px-4 md:px-8 text-center">
          <p className="text-sm">
            © 2025 Vaishnav Padmakumar Menon. Designed & developed with Microsoft Azure & React.
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <a href={portfolioData.contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-microsoft-cyan hover:text-white transition text-sm">
              LinkedIn
            </a>
            <a href={portfolioData.contact.github} target="_blank" rel="noopener noreferrer" className="text-microsoft-cyan hover:text-white transition text-sm">
              GitHub
            </a>
            <a href={`mailto:${portfolioData.contact.email}`} className="text-microsoft-cyan hover:text-white transition text-sm">
              Email
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
