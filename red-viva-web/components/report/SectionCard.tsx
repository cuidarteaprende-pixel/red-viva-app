import React from 'react';
import { motion } from 'framer-motion';

interface SectionCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    children: React.ReactNode;
}

export const SectionCard: React.FC<SectionCardProps> = ({ icon, title, description, children }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <header className="space-y-4 text-center">
                <div className="w-16 h-16 bg-white rounded-[1.5rem] shadow-sm flex items-center justify-center text-primary mx-auto border border-slate-50">
                    {icon}
                </div>
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">{title}</h2>
                    <p className="text-slate-400 font-medium text-sm leading-tight max-w-[200px] mx-auto">{description}</p>
                </div>
            </header>

            <div className="space-y-10">
                {children}
            </div>
        </motion.div>
    );
};
