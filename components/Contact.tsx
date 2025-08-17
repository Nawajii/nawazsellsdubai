"use client";

import { motion } from "framer-motion";
import { siteData } from "@/data/siteData";

export default function Contact() {
	return (
		<section id="contact" className="py-20 px-6">
			<div className="max-w-6xl mx-auto text-center mb-8">
				<h2 className="text-3xl md:text-4xl font-bold uppercase">{siteData.form.title}</h2>
				<p className="mt-2 text-gray-300">{siteData.form.description}</p>
			</div>
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.3 }}
				transition={{ duration: 0.6 }}
				className="flex justify-center"
			>
				<motion.a
					href={siteData.hero.ctaLink}
					target="_blank"
					rel="noopener noreferrer"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.1 }}
					className="relative inline-block mt-4 group"
				>
					<span className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-yellow-400 via-yellow-300 to-amber-400 blur opacity-40 group-hover:opacity-70 transition" />
					<span className="relative z-10 inline-flex whitespace-nowrap items-center justify-center rounded-2xl bg-black/60 ring-1 ring-amber-300/60 px-4 py-2 text-sm md:px-8 md:py-3 md:text-lg font-semibold uppercase tracking-normal md:tracking-wide text-amber-200 hover:text-white hover:ring-amber-300 shadow-[0_0_30px_rgba(250,204,21,0.25)] transition">
						Get in Touch
					</span>
				</motion.a>
			</motion.div>
		</section>
	);
}