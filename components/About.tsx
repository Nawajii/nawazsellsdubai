"use client";

import { motion } from "framer-motion";
import { Shield, TrendingUp, Users, Building2 } from "lucide-react";

const items = [
	{
		icon: Shield,
		title: "Trusted Advisory",
		desc: "Transparent guidance with investor-first priorities.",
	},
	{
		icon: TrendingUp,
		title: "ROI Focused",
		desc: "Opportunities vetted for growth and cash flow.",
	},
	{
		icon: Users,
		title: "Global Network",
		desc: "Access to premium off-market deals and partners.",
	},
	{
		icon: Building2,
		title: "Dubai Expertise",
		desc: "Deep market knowledge across prime communities.",
	},
];

export default function About() {
	return (
		<section className="relative py-20 px-6">
			<div className="max-w-6xl mx-auto text-center mb-10">
				<h2 className="text-3xl md:text-4xl font-bold tracking-wide uppercase">About Nawaz</h2>
				<p className="mt-3 text-gray-300">Investor-focused, data-backed, and relationship-driven.</p>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
				{items.map((item, idx) => (
					<motion.div
						key={idx}
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.2 }}
						transition={{ duration: 0.5, delay: idx * 0.06 }}
						className="group rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-6 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 transition"
					>
						<item.icon className="h-10 w-10 text-cyan-300 drop-shadow-[0_0_12px_rgba(34,211,238,0.5)]" />
						<h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
						<p className="mt-2 text-gray-300">{item.desc}</p>
					</motion.div>
				))}
			</div>
		</section>
	);
}