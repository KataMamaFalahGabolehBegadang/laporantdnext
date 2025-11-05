'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Kendala {
  id: string;
  nama: string;
  waktu: string;
  buktiKendala: string;
}

export default function AfternoonFormStep4() {
  const [kendalas, setKendalas] = useState<Kendala[]>([]);
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('afternoonFormData');
    if (savedData) {
      const data = JSON.parse(savedData);
      setKendalas(data.kendalas || []);
    }
  }, []);

  const addKendala = () => {
    const newKendala: Kendala = {
      id: Date.now().toString(),
      nama: '',
      waktu: '',
      buktiKendala: '',
    };
    setKendalas(prev => [...prev, newKendala]);
  };

  const updateKendala = (id: string, field: 'nama' | 'waktu', value: string) => {
    setKendalas(prev =>
      prev.map(kendala =>
        kendala.id === id ? { ...kendala, [field]: value } : kendala
      )
    );
  };

  const handleFileUpload = async (file: File, kendalaId: string) => {
    setUploading(prev => ({ ...prev, [kendalaId]: true }));

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.url) {
        setKendalas(prev =>
          prev.map(kendala =>
            kendala.id === kendalaId ? { ...kendala, buktiKendala: result.url } : kendala
          )
        );
        // Update localStorage with the Cloudinary URL
        const savedData = localStorage.getItem('afternoonFormData');
        if (savedData) {
          const data = JSON.parse(savedData);
          const updatedKendalas = data.kendalas.map((k: Kendala) =>
            k.id === kendalaId ? { ...k, buktiKendala: result.url } : k
          );
          const updatedData = { ...data, kendalas: updatedKendalas };
          localStorage.setItem('afternoonFormData', JSON.stringify(updatedData));
        }
      } else {
        alert('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    } finally {
      setUploading(prev => ({ ...prev, [kendalaId]: false }));
    }
  };

  const removeKendala = (id: string) => {
    setKendalas(prev => prev.filter(kendala => kendala.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const savedData = localStorage.getItem('afternoonFormData');
    if (savedData) {
      const data = JSON.parse(savedData);
      const updatedData = {
        ...data,
        kendalas,
      };
      localStorage.setItem('afternoonFormData', JSON.stringify(updatedData));

      // Automatically submit to Google Sheets
      try {
        const response = await fetch('/api/submit-afternoon', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData),
        });

        const result = await response.json();
        if (result.success) {
          console.log('Report submitted successfully to Google Sheets!');
        } else {
          console.error('Failed to submit report to Google Sheets');
        }
      } catch (error) {
        console.error('Error submitting report to Google Sheets:', error);
      }
    }
    setIsSubmitting(false);
    window.location.href = '/afternoon/summary';
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full">
        <h1 className="text-2xl font-bold text-center text-black mb-6">Afternoon Report - Step 4: KENDALA</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <button
              type="button"
              onClick={addKendala}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              + ADD KENDALA
            </button>
          </div>

          <div className="space-y-4">
            {kendalas.map(kendala => (
              <div key={kendala.id} className="p-4 border border-gray-300 rounded-lg bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">NAMA KENDALA</label>
                    <input
                      type="text"
                      value={kendala.nama}
                      onChange={(e) => updateKendala(kendala.id, 'nama', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-black"
                      placeholder="Enter nama kendala"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">WAKTU KENDALA</label>
                    <input
                      type="text"
                      value={kendala.waktu}
                      onChange={(e) => updateKendala(kendala.id, 'waktu', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-black"
                      placeholder="Enter waktu kendala"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-black mb-2">BUKTI KENDALA</label>
                  <div className="relative">
                    <input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(file, kendala.id);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept="image/*,video/*"
                      disabled={uploading[kendala.id]}
                    />
                    <div className={`p-4 border-2 border-dashed rounded-lg text-center transition ${
                      kendala.buktiKendala ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-500'
                    }`}>
                      {uploading[kendala.id] ? (
                        <div className="text-blue-500">Uploading...</div>
                      ) : kendala.buktiKendala ? (
                        <div>
                          <div className="text-green-600 font-medium">✓ Uploaded</div>
                          <a href={kendala.buktiKendala} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm underline">
                            View file
                          </a>
                        </div>
                      ) : (
                        <div className="text-gray-500">Click to upload BUKTI KENDALA</div>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeKendala(kendala.id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-lg transition duration-200 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <Link href="/afternoon/step3" className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200">
              Back
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                'Submit Report'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
