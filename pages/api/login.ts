import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserByEmail } from '../../lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);

    if (!user || !user.passwordHash) {
      return res.status(401).json({ message: 'Nieprawidłowy email lub hasło' });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Nieprawidłowy email lub hasło' });
    }

    res.status(200).json({ message: 'Zalogowano pomyślnie' });
  } catch (error) {
    console.error('Błąd logowania:', error);
    res.status(500).json({ message: 'Wewnętrzny błąd serwera' });
  }
}
