import { getPrismicClient } from "@/services/prismic";
import { GetStaticProps } from "next";
import { RichText } from "prismic-dom";

import Head from "next/head";
import styles from "./styles.module.scss";
import Prismic from 'prismic-javascript';
import Link from "next/link";


type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string
}

interface PostsProps {
  posts: Post[]
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {
            posts.map(post => (
              <Link href={`/posts/${post.slug}`} key={post.slug}>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </Link>
            ))
          }

        </div>
      </main>
    </>
  );
}


export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query(
    [Prismic.Predicates.at('document.type', 'publication')],
    {
      fetch: ['publication.title', 'publication.content'],
      pageSize: 100,
    }
  );

  const posts = response.results.map(post => {
    return {
      slug: post.id,
      title: RichText.asText(post.data.title),
      excerpt: post.data.content.find((content: { type: string }) => content.type === 'paragraph')?.text,
      updatedAt: new Date(post.last_publication_date ?? '').toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    }
  })

  return {
    props: {
      posts
    }
  }
}