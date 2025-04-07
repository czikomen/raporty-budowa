'use client';
import { useEffect, useState } from 'react';

interface Report {
  id: number;
  observation: string;
  action: string;
  assignee: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<string | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [observation, setObservation] = useState('');
  const [action, setAction] = useState('');
  const [assignee, setAssignee] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    setUser('Jan Kowalski');
    setReports([]);
  }, []);

  const handleAddReport = () => {
    const newReport: Report = {
      id: reports.length + 1,
      observation,
      action,
      assignee
    };
    setReports([...reports, newReport]);
    setObservation('');
    setAction('');
    setAssignee('');
  };

  const filteredReports = reports.filter(r =>
    r.observation.toLowerCase().includes(filter.toLowerCase()) ||
    r.assignee.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Raporty z kontroli</h1>
      <p className="text-sm text-gray-500">Zalogowany jako: {user}</p>

      <div className="bg-white p-4 rounded shadow space-y-2">
        <h2 className="text-lg font-semibold">Dodaj raport</h2>
        <input
          type="text"
          placeholder="Obserwacja"
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Działania naprawcze"
          value={action}
          onChange={(e) => setAction(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Osoba odpowiedzialna"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button onClick={handleAddReport} className="bg-green-600 text-white px-4 py-2 rounded">
          Dodaj raport
        </button>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Lista raportów</h2>
        <input
          type="text"
          placeholder="Filtruj obserwacje lub osobę..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <ul className="divide-y">
          {filteredReports.map(report => (
            <li key={report.id} className="py-2">
              <p><strong>Obserwacja:</strong> {report.observation}</p>
              <p><strong>Działania:</strong> {report.action}</p>
              <p><strong>Odpowiedzialny:</strong> {report.assignee}</p>
            </li>
          ))}
          {filteredReports.length === 0 && (
            <li className="text-gray-500">Brak dopasowanych raportów.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
