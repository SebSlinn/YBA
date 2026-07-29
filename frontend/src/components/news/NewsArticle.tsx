//frontend/src/components/news/NewsArticle.tsx

import Image from "next/image";
import Link from "next/link";

import RichText from "@/components/common/RichText";
import { NewsArticle as NewsArticleModel } from "@/types/news";

interface NewsArticleProps {
    article: NewsArticleModel;
}

export default function NewsArticle({
    article,
}: NewsArticleProps) {
    return (
        <article className="mx-auto max-w-5xl px-6 py-12">

            <Image
                src={article.featuredImage}
                alt={article.title}
                width={1400}
                height={800}
                className="mb-8 w-full rounded-xl object-cover"
            />

            <p className="text-sm uppercase tracking-wider text-gray-500">
                {article.category}
            </p>

            <h1 className="mt-2 text-5xl font-bold">
                {article.title}
            </h1>

            <p className="mt-4 text-lg text-gray-600">
                {article.summary}
            </p>

            <p className="mt-2 text-sm text-gray-500">
                {article.publishedDate}
            </p>

            <div className="mt-10">
                <RichText html={article.content} />
                {article.externalReferences &&
                    article.externalReferences.length > 0 && (

                        <section className="mt-12 border-t pt-8">

                            <h2 className="mb-4 text-2xl font-bold">
                                Related Links
                            </h2>

                            <ul className="space-y-3">

                                {article.externalReferences.map((link) => (

                                    <li key={link.url}>

                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-700 hover:underline"
                                        >
                                            {link.title}
                                        </a>

                                    </li>

                                ))}

                            </ul>

                        </section>

                    )}
            </div>

            <div className="mt-12 border-t pt-8">

                <Link
                    href="/news"
                    className="font-semibold hover:underline"
                >
                    ← Back to School News
                </Link>

            </div>

        </article>
    );
}