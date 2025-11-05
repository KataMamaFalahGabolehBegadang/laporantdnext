'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Staff {
  id: number;
  nama: string;
  jenis: string;
}

export default function MorningFormStep1() {
  const [pduStaff, setPduStaff] = useState('');
  const [tdStaff, setTdStaff] = useState('');
  const [transmisiStaff, setTransmisiStaff] = useState<string[]>([]);
  const [pduOptions, setPduOptions] = useState<Staff[]>([]);
  const [tdOptions, setTdOptions] = useState<Staff[]>([]);
  const [transmisiOptions, setTransmisiOptions] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const [pduRes, tdRes, transmisiRes] = await Promise.all([
          fetch('/api/staff?role=PDU'),
          fetch('/api/staff?role=TD'),
          fetch('/api/staff?role=TRANSMISI')
        ]);

        const pduData = await pduRes.json();
        const tdData = await tdRes.json();
        const transmisiData = await transmisiRes.json();

        setPduOptions(pduData.staff || []);
        setTdOptions(tdData.staff || []);
        setTransmisiOptions(transmisiData.staff || []);
      } catch (error) {
        console.error('Error fetching staff:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();

    const savedData = localStorage.getItem('morningFormData');
    if (savedData) {
      const data = JSON.parse(savedData);
      setPduStaff(data.pduStaff || '');
      setTdStaff(data.tdStaff || '');
      setTransmisiStaff(data.transmisiStaff || []);
    }
  }, []);

  const toggleTransmisi = (staff: string) => {
    setTransmisiStaff(prev =>
      prev.includes(staff)
        ? prev.filter(s => s !== staff)
        : [...prev, staff]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      pduStaff,
      tdStaff,
      transmisiStaff,
      buktiStudio: null,
      buktiStreaming: null,
      buktiSubcontrol: null,
      selectedEvents: [],
      kendalas: []
    };
    localStorage.setItem('morningFormData', JSON.stringify(formData));
    window.location.href = '/morning/step2';
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full">
        <h1 className="text-2xl font-bold text-center text-black mb-6">Morning Report - Step 1: Staff Selection</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-black mb-2">PETUGAS PDU</label>
              <select
                value={pduStaff}
                onChange={(e) => setPduStaff(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-black"
              >
                <option value="">Select PDU Staff</option>
                {pduOptions.map(option => (
                  <option key={option.id} value={option.nama}>{option.nama}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">PETUGAS TD</label>
              <select
                value={tdStaff}
                onChange={(e) => setTdStaff(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-black"
              >
                <option value="">Select TD Staff</option>
                {tdOptions.map(option => (
                  <option key={option.id} value={option.nama}>{option.nama}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">PETUGAS TRANSMISI</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {transmisiOptions.map(option => (
                <div
                  key={option.id}
                  onClick={() => toggleTransmisi(option.nama)}
                  className={`p-4 border rounded-lg cursor-pointer transition ${
                    transmisiStaff.includes(option.nama) ? 'bg-blue-100 border-blue-500' : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  <div className="text-center font-medium text-black">{option.nama}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              Next Step
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
