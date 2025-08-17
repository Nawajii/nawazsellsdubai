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
				className="max-w-xl mx-auto rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-6"
			>
				<form action={siteData.form.endpoint} method="POST" className="space-y-6">
					<input type="hidden" name="_redirect" value="http://localhost:3000/thank-you" />

					<div className="relative">
						<input
							type="text"
							name="name"
							required
							placeholder="Your Name"
							className="peer w-full bg-black/20 text-white placeholder-transparent rounded-xl p-4 ring-1 ring-white/20 focus:ring-cyan-400 outline-none transition"
						/>
						<label className="pointer-events-none absolute left-4 top-4 text-gray-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs">Your Name</label>
					</div>

					<div className="relative">
						<input
							type="email"
							name="email"
							required
							placeholder="Your Email"
							className="peer w-full bg-black/20 text-white placeholder-transparent rounded-xl p-4 ring-1 ring-white/20 focus:ring-cyan-400 outline-none transition"
						/>
						<label className="pointer-events-none absolute left-4 top-4 text-gray-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs">Your Email</label>
					</div>

					<div className="relative">
						<textarea
							name="message"
							required
							rows={4}
							placeholder="Your Message"
							className="peer w-full bg-black/20 text-white placeholder-transparent rounded-xl p-4 ring-1 ring-white/20 focus:ring-cyan-400 outline-none transition"
						/>
						<label className="pointer-events-none absolute left-4 top-4 text-gray-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs">Your Message</label>
					</div>

					<div className="p-[2px] rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500">
						<button
							type="submit"
							className="w-full rounded-2xl bg-black/60 px-6 py-3 text-lg font-semibold uppercase tracking-wide hover:bg-black/40 transition"
						>
							{siteData.form.buttonText}
						</button>
					</div>
				</form>
			</motion.div>
		</section>
	);
}