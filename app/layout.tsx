import "./globals.css";

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
			<body>{children}</body>
		</html>
	);
}