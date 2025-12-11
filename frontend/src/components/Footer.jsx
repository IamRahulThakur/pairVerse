import React from "react";
import { Github, Twitter, Linkedin, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8 mb-12">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              PairVerse
            </h3>
            <p className="text-slate-500 max-w-sm leading-relaxed text-sm">
              Connect, collaborate, and grow with developers worldwide.
              Find your perfect coding partner today.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-4 text-sm tracking-wide">Platform</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">About</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">Features</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">Careers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-4 text-sm tracking-wide">Connect</h4>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-all">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} PairVerse. All rights reserved.
          </p>
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> by Developers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;