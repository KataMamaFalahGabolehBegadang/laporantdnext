'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MorningFormStep2() {
  const [buktiStudio, setBuktiStudio] = useState<File | null>(null);
  const [buktiStreaming, setBuktiStreaming] = useState<File | null>(null);
  const [buktiSubcontrol, setBuktiSubcontrol] = useState<File | null>(null);
  const [uploadedUrls, setUploadedUrls] = useState({
    buktiStudio: '',
    buktiStreaming: '',
    buktiSubcontrol: '',
  });
  const [uploading, setUploading] = useState({
    buktiStudio: false,
    buktiStreaming: false,
    buktiSubcontrol: false,
  });

  useEffect(() => {
    const savedData = localStorage.getItem('morningFormData');
    if (savedData) {
      const data = JSON.parse(savedData);
      setUploadedUrls({
        buktiStudio: data.buktiStudio || '',
        buktiStreaming: data.buktiStreaming || '',
        buktiSubcontrol: data.buktiSubcontrol || '',
      });
    }
  }, []);

  const handleFileUpload = async (file: File, field: string) => {
    setUploading(prev => ({ ...prev, [field]: true }));

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.url) {
        setUploadedUrls(prev => ({ ...prev, [field]: result.url }));
        // Update localStorage with the Cloudinary URL
        const savedData = localStorage.getItem('morningFormData');
        if (savedData) {
          const data = JSON.parse(savedData);
          const updatedData = { ...data, [field]: result.url };
          localStorage.setItem('morningFormData', JSON.stringify(updatedData));
        }
      } else {
        alert('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    } finally {
      setUploading(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleFileChange = (setter: (file: File | null) => void, field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setter(file);
    if (file) {
      handleFileUpload(file, field);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Files are already uploaded and URLs stored in localStorage
    window.location.href = '/morning/step3';
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full">
        <h1 className="text-2xl font-bold text-center text-black mb-6">Morning Report - Step 2: Evidence Upload</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-black mb-2">BUKTI STUDIO</label>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileChange(setBuktiStudio, 'buktiStudio')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*,video/*"
                  disabled={uploading.buktiStudio}
                />
                <div className={`p-4 border-2 border-dashed rounded-lg text-center transition ${
                  uploadedUrls.buktiStudio ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-500'
                }`}>
                  {uploading.buktiStudio ? (
                    <div className="text-blue-500">Uploading...</div>
                  ) : uploadedUrls.buktiStudio ? (
                    <div>
                      <div className="text-green-600 font-medium">✓ Uploaded</div>
                      <a href={uploadedUrls.buktiStudio} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm underline">
                        View file
                      </a>
                    </div>
                  ) : (
                    <div className="text-gray-500">Click to upload BUKTI STUDIO</div>
                  )}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">BUKTI STREAMING</label>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileChange(setBuktiStreaming, 'buktiStreaming')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*,video/*"
                  disabled={uploading.buktiStreaming}
                />
                <div className={`p-4 border-2 border-dashed rounded-lg text-center transition ${
                  uploadedUrls.buktiStreaming ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-500'
                }`}>
                  {uploading.buktiStreaming ? (
                    <div className="text-blue-500">Uploading...</div>
                  ) : uploadedUrls.buktiStreaming ? (
                    <div>
                      <div className="text-green-600 font-medium">✓ Uploaded</div>
                      <a href={uploadedUrls.buktiStreaming} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm underline">
                        View file
                      </a>
                    </div>
                  ) : (
                    <div className="text-gray-500">Click to upload BUKTI STREAMING</div>
                  )}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">BUKTI SUBCONTROL</label>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileChange(setBuktiSubcontrol, 'buktiSubcontrol')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*,video/*"
                  disabled={uploading.buktiSubcontrol}
                />
                <div className={`p-4 border-2 border-dashed rounded-lg text-center transition ${
                  uploadedUrls.buktiSubcontrol ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-500'
                }`}>
                  {uploading.buktiSubcontrol ? (
                    <div className="text-blue-500">Uploading...</div>
                  ) : uploadedUrls.buktiSubcontrol ? (
                    <div>
                      <div className="text-green-600 font-medium">✓ Uploaded</div>
                      <a href={uploadedUrls.buktiSubcontrol} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm underline">
                        View file
                      </a>
                    </div>
                  ) : (
                    <div className="text-gray-500">Click to upload BUKTI SUBCONTROL</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Link href="/morning" className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200">
              Back
            </Link>
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
