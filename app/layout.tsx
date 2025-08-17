import "./globals.css";
import PageTransition from "@/components/PageTransition";
import CursorGlow from "@/components/CursorGlow";
import Script from "next/script";

export const metadata = {
	title: "Nawaz Sells Dubai",
	description: "Invest Smart in Dubai Real Estate with Nawaz",
	icons: {
		icon: [
			{ url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
			{ url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
		],
		apple: [
			{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
		],
		other: [
			{ rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#D4AF37" },
		],
	},
	manifest: "/site.webmanifest",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<head>
				<Script
					src="https://www.googletagmanager.com/gtag/js?id=G-YZR8JTC07R"
					strategy="afterInteractive"
				/>
				<Script id="google-analytics" strategy="afterInteractive">
					{`
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());

						gtag('config', 'G-YZR8JTC07R');
					`}
				</Script>
			</head>
			<body className="scroll-smooth">
				<PageTransition>{children}</PageTransition>
				<CursorGlow />
			</body>
		</html>
	);
}