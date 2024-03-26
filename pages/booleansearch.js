import styles from '@/styles/Home.module.css'

const Tool = () => {
  let tool = {
    title: '🔍 Boolean Search',
    description: 'Get boolean search strings for Google, LinkedIn, Github, and more based on the signal you want to find.',
    publishDate: '26th March 2024',
  };
  return (
    <main>
      <h1>{tool.title}</h1>
      <p>{tool.publishDate}</p>
    </main>
  );
}

export default Tool;