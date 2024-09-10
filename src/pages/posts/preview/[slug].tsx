import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";

import { getPrismicClient } from "@/services/prismic";
import { RichText } from "prismic-dom";
import styles from '../post.module.scss';
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Session } from "next-auth";

interface PostPreviewProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string
  }
}

interface CustomSession extends Session {
  activeSubscription?: string | null;
}

export default function PostPreview({ post }: PostPreviewProps) {
  const { data }: { data: CustomSession | null } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (data?.activeSubscription) {
      router.push(`/posts/${post.slug}`)
    }
  }, [data])

  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div 
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />

          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href='/'>
              Subscribe now 🤗
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as { slug: string };
  
  const prismic = getPrismicClient();
  const response = await prismic.getByID(slug, {});

  const post = {
    slug,
    title: RichText.asText(response?.data.title),
    content: RichText.asHtml(response?.data.content.splice(0, 3)),
    updatedAt: new Date(response?.last_publication_date ?? '').toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  };

  return {
    props: {
      post,
    },
    redirect: 60 * 30,
  }
}