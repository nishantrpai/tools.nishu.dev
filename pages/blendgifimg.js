import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import dynamic from 'next/dynamic'

const BlendGifImg = dynamic(() => import('../components/BlendGifImg'), {
  ssr: false,
  loading: () => <div>Loading...</div>
})

export default function BlendGifImgPage() {
  return (
    <>
      <Head>
        <title>Blend GIF over Image</title>
        <meta name="description" content="Blend a GIF over a static image with opacity control" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Blend GIF over Image
        </h1>

        <p className={styles.description}>
          Blend a GIF over a static image
        </p>

        <BlendGifImg />
      </main>
    </>
  )
}
