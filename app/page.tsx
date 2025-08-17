import { siteData } from "@/data/siteData";
import Hero from "@/components/Hero";
import About from "@/components/About";
import WhyDubai from "@/components/WhyDubai";
import Contact from "@/components/Contact";

export default function Home() {
	return (
		<main className="bg-black text-white min-h-screen font-sans">
			<Hero />

			<About />

			<WhyDubai />

			<Contact />

			{/* Footer */}
			<footer className="py-10 bg-black text-center">
				<p className="mb-4">Follow me</p>
				<div className="flex justify-center gap-6">
					<a href={siteData.socials.linkedin} target="_blank">LinkedIn</a>
					<a href={siteData.socials.instagram} target="_blank">Instagram</a>
					<a href={siteData.socials.tiktok} target="_blank">TikTok</a>
					<a href={siteData.socials.youtube} target="_blank">YouTube</a>
				</div>
				<p className="mt-6 text-gray-400 text-sm">© 2025 Nawaz Sells Dubai</p>
			</footer>
		</main>
	);
}