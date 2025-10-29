'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Event {
  name: string;
  type: string;
}

interface TimeSlot {
  time: string;
  events: Event[];
}

interface CustomEvent extends Event {
  id: string;
}

const acaraData: TimeSlot[] = [
  {
    time: '08.00 - 09.30',
    events: [
      { name: 'HABAR BANUA', type: 'rerun' },
      { name: 'Sekolah Ku Keren', type: 'Playback' },
      { name: 'Cerdas Ceria', type: 'Playback' },
      { name: 'Warung Bubuhan', type: 'Playback' },
    ],
  },
  {
    time: '09.30 - 10.00',
    events: [
      { name: 'Habar Banua', type: 'Rerun' },
      { name: 'Bakunjang', type: 'Playback' },
      { name: 'Geliat Tanah Borneo', type: 'Rerun' },
    ],
  },
  {
    time: '10.00 - 11.00',
    events: [
      { name: 'Ini Borneo', type: 'Relay' },
      { name: 'Ini Borneo', type: 'Live' },
      { name: 'Dangdut Keliling', type: 'Playback' },
      { name: 'Hari yang Berkah', type: 'Rerun' },
    ],
  },
  {
    time: '11.00 - 11.30',
    events: [
      { name: 'Ini Borneo', type: 'Relay' },
      { name: 'Ini Borneo', type: 'Live' },
      { name: 'Inspirasi Indonesia', type: 'Playback' },
      { name: 'Lintas Borneo', type: 'Playback' },
      { name: 'Pesona Indonesia Kalsel', type: 'Playback' },
    ],
  },
  {
    time: '11.30 - 12.00',
    events: [
      { name: 'Ini Borneo', type: 'Relay' },
      { name: 'Ini Borneo', type: 'Live' },
      { name: 'Kindai Limpuar', type: 'Rerun' },
      { name: 'Lensa Olahraga', type: 'Rerun' },
    ],
  },
];

export default function MorningFormStep3() {
  const [selectedEvents, setSelectedEvents] = useState<{ time: string; name: string; type: string }[]>([]);
  const [customEvents, setCustomEvents] = useState<{ [time: string]: CustomEvent[] }>({});

  useEffect(() => {
    const savedData = localStorage.getItem('morningFormData');
    if (savedData) {
      const data = JSON.parse(savedData);
      setSelectedEvents(data.selectedEvents || []);
      // Custom events can't be stored in localStorage easily, so we don't load them
    }
  }, []);

  const toggleEvent = (time: string, name: string, type: string) => {
    setSelectedEvents(prev =>
      prev.some(e => e.time === time && e.name === name && e.type === type)
        ? prev.filter(e => !(e.time === time && e.name === name && e.type === type))
        : [...prev, { time, name, type }]
    );
  };

  const addCustomEvent = (time: string) => {
    const newEvent: CustomEvent = {
      id: Date.now().toString(),
      name: '',
      type: '',
    };
    setCustomEvents(prev => ({
      ...prev,
      [time]: [...(prev[time] || []), newEvent],
    }));
  };

  const updateCustomEvent = (time: string, id: string, field: 'name' | 'type', value: string) => {
    setCustomEvents(prev => ({
      ...prev,
      [time]: prev[time].map(event =>
        event.id === id ? { ...event, [field]: value } : event
      ),
    }));
  };

  const removeCustomEvent = (time: string, id: string) => {
    setCustomEvents(prev => ({
      ...prev,
      [time]: prev[time].filter(event => event.id !== id),
    }));
    setSelectedEvents(prev => prev.filter(e => !(e.time === time && e.name === customEvents[time]?.find(ev => ev.id === id)?.name)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const savedData = localStorage.getItem('morningFormData');
    if (savedData) {
      const data = JSON.parse(savedData);
      const updatedData = {
        ...data,
        selectedEvents,
        // Note: Custom events are not persisted in localStorage for simplicity
      };
      localStorage.setItem('morningFormData', JSON.stringify(updatedData));
    }
    window.location.href = '/morning/step4';
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full">
        <h1 className="text-2xl font-bold text-center text-black mb-6">Morning Report - Step 3: ACARA Selection</h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          {acaraData.map(slot => (
            <div key={slot.time}>
              <h2 className="text-lg font-semibold text-black mb-4">{slot.time}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {slot.events.map((event, index) => {
                  const isSelected = selectedEvents.some(e => e.time === slot.time && e.name === event.name && e.type === event.type);
                  return (
                    <div
                      key={`${slot.time}-${event.name}-${event.type}-${index}`}
                      onClick={() => toggleEvent(slot.time, event.name, event.type)}
                      className={`p-4 border rounded-lg cursor-pointer transition ${
                        isSelected ? 'bg-blue-100 border-blue-500' : 'bg-gray-50 border-gray-300'
                      }`}
                    >
                      <div className="text-center font-medium text-black">{event.name}</div>
                      <div className="text-center text-sm text-gray-500">{event.type}</div>
                    </div>
                  );
                })}
                {/* Custom Events for this time slot */}
                {(customEvents[slot.time] || []).map(event => {
                  const isSelected = selectedEvents.some(e => e.time === slot.time && e.name === event.name && e.type === event.type);
                  return (
                    <div
                      key={event.id}
                      className={`p-4 border rounded-lg transition ${
                        isSelected ? 'bg-blue-100 border-blue-500' : 'bg-gray-50 border-gray-300'
                      }`}
                    >
                      <input
                        type="text"
                        placeholder="Event Name"
                        value={event.name}
                        onChange={(e) => updateCustomEvent(slot.time, event.id, 'name', e.target.value)}
                        className="w-full mb-2 p-1 border border-gray-300 rounded text-black"
                      />
                      <input
                        type="text"
                        placeholder="Event Type"
                        value={event.type}
                        onChange={(e) => updateCustomEvent(slot.time, event.id, 'type', e.target.value)}
                        className="w-full mb-2 p-1 border border-gray-300 rounded text-black"
                      />
                      <div className="flex justify-between">
                        <button
                          type="button"
                          onClick={() => toggleEvent(slot.time, event.name, event.type)}
                          className={`px-2 py-1 rounded text-sm ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
                        >
                          {isSelected ? 'Selected' : 'Select'}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeCustomEvent(slot.time, event.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => addCustomEvent(slot.time)}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-3 rounded-lg transition duration-200 text-sm"
              >
                Add Custom Event
              </button>
            </div>
          ))}

          <div className="flex justify-between">
            <Link href="/morning/step2" className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200">
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
