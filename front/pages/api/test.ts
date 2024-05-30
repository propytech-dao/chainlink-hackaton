import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
      if (req.method === 'GET') {
        // Handle GET request
        res.status(200).json({ message: 'Hello, world!' });
      } else if (req.method === 'POST') {
        // Handle POST request
        const { name } = req.body;
        if (!name) {
          res.status(400).json({ error: 'Name is required' });
          return;
        }
        res.status(200).json({ message: `Hello, ${name}!` });
      } else {
        // Handle other HTTP methods
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
      }
    }
    