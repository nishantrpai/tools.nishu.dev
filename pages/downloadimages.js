import Head from 'next/head';
import { useState } from 'react';
import JSZip from 'jszip';
import styles from '@/styles/Home.module.css';

export default function DownloadImages() {
  const [loading, setLoading] = useState(false);
  const [pageUrl, setPageUrl] = useState('');
  const [proxyUrl, setProxyUrl] = useState('https://api.codetabs.com/v1/proxy/?quest=');

  const downloadImages = async () => {
    if (!pageUrl) {
      alert('Please enter a URL to download images from.');
      return;
    }

    setLoading(true);
    try {
      // fetch the page content via the proxy
      const response = await fetch(`${proxyUrl}${encodeURIComponent(pageUrl)}`);
      const html = await response.text();

      // parse the html to find all image sources
      const imgUrls = [...html.matchAll(/<img[^>]+src="([^">]+)/g)].map(match => match[1]);

      // create a new zip instance
      const zip = new JSZip();

      // fetch each image via the proxy and add it to the zip
      const photos = await Promise.all(
        imgUrls.map(async (imgUrl) => {
          // Add domain to imgUrl if it doesn't have one
          if (!imgUrl.startsWith('http') && !imgUrl.startsWith('//')) {
            const urlObj = new URL(pageUrl);
            if (imgUrl.startsWith('/')) {
              imgUrl = `${urlObj.protocol}//${urlObj.hostname}${imgUrl}`;
            } else {
              imgUrl = `${urlObj.protocol}//${urlObj.hostname}/${imgUrl}`;
            }
          } else if (imgUrl.startsWith('//')) {
            imgUrl = `https:${imgUrl}`;
          }
          console.log('imgUrl', imgUrl);
          const imgResponse = await fetch(`${proxyUrl}${encodeURIComponent(imgUrl)}`);
          let imgName = imgUrl.split('/').pop();
          let img = await imgResponse.blob();
          return [imgName, img];
        })
      );

      // add each photo to the zip
      photos.forEach((photo, index) => {
        zip.file(photo[0], photo[1]);
      });

      // generate the zip file and trigger a download
      const content = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      const url = URL.createObjectURL(content);
      a.href = url;
      a.download = 'photos.zip';
      a.click();
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error downloading images:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Download Images</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Download Images from a Page</h1>

        <div className={styles.inputContainer} style={{width: '50%'}}>
          <input
            type="text"
            placeholder="Enter the page URL"
            value={pageUrl}
            onChange={(e) => setPageUrl(e.target.value)}
            className={styles.input}
            style={{
              width: '100%',
              borderRadius: '5px',
              backgroundColor: '#000',
              border: '1px solid #333',
              padding: '10px',
              color: '#fff'
            }}
          />
        </div>

        <button onClick={downloadImages} disabled={loading}>
          {loading ? 'Downloading...' : 'Download Images'}
        </button>
      </main>
    </div>
  );
}
