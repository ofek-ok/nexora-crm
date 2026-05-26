'use client';

import { useCRMStore, Customer } from '@/store/crmStore';
import { useTranslation } from '@/hooks/useTranslation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { 
  Search, 
  Trash2, 
  UserCheck, 
  X,
  Mail,
  Phone,
  Paperclip,
  CheckSquare,
  MessageSquare,
  Globe,
  MapPin,
  Clock,
  Briefcase
} from 'lucide-react';
import { useState, useMemo } from 'react';

export default function CustomersPage() {
  const { t, language, dir } = useTranslation();
  const isRTL = language === 'he';

  const customers = useCRMStore((state) => state.customers);
  const leads = useCRMStore((state) => state.leads);
  const currentUser = useCRMStore((state) => state.currentUser);
  const users = useCRMStore((state) => state.users);
  const deleteCustomer = useCRMStore((state) => state.deleteCustomer);
  const addToast = useCRMStore((state) => state.addToast);
  
  // Linked store elements
  const activities = useCRMStore((state) => state.activities);
  const notes = useCRMStore((state) => state.notes);
  const attachments = useCRMStore((state) => state.attachments);
  const tasks = useCRMStore((state) => state.tasks);

  const addNote = useCRMStore((state) => state.addNote);
  const deleteNote = useCRMStore((state) => state.deleteNote);
  const addAttachment = useCRMStore((state) => state.addAttachment);
  const addTask = useCRMStore((state) => state.addTask);
  const toggleTaskStatus = useCRMStore((state) => state.toggleTaskStatus);

  // States
  const [localSearch, setLocalSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Form note & task state
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('2026-05-26');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // Filtered List
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      // Role Filter Check (Disabled: Everyone sees everything)
      const roleMatch = true;
      if (!roleMatch) return false;

      const query = localSearch.toLowerCase();
      return (
        localSearch === '' ||
        customer.companyName.toLowerCase().includes(query) ||
        customer.contactName.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.phone.includes(localSearch) ||
        customer.industry.toLowerCase().includes(query)
      );
    });
  }, [customers, localSearch, leads, currentUser]);

  const handleDelete = (id: string, name: string) => {
    if (confirm(isRTL ? `למחוק את הלקוח "${name}"? פעולה זו תסיר את היסטוריית הפעילות שלו.` : `Delete customer "${name}"? This removes all details.`)) {
      deleteCustomer(id);
      if (selectedCustomer?.id === id) setSelectedCustomer(null);
      addToast(isRTL ? 'הלקוח נמחק בהצלחה' : 'Customer deleted successfully', 'warning');
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !newNoteContent.trim()) return;

    addNote({
      content: newNoteContent,
      customerId: selectedCustomer.id,
      createdBy: 'u-1'
    });

    setNewNoteContent('');
    addToast(isRTL ? 'הערה נוספה' : 'Note added', 'success');
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !newTaskTitle.trim()) return;

    addTask({
      title: newTaskTitle,
      dueDate: newTaskDueDate,
      priority: newTaskPriority,
      status: 'pending',
      assignedTo: 'u-1',
      customerId: selectedCustomer.id
    });

    setNewTaskTitle('');
    addToast(isRTL ? 'משימה חדשה הוקצתה' : 'New task assigned', 'success');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedCustomer || !e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    addAttachment({
      fileName: file.name,
      fileUrl: '#',
      fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      customerId: selectedCustomer.id
    });

    addToast(isRTL ? 'מסמך הועלה בהצלחה' : 'Document uploaded successfully', 'success');
  };

  // Profile Drawer details
  const customerNotes = useMemo(() => {
    if (!selectedCustomer) return [];
    return notes.filter(n => n.customerId === selectedCustomer.id);
  }, [notes, selectedCustomer]);

  const customerAttachments = useMemo(() => {
    if (!selectedCustomer) return [];
    return attachments.filter(att => att.customerId === selectedCustomer.id);
  }, [attachments, selectedCustomer]);

  const customerTasks = useMemo(() => {
    if (!selectedCustomer) return [];
    return tasks.filter(t => t.customerId === selectedCustomer.id);
  }, [tasks, selectedCustomer]);

  const customerActivities = useMemo(() => {
    if (!selectedCustomer) return [];
    return activities.filter(a => a.customerId === selectedCustomer.id);
  }, [activities, selectedCustomer]);

  return (
    <div className="flex gap-6 h-full relative" dir={dir}>
      
      {/* Main Customers List */}
      <div className={`flex-1 space-y-6 transition-all duration-300 ${selectedCustomer ? 'lg:max-w-[calc(100%-400px)]' : ''}`}>
        
        {/* Module Header */}
        <div>
          <h1 className="text-3xl font-extrabold font-display tracking-tight text-text-primary">
            {t('customers.title')}
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            {isRTL ? 'צפה בלקוחות פעילים שהומרו מלידים ונהל את היחסים איתם.' : 'View converted active customers and manage ongoing relations.'}
          </p>
        </div>

        {/* Filter Toolbar */}
        <Card className="p-4 bg-bg-secondary border-border-custom shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute start-3.5 top-3 w-4 h-4 text-text-tertiary pointer-events-none" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder={t('common.search')}
              className="w-full py-2 px-4 ps-10 text-sm border border-border-custom rounded-xl bg-bg-tertiary/20 text-text-primary focus:bg-bg-secondary focus:border-brand-primary outline-none transition-all duration-200"
            />
          </div>
          <div className="text-xs text-text-secondary">
            {isRTL ? `סה"כ לקוחות: ${customers.length}` : `Total Customers: ${customers.length}`}
          </div>
        </Card>

        {/* Tabular Layout */}
        <Card className="overflow-hidden border border-border-custom p-0 bg-bg-secondary shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse text-sm">
              <thead className="bg-bg-tertiary/40 border-b border-border-custom text-text-secondary select-none">
                <tr>
                  <th className="px-6 py-4 font-semibold text-start">{t('common.company')}</th>
                  <th className="px-6 py-4 font-semibold text-start">{t('common.contact')}</th>
                  <th className="px-6 py-4 font-semibold text-start">{t('common.email')}</th>
                  <th className="px-6 py-4 font-semibold text-start">{t('common.dealValue')}</th>
                  <th className="px-6 py-4 font-semibold text-start">{t('common.industry')}</th>
                  <th className="px-6 py-4 font-semibold text-start">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-custom text-text-primary">
                {filteredCustomers.map((customer) => (
                  <tr 
                    key={customer.id} 
                    className={`hover:bg-bg-tertiary/20 transition-colors cursor-pointer ${selectedCustomer?.id === customer.id ? 'bg-brand-primary-light/10' : ''}`}
                    onClick={() => setSelectedCustomer(customer)}
                  >
                    <td className="px-6 py-4.5 font-bold flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-brand-success/10 text-brand-success flex items-center justify-center">
                        <UserCheck className="w-3.5 h-3.5" />
                      </div>
                      {customer.companyName}
                    </td>
                    <td className="px-6 py-4.5 text-text-secondary">{customer.contactName}</td>
                    <td className="px-6 py-4.5 text-text-secondary truncate max-w-[150px]">{customer.email}</td>
                    <td className="px-6 py-4.5 font-bold text-brand-success">${customer.dealValue.toLocaleString()}</td>
                    <td className="px-6 py-4.5 text-text-secondary">{customer.industry}</td>
                    <td className="px-6 py-4.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleDelete(customer.id, customer.companyName)}
                        className="p-1.5 rounded-lg text-brand-danger hover:bg-brand-danger-light/20 transition-colors cursor-pointer"
                        title={t('common.delete')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-text-secondary">
                      {t('common.noData')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* --- DETAILED PROFILE DRAWER --- */}
      {selectedCustomer && (
        <aside className="w-[370px] bg-bg-secondary border border-border-custom rounded-2xl p-6 shadow-lg fixed lg:sticky top-20 right-6 lg:right-auto bottom-6 z-20 overflow-y-auto animate-slide-in flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-border-custom pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-success/10 text-brand-success flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold font-display text-text-primary leading-tight">{selectedCustomer.companyName}</h4>
                  <span className="text-[9px] font-bold text-brand-success uppercase tracking-wider">{t('dashboard.activeCustomers')}</span>
                </div>
              </div>
              
              <button 
                onClick={() => setSelectedCustomer(null)}
                className="p-1 rounded-lg hover:bg-bg-tertiary text-text-secondary hover:text-text-primary cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Fields */}
            <div className="space-y-3.5 text-xs">
              <div className="flex items-center gap-2 text-text-secondary">
                <Globe className="w-4 h-4 text-text-tertiary" />
                <span>{selectedCustomer.contactName}</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <Mail className="w-4 h-4 text-text-tertiary" />
                <span className="truncate">{selectedCustomer.email}</span>
              </div>
              {selectedCustomer.phone && (
                <div className="flex items-center gap-2 text-text-secondary">
                  <Phone className="w-4 h-4 text-text-tertiary" />
                  <span>{selectedCustomer.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-text-secondary">
                <Briefcase className="w-4 h-4 text-text-tertiary" />
                <span>{selectedCustomer.industry} • ${selectedCustomer.dealValue.toLocaleString()}</span>
              </div>
              {selectedCustomer.country && (
                <div className="flex items-center gap-2 text-text-secondary">
                  <MapPin className="w-4 h-4 text-text-tertiary" />
                  <span>{selectedCustomer.country}</span>
                </div>
              )}
            </div>

            {/* Customer Tasks */}
            <div className="border-t border-border-custom pt-4">
              <h5 className="font-semibold font-display text-text-primary text-xs mb-3 flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-brand-primary" /> {t('customers.tasks')}
              </h5>
              
              <form onSubmit={handleAddTask} className="grid grid-cols-1 gap-2 mb-3">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder={t('tasks.newTask') + '...'}
                  className="w-full text-xs p-2.5 border border-border-custom rounded-xl bg-bg-tertiary/10 text-text-primary outline-none focus:border-brand-primary"
                  required
                />
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="flex-1 text-xs p-2 border border-border-custom rounded-xl bg-bg-secondary text-text-primary outline-none focus:border-brand-primary"
                  />
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
                    className="text-xs p-2 border border-border-custom rounded-xl bg-bg-secondary text-text-primary outline-none focus:border-brand-primary"
                  >
                    <option value="low">{t('tasks.low')}</option>
                    <option value="medium">{t('tasks.medium')}</option>
                    <option value="high">{t('tasks.high')}</option>
                  </select>
                </div>
                <Button type="submit" size="sm" className="text-[10px]">
                  {t('common.add')}
                </Button>
              </form>

              {/* Tasks Checklist */}
              <ul className="space-y-1.5 max-h-[120px] overflow-y-auto">
                {customerTasks.map(task => (
                  <li key={task.id} className="flex items-center justify-between p-2 border border-border-custom bg-bg-tertiary/10 rounded-xl text-xs">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={task.status === 'completed'}
                        onChange={() => toggleTaskStatus(task.id)}
                        className="rounded border-border-custom text-brand-primary focus:ring-brand-primary/20 w-3.5 h-3.5 cursor-pointer"
                      />
                      <span className={task.status === 'completed' ? 'line-through opacity-50' : 'font-medium'}>
                        {task.title}
                      </span>
                    </div>
                    <span className="text-[9px] text-text-tertiary">{task.dueDate}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Notes */}
            <div className="border-t border-border-custom pt-4">
              <h5 className="font-semibold font-display text-text-primary text-xs mb-3 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-brand-primary" /> {t('common.notes')}
              </h5>
              <form onSubmit={handleAddNote} className="mb-3">
                <textarea
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder={t('leads.addNote')}
                  rows={2}
                  className="w-full text-xs p-2.5 border border-border-custom rounded-xl bg-bg-tertiary/10 text-text-primary outline-none focus:border-brand-primary resize-none placeholder-text-tertiary"
                  required
                />
                <Button type="submit" size="sm" className="mt-1.5 text-[10px] w-full">
                  {t('common.add')}
                </Button>
              </form>

              <ul className="space-y-2 max-h-[120px] overflow-y-auto">
                {customerNotes.map(n => {
                  const creator = users.find(u => u.id === n.createdBy);
                  return (
                    <li key={n.id} className="p-2.5 border border-border-custom bg-bg-tertiary/20 rounded-xl relative group text-xs">
                      <p className="text-text-primary">{n.content}</p>
                      <div className="flex items-center justify-between mt-2 text-[9px] text-text-tertiary">
                        <span className="flex items-center gap-1.5">
                          <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                          {creator && <span className="font-semibold text-brand-primary">by {creator.fullName}</span>}
                        </span>
                        <button 
                          onClick={() => deleteNote(n.id)}
                          className="text-brand-danger opacity-0 group-hover:opacity-100 hover:underline cursor-pointer"
                        >
                          {t('common.delete')}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Documents Upload */}
            <div className="border-t border-border-custom pt-4">
              <h5 className="font-semibold font-display text-text-primary text-xs mb-3 flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Paperclip className="w-3.5 h-3.5 text-brand-primary" /> {t('customers.files')}</span>
                <label className="text-[10px] text-brand-primary font-semibold hover:underline cursor-pointer">
                  {t('common.add')}
                  <input type="file" onChange={handleFileUpload} className="hidden" />
                </label>
              </h5>

              <ul className="space-y-1.5">
                {customerAttachments.map(att => (
                  <li key={att.id} className="flex items-center justify-between p-2 border border-border-custom bg-bg-tertiary/10 rounded-xl text-xs">
                    <span className="font-medium text-text-primary truncate max-w-[180px]">{att.fileName}</span>
                    <span className="text-[10px] text-text-tertiary">{att.fileSize}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </aside>
      )}

    </div>
  );
}
