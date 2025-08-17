import "./globals.css";
import PageTransition from "@/components/PageTransition";
import CursorGlow from "@/components/CursorGlow";

export const metadata = {
	title: "Nawaz Sells Dubai",
	description: "Invest Smart in Dubai Real Estate with Nawaz",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className="scroll-smooth">
				<PageTransition>{children}</PageTransition>
				<CursorGlow />
			</body>
		</html>
	);
}