'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Report {
  id: string;
  timestamp: string;
  pdu_staff: string;
  td_staff: string;
  transmisi_staff: string;
  bukti_studio: string;
  bukti_streaming: string;
  bukti_subcontrol: string;
  selected_events: string;
  kendalas: string;
}

interface Staff {
  id: number;
  nama: string;
  jenis: string;
}

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
}

function ImageModal({ isOpen, onClose, imageUrl, title }: ImageModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="max-w-4xl max-h-screen p-4" onClick={(e) => e.stopPropagation()}>
        <div className="bg-white rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>
          <img
            src={imageUrl}
            alt={title}
            className="max-w-full max-h-96 object-contain"
          />
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [morningReports, setMorningReports] = useState<Report[]>([]);
  const [afternoonReports, setAfternoonReports] = useState<Report[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ url: '', title: '' });
  const [activeView, setActiveView] = useState<'reports' | 'staff'>('reports');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const openImageModal = (url: string, title: string) => {
    setSelectedImage({ url, title });
    setIsModalOpen(true);
  };

  const closeImageModal = () => {
    setIsModalOpen(false);
    setSelectedImage({ url: '', title: '' });
  };

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    const loadData = async () => {
      await Promise.all([fetchReports(), fetchStaff()]);
      setLoading(false);
    };

    loadData();
  }, []);

  const fetchReports = async () => {
    try {
      const [morningRes, afternoonRes] = await Promise.all([
        fetch('/api/admin/reports?type=morning'),
        fetch('/api/admin/reports?type=afternoon')
      ]);

      const morningData = await morningRes.json();
      const afternoonData = await afternoonRes.json();

      setMorningReports(morningData.reports || []);
      setAfternoonReports(afternoonData.reports || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const fetchStaff = async () => {
    try {
      const response = await fetch('/api/admin/staff');
      const data = await response.json();
      setStaff(data.staff || []);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              {/* Burger Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 transition duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setActiveView('reports');
                          setIsMenuOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                          activeView === 'reports' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                        }`}
                      >
                        Reports
                      </button>
                      <button
                        onClick={() => {
                          setActiveView('staff');
                          setIsMenuOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                          activeView === 'staff' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                        }`}
                      >
                        Staff
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <h1 className="text-2xl font-bold text-gray-900">
                {activeView === 'reports' ? 'Reports' : 'Staff Management'}
              </h1>
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={closeImageModal}
        imageUrl={selectedImage.url}
        title={selectedImage.title}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'reports' ? (
          <>
            {/* Morning Reports */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Morning Reports</h2>
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {morningReports.length === 0 ? (
                    <li className="px-6 py-4 text-gray-500">No morning reports found</li>
                  ) : (
                    morningReports.map((report) => (
                      <li key={report.id} className="px-6 py-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {new Date(report.timestamp).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500">
                              PDU: {report.pdu_staff} | TD: {report.td_staff}
                            </p>
                            <p className="text-sm text-gray-500">
                              Transmisi: {report.transmisi_staff}
                            </p>
                            <div className="mt-2">
                              <p className="text-sm text-gray-600">Photo Evidence:</p>
                              <div className="flex space-x-4 mt-1">
                                {report.bukti_studio && (
                                  <div className="flex flex-col items-center">
                                    <img
                                      src={report.bukti_studio}
                                      alt="Studio"
                                      className="w-16 h-16 object-cover rounded cursor-pointer border"
                                      onClick={() => openImageModal(report.bukti_studio, 'Studio Evidence')}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Studio</p>
                                  </div>
                                )}
                                {report.bukti_streaming && (
                                  <div className="flex flex-col items-center">
                                    <img
                                      src={report.bukti_streaming}
                                      alt="Streaming"
                                      className="w-16 h-16 object-cover rounded cursor-pointer border"
                                      onClick={() => openImageModal(report.bukti_streaming, 'Streaming Evidence')}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Streaming</p>
                                  </div>
                                )}
                                {report.bukti_subcontrol && (
                                  <div className="flex flex-col items-center">
                                    <img
                                      src={report.bukti_subcontrol}
                                      alt="Subcontrol"
                                      className="w-16 h-16 object-cover rounded cursor-pointer border"
                                      onClick={() => openImageModal(report.bukti_subcontrol, 'Subcontrol Evidence')}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Subcontrol</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>

            {/* Afternoon Reports */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Afternoon Reports</h2>
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {afternoonReports.length === 0 ? (
                    <li className="px-6 py-4 text-gray-500">No afternoon reports found</li>
                  ) : (
                    afternoonReports.map((report) => (
                      <li key={report.id} className="px-6 py-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {new Date(report.timestamp).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500">
                              PDU: {report.pdu_staff} | TD: {report.td_staff}
                            </p>
                            <p className="text-sm text-gray-500">
                              Transmisi: {report.transmisi_staff}
                            </p>
                            <div className="mt-2">
                              <p className="text-sm text-gray-600">Photo Evidence:</p>
                              <div className="flex space-x-4 mt-1">
                                {report.bukti_studio && (
                                  <div className="flex flex-col items-center">
                                    <img
                                      src={report.bukti_studio}
                                      alt="Studio"
                                      className="w-16 h-16 object-cover rounded cursor-pointer border"
                                      onClick={() => openImageModal(report.bukti_studio, 'Studio Evidence')}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Studio</p>
                                  </div>
                                )}
                                {report.bukti_streaming && (
                                  <div className="flex flex-col items-center">
                                    <img
                                      src={report.bukti_streaming}
                                      alt="Streaming"
                                      className="w-16 h-16 object-cover rounded cursor-pointer border"
                                      onClick={() => openImageModal(report.bukti_streaming, 'Streaming Evidence')}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Streaming</p>
                                  </div>
                                )}
                                {report.bukti_subcontrol && (
                                  <div className="flex flex-col items-center">
                                    <img
                                      src={report.bukti_subcontrol}
                                      alt="Subcontrol"
                                      className="w-16 h-16 object-cover rounded cursor-pointer border"
                                      onClick={() => openImageModal(report.bukti_subcontrol, 'Subcontrol Evidence')}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Subcontrol</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </>
        ) : (
          /* Staff Management */
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Staff by Role</h2>
            {staff.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No staff found
              </div>
            ) : (
              (() => {
                // Group staff by role
                const groupedStaff = staff.reduce((acc, person) => {
                  const role = person.jenis;
                  if (!acc[role]) {
                    acc[role] = [];
                  }
                  acc[role].push(person);
                  return acc;
                }, {} as Record<string, Staff[]>);

                return Object.entries(groupedStaff).map(([role, staffList]) => (
                  <div key={role} className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 capitalize border-b pb-2">
                      {role} ({staffList.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {staffList.map((person) => (
                        <div key={person.id} className="bg-white rounded-lg shadow-md p-4 border hover:shadow-lg transition-shadow">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-lg">
                                {person.nama.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">{person.nama}</h4>
                              <p className="text-sm text-gray-600 capitalize">{person.jenis}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ));
              })()
            )}
          </div>
        )}
      </div>
    </div>
  );
}
