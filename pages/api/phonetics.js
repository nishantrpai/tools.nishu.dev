// get json from public/phonetics.json
import { promises as fs } from 'fs'
export default async function handler(req, res) {
  const file = await fs.readFile(process.cwd() + '/public/phonetics.json', 'utf8');
  res.status(200).json({ phoneticMap: file });
}
