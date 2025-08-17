"use client";

import { motion } from "framer-motion";

export default function Hero() {
	return (
		<section className="relative h-screen w-full overflow-hidden select-none">
			{/* Background image */}
			<img
				src="/skyline.jpg"
				alt="Dubai Skyline"
				className="absolute inset-0 h-full w-full object-cover"
			/>
			{/* Gradient overlays */}
			<div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90" />
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_40%,rgba(0,255,255,0.25),transparent_70%)]" />
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_50%_at_60%_60%,rgba(168,85,247,0.2),transparent_70%)]" />

			{/* Content */}
			<div className="relative z-10 h-full w-full flex items-center justify-center px-6">
				<div className="max-w-5xl text-center">
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, ease: "easeOut" }}
						className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-widest uppercase"
					>
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-purple-400 to-cyan-300 drop-shadow-[0_0_24px_rgba(34,211,238,0.6)]">
							Nawaz Sells Dubai
						</span>
					</motion.h1>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
						className="mt-6 text-lg md:text-2xl text-gray-200"
					>
						Invest in the future. Prime properties. Zero tax. Global access.
					</motion.p>
											<motion.a
							href="#contact"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 1, ease: "easeOut", delay: 0.35 }}
							className="relative inline-block mt-10 group"
						>
<span className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-yellow-400 via-yellow-300 to-amber-400 blur opacity-40 group-hover:opacity-70 transition" />
													<span className="relative z-10 inline-flex whitespace-nowrap items-center justify-center rounded-2xl bg-black/60 ring-1 ring-amber-300/60 px-6 py-3 text-base md:px-8 md:py-3 md:text-lg font-semibold uppercase tracking-wide text-amber-200 hover:text-white hover:ring-amber-300 shadow-[0_0_30px_rgba(250,204,21,0.25)] transition">
								Find your Investment
							</span>
					</motion.a>
				</div>
			</div>

			{/* Subtle noise overlay for texture */}
			<div className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-[0.07]" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27100%27 height=%27100%27 viewBox=%270 0 100 100%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.65%27 numOctaves=%272%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27/%3E%3C/svg%3E')" }} />
		</section>
	);
}