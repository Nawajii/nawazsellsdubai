export default function ThankYouPage() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
			<h1 className="text-4xl font-bold text-green-600 mb-4">Thank You!</h1>
			<p className="text-gray-700 text-lg text-center max-w-md">
				Your message has been sent successfully. I’ll get back to you soon.
			</p>
			<a
				href="/"
				className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
			>
				Back to Home
			</a>
		</div>
	)
}