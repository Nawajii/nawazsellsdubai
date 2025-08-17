"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";
import { Globe2, ShieldCheck, PercentCircle, Landmark } from "lucide-react";

export default function WhyDubai() {
	return (
		<section className="relative py-24 px-6 overflow-hidden">
			{/* Gradient mesh background */}
			<div className="pointer-events-none absolute inset-0 -z-10">
				<div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-950" />
				<div className="absolute inset-0 opacity-30 bg-[radial-gradient(40%_40%_at_70%_20%,rgba(34,211,238,0.25),transparent_70%),radial-gradient(35%_35%_at_20%_80%,rgba(168,85,247,0.25),transparent_70%)]" />
				<div className="absolute inset-0 opacity-[0.12] bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:40px_40px]" />
			</div>

			<div className="max-w-6xl mx-auto">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold tracking-wide uppercase">Why Dubai</h2>
					<p className="mt-3 text-gray-300">A global hub for capital, lifestyle, and growth.</p>
				</div>

				{/* Counters */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
					{[
						{ icon: Globe2, label: "Nationalities Investing", end: 200, suffix: "+" },
						{ icon: PercentCircle, label: "Income Tax", end: 0, suffix: "%" },
						{ icon: ShieldCheck, label: "Safest Cities Rank", end: 5, prefix: "Top " },
					].map((s, i) => (
						<motion.div
							key={i}
							initial={{ opacity: 0, y: 24 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.3 }}
							transition={{ duration: 0.5, delay: i * 0.08 }}
							className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md p-6 text-center"
						>
							<s.icon className="h-8 w-8 mx-auto text-cyan-300" />
							<div className="mt-3 text-3xl font-extrabold">
								{s.prefix}
								<CountUp end={s.end} duration={1.8} separator="," />
								{s.suffix}
							</div>
							<p className="text-gray-300 mt-1">{s.label}</p>
						</motion.div>
					))}
				</div>

				{/* Icon grid blurbs */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{[
						{ icon: Landmark, title: "World-Class Infrastructure", text: "Smart planning, connectivity, and prime architecture." },
						{ icon: Globe2, title: "Gateway City", text: "Strategic timezone and global flight access." },
						{ icon: PercentCircle, title: "Investor-Friendly", text: "No income tax and competitive property yields." },
						{ icon: ShieldCheck, title: "Safety & Stability", text: "Consistently ranked among the safest cities." },
					].map((b, i) => (
						<motion.div
							key={i}
							initial={{ opacity: 0, y: 24 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.2 }}
							transition={{ duration: 0.5, delay: 0.2 + i * 0.06 }}
							className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-6 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 transition"
						>
							<b.icon className="h-8 w-8 text-purple-300" />
							<h3 className="mt-3 font-semibold text-lg">{b.title}</h3>
							<p className="text-gray-300 mt-1">{b.text}</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}