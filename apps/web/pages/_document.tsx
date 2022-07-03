import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
	return (
		<Html>
			<Head>
				<link rel="preload" as="font" href="/fonts/primary-Regular.woff2" />
				<link rel="preload" as="font" href="/fonts/primary-Italic.woff2" />
				<link rel="preload" as="font" href="/fonts/primary-Bold.woff2" />
				<link rel="preload" as="font" href="/fonts/primary-BoldItalic.woff2" />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
