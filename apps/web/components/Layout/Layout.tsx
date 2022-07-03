import type { ReactNode } from "react";
import NextLink from "next/link";
import Head from "next/head";

export const Layout = ({ children }: { children: ReactNode }) => {
	return (
		<>
			<Head>
				<title>Refound</title>
			</Head>
			<header className="flex flex-row-reverse justify-center border-b-2 border-solid sm:justify-between border-primary px-contentPadding">
				<NextLink href="/">
					<a>
						<h1 className="text-4xl leading-none sm:text-8xl ">refound</h1>
					</a>
				</NextLink>
			</header>
			{children}
		</>
	);
};
