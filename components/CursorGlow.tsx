"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

export default function CursorGlow() {
	const x = useMotionValue(0);
	const y = useMotionValue(0);
	const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.6 });
	const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.6 });

	useEffect(() => {
		const handle = (e: MouseEvent) => {
			x.set(e.clientX);
			y.set(e.clientY);
		};
		window.addEventListener("mousemove", handle);
		return () => window.removeEventListener("mousemove", handle);
	}, [x, y]);

	return (
		<div className="pointer-events-none fixed inset-0 z-50 mix-blend-screen">
			<motion.div
				className="w-3 h-3 rounded-full"
				style={{ translateX: sx, translateY: sy, filter: "blur(1px)" }}
			>
				<span className="block w-full h-full rounded-full bg-cyan-400 shadow-[0_0_24px_6px_rgba(34,211,238,0.7)]" />
			</motion.div>
		</div>
	);
}