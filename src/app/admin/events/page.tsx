'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Copy,
  Calendar,
  MapPin,
  Users,
  ChevronDown,
  Loader2,
  X
} from 'lucide-react';
import Link from 'next/link';
import { cn, formatDate } from '@/lib/utils';
import { Button, Input, Select, SelectOption } from '@/components/ui';
import { Modal } from '@/components/ui';

interface Event {
  id: string;
  slug: string;
  coupleName1: string;
  coupleName2: string;
  eventTitle: string;
  date: string;
  time: string;
  venueName: string;
  venueAddress: string;
  status: 'draft' | 'published' | 'archived';
  rsvpCount: number;
  blessingCount: number;
  contributionCount: number;
  totalContributions: number;
  createdAt: string;
  updatedAt: string;
}

const mockEvents: Event[] = [
  {
    id: '1',
    slug: 'priya-arjun-wedding',
    coupleName1: 'Priya',
    coupleName2: 'Arjun',
    eventTitle: 'Wedding Ceremony',
    date: '2025-02-15',
    time: '16:30',
    venueName: 'The Grand Palace',
    venueAddress: 'MG Road, Bengaluru, Karnataka 560001',
    status: 'published',
    rsvpCount: 156,
    blessingCount: 45,
    contributionCount: 23,
    totalContributions: 245678,
    createdAt: '2024-11-15',
    updatedAt: '2024-12-01',
  },
  {
    id: '2',
    slug: 'meera-rohan-reception',
    coupleName1: 'Meera',
    coupleName2: 'Rohan',
    eventTitle: 'Reception Party',
    date: '2025-03-01',
    time: '19:00',
    venueName: 'Taj Hotel',
    venueAddress: 'Mumbai, Maharashtra 400001',
    status: 'published',
    rsvpCount: 89,
    blessingCount: 32,
    contributionCount: 15,
    totalContributions: 156789,
    createdAt: '2024-11-20',
    updatedAt: '2024-12-05',
  },
  {
    id: '3',
    slug: 'anjali-karan-sangeet',
    coupleName1: 'Anjali',
    coupleName2: 'Karan',
    eventTitle: 'Sangeet Night',
    date: '2025-01-28',
    time: '18:00',
    venueName: 'JW Marriott',
    venueAddress: 'Delhi, 110001',
    status: 'draft',
    rsvpCount: 0,
    blessingCount: 0,
    contributionCount: 0,
    totalContributions: 0,
    createdAt: '2024-12-01',
    updatedAt: '2024-12-01',
  },
];

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' },
];

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'created' | 'rsvp'>('date');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const filteredEvents = events
    .filter((event) => {
      const matchesSearch =
        event.coupleName1.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.coupleName2.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.venueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.slug.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || event.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (sortBy === 'created') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return b.rsvpCount - a.rsvpCount;
    });

  const getStatusBadge = (status: string) => {
    const styles = {
      published: 'bg-green-100 text-green-700',
      draft: 'bg-yellow-100 text-yellow-700',
      archived: 'bg-gray-100 text-gray-700',
    };
    return styles[status as keyof typeof styles] || styles.draft;
  };

  const handleCreateEvent = async (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'rsvpCount' | 'blessingCount' | 'contributionCount' | 'totalContributions'>) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newEvent: Event = {
        ...eventData,
        id: Date.now().toString(),
        rsvpCount: 0,
        blessingCount: 0,
        contributionCount: 0,
        totalContributions: 0,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setEvents(prev => [newEvent, ...prev]);
      setShowCreateModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateEvent = async (eventData: Event) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEvents(prev => prev.map(e => e.id === eventData.id ? { ...eventData, updatedAt: new Date().toISOString().split('T')[0] } : e));
      setEditingEvent(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEvents(prev => prev.filter(e => e.id !== eventId));
      setDeletingEvent(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDuplicateEvent = (event: Event) => {
    const newEvent: Event = {
      ...event,
      id: Date.now().toString(),
      slug: `${event.slug}-copy`,
      coupleName1: event.coupleName1,
      coupleName2: event.coupleName2,
      rsvpCount: 0,
      blessingCount: 0,
      contributionCount: 0,
      totalContributions: 0,
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setEvents(prev => [newEvent, ...prev]);
  };

  const currentEvent = editingEvent || {
    slug: '',
    coupleName1: '',
    coupleName2: '',
    eventTitle: 'Wedding Ceremony',
    date: '',
    time: '',
    venueName: '',
    venueAddress: '',
    status: 'draft' as const,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="font-display font-medium text-3xl lg:text-4xl text-text-primary">Events</h1>
          <p className="text-body text-text-secondary mt-1">Manage your wedding invitation events</p>
        </div>
        <Button variant="primary" size="lg" onClick={() => { setEditingEvent(null); setShowCreateModal(true); }}>
          <Plus className="w-5 h-5 mr-2" />
          Create Event
        </Button>
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
          options={statusOptions}
          className="w-full sm:w-48"
          placeholder="Filter by status"
        />
        <Select
          value={sortBy}
          onValueChange={setSortBy}
          options={[
            { value: 'date', label: 'Sort by Date' },
            { value: 'created', label: 'Sort by Created' },
            { value: 'rsvp', label: 'Sort by RSVPs' },
          ]}
          className="w-full sm:w-48"
          placeholder="Sort by"
        />
      </motion.div>

      {/* Events Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="rounded-2xl border border-border-gold/30 bg-surface-cream overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full" role="table">
            <thead>
              <tr className="border-b border-border-gold/30 bg-primary-cream/50">
                <th className="px-6 py-4 text-left text-body-sm font-medium text-text-muted uppercase tracking-wider">Event</th>
                <th className="px-6 py-4 text-left text-body-sm font-medium text-text-muted uppercase tracking-wider hidden md:table-cell">Date & Venue</th>
                <th className="px-6 py-4 text-left text-body-sm font-medium text-text-muted uppercase tracking-wider hidden lg:table-cell">Status</th>
                <th className="px-6 py-4 text-left text-body-sm font-medium text-text-muted uppercase tracking-wider hidden lg:table-cell">RSVPs</th>
                <th className="px-6 py-4 text-left text-body-sm font-medium text-text-muted uppercase tracking-wider hidden xl:table-cell">Blessings</th>
                <th className="px-6 py-4 text-left text-body-sm font-medium text-text-muted uppercase tracking-wider hidden xl:table-cell">Contributions</th>
                <th className="px-6 py-4 text-right text-body-sm font-medium text-text-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-gold/30">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-4 text-text-muted">
                      <Calendar className="w-12 h-12 text-border-gold/50" />
                      <p className="text-body">No events found</p>
                      <p className="text-body-sm">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event) => (
                  <motion.tr
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-primary-cream/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <Link href={`/${event.slug}`} target="_blank" className="font-medium text-text-primary hover:text-primary-gold transition-colors">
                          {event.coupleName1} & {event.coupleName2}
                        </Link>
                        <p className="text-body-sm text-text-secondary mt-0.5">{event.eventTitle}</p>
                        <p className="text-body-xs text-text-muted mt-0.5 font-mono">/{event.slug}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-body-sm text-text-secondary">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span>{formatDate(event.date)} at {event.time}</span>
                        </div>
                        <div className="flex items-center gap-1 text-body-sm text-text-muted truncate">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span>{event.venueName}, {event.venueAddress}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-body-xs font-medium', getStatusBadge(event.status))}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-1 text-body-sm text-text-secondary">
                        <Users className="w-4 h-4" />
                        <span>{event.rsvpCount}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden xl:table-cell text-body-sm text-text-secondary">{event.blessingCount}</td>
                    <td className="px-6 py-4 hidden xl:table-cell">
                      <div className="flex items-center gap-1 text-body-sm text-text-secondary">
                        <span>₹{event.totalContributions.toLocaleString('en-IN')}</span>
                        <span className="text-text-muted">({event.contributionCount})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => window.open(`/${event.slug}`, '_blank')}
                          className="p-2 rounded-xl text-text-muted hover:bg-primary-cream/50 hover:text-text-primary transition-colors"
                          aria-label="View event"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingEvent(event)}
                          className="p-2 rounded-xl text-text-muted hover:bg-primary-cream/50 hover:text-text-primary transition-colors"
                          aria-label="Edit event"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicateEvent(event)}
                          className="p-2 rounded-xl text-text-muted hover:bg-primary-cream/50 hover:text-text-primary transition-colors"
                          aria-label="Duplicate event"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingEvent(event)}
                          className="p-2 rounded-xl text-text-muted hover:bg-red-50 hover:text-red-600 transition-colors"
                          aria-label="Delete event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-border-gold/30 flex items-center justify-between">
          <p className="text-body-sm text-text-muted">
            Showing {filteredEvents.length} of {events.length} events
          </p>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" disabled>Previous</Button>
            <Button variant="ghost" size="sm" disabled>Next</Button>
          </div>
        </div>
      </motion.div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {(showCreateModal || editingEvent) && (
          <Modal
            isOpen={true}
            onClose={() => { setShowCreateModal(false); setEditingEvent(null); }}
            title={editingEvent ? 'Edit Event' : 'Create New Event'}
            description={editingEvent ? 'Update the event details below' : 'Fill in the details to create a new wedding invitation event'}
            size="xl"
          >
            <EventForm
              initialData={currentEvent}
              onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
              isLoading={isLoading}
              onClose={() => { setShowCreateModal(false); setEditingEvent(null); }}
            />
          </Modal>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingEvent && (
          <Modal
            isOpen={true}
            onClose={() => setDeletingEvent(null)}
            title="Delete Event"
            description={`Are you sure you want to delete "${deletingEvent.coupleName1} & ${deletingEvent.coupleName2}"? This action cannot be undone.`}
            size="md"
            showCloseButton={true}
          >
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="secondary" onClick={() => setDeletingEvent(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => handleDeleteEvent(deletingEvent.id)} isLoading={isLoading}>
                Delete Event
              </Button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

interface EventFormProps {
  initialData: Partial<Event>;
  onSubmit: (data: Event) => Promise<void>;
  isLoading: boolean;
  onClose: () => void;
}

function EventForm({ initialData, onSubmit, isLoading, onClose }: EventFormProps) {
  const [formData, setFormData] = useState({
    slug: initialData.slug || '',
    coupleName1: initialData.coupleName1 || '',
    coupleName2: initialData.coupleName2 || '',
    eventTitle: initialData.eventTitle || 'Wedding Ceremony',
    date: initialData.date || '',
    time: initialData.time || '',
    venueName: initialData.venueName || '',
    venueAddress: initialData.venueAddress || '',
    status: initialData.status || 'draft',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.slug || !formData.coupleName1 || !formData.coupleName2 || !formData.date || !formData.time || !formData.venueName) {
      alert('Please fill in all required fields');
      return;
    }
    await onSubmit(formData as Event);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="slug" className="form-label">URL Slug <span className="text-red-500">*</span></label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => handleChange('slug', e.target.value)}
            placeholder="priya-arjun-wedding"
            disabled={!!initialData.id}
          />
          <p className="text-body-xs text-text-muted mt-1">Used in the invitation URL (e.g., inviteaura.com/priya-arjun-wedding)</p>
        </div>
        <div>
          <label htmlFor="eventTitle" className="form-label">Event Title</label>
          <Input
            id="eventTitle"
            value={formData.eventTitle}
            onChange={(e) => handleChange('eventTitle', e.target.value)}
            placeholder="Wedding Ceremony"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="coupleName1" className="form-label">First Name <span className="text-red-500">*</span></label>
          <Input
            id="coupleName1"
            value={formData.coupleName1}
            onChange={(e) => handleChange('coupleName1', e.target.value)}
            placeholder="Priya"
          />
        </div>
        <div>
          <label htmlFor="coupleName2" className="form-label">Second Name <span className="text-red-500">*</span></label>
          <Input
            id="coupleName2"
            value={formData.coupleName2}
            onChange={(e) => handleChange('coupleName2', e.target.value)}
            placeholder="Arjun"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="date" className="form-label">Event Date <span className="text-red-500">*</span></label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="time" className="form-label">Event Time <span className="text-red-500">*</span></label>
          <Input
            id="time"
            type="time"
            value={formData.time}
            onChange={(e) => handleChange('time', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label htmlFor="venueName" className="form-label">Venue Name <span className="text-red-500">*</span></label>
        <Input
          id="venueName"
          value={formData.venueName}
          onChange={(e) => handleChange('venueName', e.target.value)}
          placeholder="The Grand Palace"
        />
      </div>

      <div>
        <label htmlFor="venueAddress" className="form-label">Venue Address <span className="text-red-500">*</span></label>
        <Input
          id="venueAddress"
          value={formData.venueAddress}
          onChange={(e) => handleChange('venueAddress', e.target.value)}
          placeholder="MG Road, Bengaluru, Karnataka 560001"
        />
      </div>

      <div>
        <label htmlFor="status" className="form-label">Status</label>
        <Select
          value={formData.status}
          onValueChange={(value) => handleChange('status', value)}
          options={[
            { value: 'draft', label: 'Draft' },
            { value: 'published', label: 'Published' },
            { value: 'archived', label: 'Archived' },
          ]}
          placeholder="Select status"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border-gold/30">
        <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {initialData.id ? 'Update Event' : 'Create Event'}
        </Button>
      </div>
    </form>
  );
}