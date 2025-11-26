import React from "react";
import { Github, Twitter, Linkedin, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative mt-auto border-t border-base-content/5 bg-base-100/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              PairVerse
            </h3>
            <p className="text-base-content/60 max-w-sm leading-relaxed">
              Connect, collaborate, and grow with developers worldwide.
              Find your perfect coding partner today.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-base-content mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-base-content/60 hover:text-primary transition-colors">About</a></li>
              <li><a href="#" className="text-base-content/60 hover:text-primary transition-colors">Features</a></li>
              <li><a href="#" className="text-base-content/60 hover:text-primary transition-colors">Careers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-base-content mb-4">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-full bg-base-content/5 hover:bg-primary/10 hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-base-content/5 hover:bg-primary/10 hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-base-content/5 hover:bg-primary/10 hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-base-content/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-base-content/40">
            © {new Date().getFullYear()} PairVerse. All rights reserved.
          </p>
          <p className="text-sm text-base-content/40 flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-error fill-error" /> by Developers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;