import { siteData } from "@/data/siteData";

export default function Home() {
	return (
		<main className="bg-black text-white min-h-screen font-sans">
			{/* Hero Section */}
			<section className="h-screen flex flex-col justify-center items-center text-center px-6">
				<h1 className="text-4xl md:text-6xl font-bold mb-4">
					{siteData.hero.title}
				</h1>
				<p className="text-lg md:text-2xl mb-6">
					{siteData.hero.subtitle}
				</p>
				<a
					href={siteData.hero.ctaLink}
					target="_blank"
					className="bg-green-500 px-6 py-3 rounded-2xl text-lg font-semibold hover:bg-green-600 transition"
				>
					{siteData.hero.ctaText}
				</a>
			</section>

			{/* About Section */}
			<section className="py-20 px-6 max-w-5xl mx-auto text-center">
				<h2 className="text-3xl font-bold mb-6">{siteData.about.title}</h2>
				<p className="text-lg mb-6">{siteData.about.description}</p>
				<img
					src={siteData.about.image}
					alt="Nawaz"
					className="w-40 h-40 rounded-full mx-auto"
				/>
			</section>

			{/* Why Dubai Section */}
			<section className="py-20 bg-gray-900 px-6 text-center">
				<h2 className="text-3xl font-bold mb-6">{siteData.whyDubai.title}</h2>
				<ul className="space-y-3 text-lg">
					{siteData.whyDubai.points.map((point, idx) => (
						<li key={idx}>{point}</li>
					))}
				</ul>
			</section>

			{/* Contact Form Section */}
			<section className="py-20 px-6 bg-gray-800 text-center">
				<h2 className="text-3xl font-bold mb-4">{siteData.form.title}</h2>
				<p className="mb-8">{siteData.form.description}</p>
				<form
					action={siteData.form.endpoint}
					method="POST"
					className="max-w-md mx-auto space-y-4"
				>
					<input
						type="hidden"
						name="_redirect"
						value="http://localhost:3000/thank-you"
					/>
					<input
						type="text"
						name="name"
						placeholder="Your Name"
						required
						className="w-full p-3 rounded-lg text-black"
					/>
					<input
						type="email"
						name="email"
						placeholder="Your Email"
						required
						className="w-full p-3 rounded-lg text-black"
					/>
					<textarea
						name="message"
						placeholder="Your Message"
						required
						rows={4}
						className="w-full p-3 rounded-lg text-black"
					></textarea>
					<button
						type="submit"
						className="bg-green-500 px-6 py-3 rounded-2xl text-lg font-semibold hover:bg-green-600 transition w-full"
					>
						{siteData.form.buttonText}
					</button>
				</form>
			</section>

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