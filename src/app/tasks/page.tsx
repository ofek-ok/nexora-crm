'use client';

import { useCRMStore, Task } from '@/store/crmStore';
import { useTranslation } from '@/hooks/useTranslation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { 
  Plus, 
  Trash2, 
  Calendar, 
  List, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search,
  User,
  ExternalLink
} from 'lucide-react';
import { useState, useMemo } from 'react';
import Link from 'next/link';

export default function TasksPage() {
  const { t, language, dir } = useTranslation();
  const isRTL = language === 'he';

  const tasks = useCRMStore((state) => state.tasks);
  const leads = useCRMStore((state) => state.leads);
  const customers = useCRMStore((state) => state.customers);
  const users = useCRMStore((state) => state.users);
  const currentUser = useCRMStore((state) => state.currentUser);
  
  const addTask = useCRMStore((state) => state.addTask);
  const toggleTaskStatus = useCRMStore((state) => state.toggleTaskStatus);
  const deleteTask = useCRMStore((state) => state.deleteTask);
  const addToast = useCRMStore((state) => state.addToast);

  // States
  const [localSearch, setLocalSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'overdue' | 'completed'>('today');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Add Task Form Data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '2026-05-26',
    priority: 'medium' as 'low' | 'medium' | 'high',
    assignedTo: 'u-1',
    targetType: 'none', // 'none' | 'lead' | 'customer'
    targetId: ''
  });

  const todayStr = '2026-05-26'; // Constant mock system date for MVP consistencies

  const handleOpenAdd = () => {
    setFormData({
      title: '',
      description: '',
      dueDate: todayStr,
      priority: 'medium',
      assignedTo: users[0]?.id || 'u-1',
      targetType: 'none',
      targetId: ''
    });
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.dueDate) {
      addToast(isRTL ? 'נא למלא את כותרת המשימה ותאריך היעד' : 'Please provide task title and due date', 'error');
      return;
    }

    const taskPayload = {
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate,
      priority: formData.priority,
      status: 'pending' as const,
      assignedTo: formData.assignedTo,
      leadId: formData.targetType === 'lead' ? formData.targetId : undefined,
      customerId: formData.targetType === 'customer' ? formData.targetId : undefined
    };

    addTask(taskPayload);
    setIsAddModalOpen(false);
    addToast(isRTL ? 'משימה נוספה בהצלחה' : 'Task added successfully', 'success');
  };

  const handleDelete = (id: string) => {
    if (confirm(isRTL ? 'למחוק משימה זו?' : 'Delete this task?')) {
      deleteTask(id);
      addToast(isRTL ? 'המשימה נמחקה' : 'Task deleted', 'warning');
    }
  };

  // Target Options for link dropdown
  const targetOptions = useMemo(() => {
    if (formData.targetType === 'lead') {
      return leads.map(l => ({ value: l.id, label: `Lead: ${l.companyName} (${l.contactName})` }));
    }
    if (formData.targetType === 'customer') {
      return customers.map(c => ({ value: c.id, label: `Customer: ${c.companyName}` }));
    }
    return [];
  }, [formData.targetType, leads, customers]);

  // --- FILTERED TASKS CALCULATIONS ---
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Role Filter Check
      const roleMatch = currentUser?.role !== 'agent' || task.assignedTo === currentUser.id;
      if (!roleMatch) return false;

      // 1. Search Match
      const searchMatch = 
        localSearch === '' ||
        task.title.toLowerCase().includes(localSearch.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(localSearch.toLowerCase()));

      // 2. Priority Filter Match
      const priorityMatch = filterPriority === 'all' || task.priority === filterPriority;

      // 3. Tab Filter Match
      let tabMatch = false;
      const isCompleted = task.status === 'completed';

      if (activeTab === 'completed') {
        tabMatch = isCompleted;
      } else if (!isCompleted) {
        if (activeTab === 'today') {
          tabMatch = task.dueDate === todayStr;
        } else if (activeTab === 'upcoming') {
          tabMatch = task.dueDate > todayStr;
        } else if (activeTab === 'overdue') {
          tabMatch = task.dueDate < todayStr;
        }
      }

      return searchMatch && priorityMatch && tabMatch;
    });
  }, [tasks, localSearch, filterPriority, activeTab, currentUser]);

  return (
    <div className="space-y-6" dir={dir}>
      
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-display tracking-tight text-text-primary">
            {t('tasks.title')}
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            {isRTL ? 'נהל משימות המשויכות ללידים או ללקוחות שלך.' : 'Manage tasks connected directly to leads or customers.'}
          </p>
        </div>
        <Button onClick={handleOpenAdd} leftIcon={<Plus className="w-4 h-4" />}>
          {t('tasks.newTask')}
        </Button>
      </div>

      {/* Tabs list bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-custom pb-2">
        <div className="flex gap-2">
          {(['today', 'upcoming', 'overdue', 'completed'] as const).map((tab) => {
            // Count total in each tab
            const count = tasks.filter((task) => {
              const isCompleted = task.status === 'completed';
              if (tab === 'completed') return isCompleted;
              if (isCompleted) return false;
              if (tab === 'today') return task.dueDate === todayStr;
              if (tab === 'upcoming') return task.dueDate > todayStr;
              if (tab === 'overdue') return task.dueDate < todayStr;
              return false;
            }).length;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                  activeTab === tab 
                    ? 'bg-brand-primary text-white shadow-sm' 
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/60'
                }`}
              >
                {t(`tasks.${tab}`)} ({count})
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex gap-2.5 items-center">
          {/* Priority filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="py-2 px-3 text-xs border border-border-custom rounded-xl bg-bg-secondary text-text-primary outline-none focus:border-brand-primary cursor-pointer appearance-none"
          >
            <option value="all">{t('common.priority')}: {t('common.all')}</option>
            <option value="high">{t('tasks.high')}</option>
            <option value="medium">{t('tasks.medium')}</option>
            <option value="low">{t('tasks.low')}</option>
          </select>

          {/* Quick Search */}
          <div className="relative w-48">
            <Search className="absolute start-3 top-2.5 w-3.5 h-3.5 text-text-tertiary pointer-events-none" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder={t('common.search')}
              className="w-full py-1.5 px-3 ps-8 text-xs border border-border-custom rounded-xl bg-bg-tertiary/20 text-text-primary focus:bg-bg-secondary focus:border-brand-primary outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Tasks Render List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTasks.map((task) => {
          const owner = users.find(u => u.id === task.assignedTo);
          const lead = leads.find(l => l.id === task.leadId);
          const customer = customers.find(c => c.id === task.customerId);

          const isOverdue = task.dueDate < todayStr && task.status === 'pending';

          return (
            <Card 
              key={task.id} 
              className={`hover-lift p-5 border border-border-custom bg-bg-secondary relative flex flex-col justify-between ${
                task.status === 'completed' ? 'opacity-70' : ''
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={task.status === 'completed'}
                      onChange={() => {
                        toggleTaskStatus(task.id);
                        addToast(task.status === 'completed' ? 'Task marked pending' : 'Task completed successfully', 'success');
                      }}
                      className="mt-1 rounded border-border-custom text-brand-primary focus:ring-brand-primary/20 w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <h4 className={`font-semibold text-sm text-text-primary ${
                        task.status === 'completed' ? 'line-through text-text-tertiary' : ''
                      }`}>
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Priority Pill */}
                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full select-none ${
                    task.priority === 'high' ? 'bg-brand-danger-light text-brand-danger border border-brand-danger/10' : 
                    task.priority === 'medium' ? 'bg-brand-warning-light text-brand-warning border border-brand-warning/10' : 
                    'bg-brand-primary-light text-brand-primary border border-brand-primary/10'
                  }`}>
                    {t(`tasks.${task.priority}`)}
                  </span>
                </div>

                {/* Linked lead/customer details */}
                {(lead || customer) && (
                  <div className="ms-7 mt-3 flex items-center gap-1.5 text-xs text-brand-primary font-medium">
                    <ExternalLink className="w-3.5 h-3.5" />
                    {lead && (
                      <Link href="/leads" className="hover:underline">
                        {lead.companyName} ({t('nav.leads')})
                      </Link>
                    )}
                    {customer && (
                      <Link href="/customers" className="hover:underline">
                        {customer.companyName} ({t('nav.customers')})
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {/* Task Footer details */}
              <div className="ms-7 mt-4.5 pt-3 border-t border-bg-tertiary/60 flex items-center justify-between text-xs text-text-secondary select-none">
                <span className={`flex items-center gap-1.5 ${isOverdue ? 'text-brand-danger font-semibold' : ''}`}>
                  {isOverdue ? <AlertCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5 text-text-tertiary" />}
                  {task.dueDate === todayStr ? t('tasks.dueToday') : task.dueDate}
                </span>

                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[11px]">
                    <User className="w-3 h-3 text-text-tertiary" /> {owner?.fullName}
                  </span>
                  
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="p-1 rounded hover:bg-brand-danger-light/20 text-text-tertiary hover:text-brand-danger cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="col-span-2 text-center py-16 border border-dashed border-border-custom rounded-2xl text-sm text-text-secondary">
            {t('common.noData')}
          </div>
        )}
      </div>

      {/* --- ADD NEW TASK MODAL --- */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title={t('tasks.newTask')}>
        <form onSubmit={handleAddSubmit} className="space-y-4 text-start">
          <Input
            label={t('tasks.newTask')}
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            placeholder="e.g. Call Client for signature"
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-secondary">
              {t('common.notes')}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder={language === 'he' ? 'פרטי המשימה...' : 'Task details...'}
              className="w-full text-sm p-3 border border-border-custom rounded-xl bg-bg-secondary text-text-primary placeholder-text-tertiary focus:border-brand-primary outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t('common.date')}
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              required
            />
            <Select
              label={t('common.priority')}
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
              options={[
                { value: 'low', label: t('tasks.low') },
                { value: 'medium', label: t('tasks.medium') },
                { value: 'high', label: t('tasks.high') }
              ]}
            />
          </div>

          {/* Connect task to Lead/Customer options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 border border-border-custom rounded-xl bg-bg-tertiary/20">
            <Select
              label={language === 'he' ? 'קשר לישות' : 'Link to entity'}
              value={formData.targetType}
              onChange={(e) => setFormData({ ...formData, targetType: e.target.value, targetId: '' })}
              options={[
                { value: 'none', label: language === 'he' ? 'ללא קישור' : 'None' },
                { value: 'lead', label: t('nav.leads') },
                { value: 'customer', label: t('nav.customers') }
              ]}
            />

            {formData.targetType !== 'none' && (
              <Select
                label={language === 'he' ? 'בחר ישות' : 'Select item'}
                value={formData.targetId}
                onChange={(e) => setFormData({ ...formData, targetId: e.target.value })}
                options={[{ value: '', label: language === 'he' ? '--- בחר ---' : '--- Select ---' }, ...targetOptions]}
                required
              />
            )}
          </div>

          <Select
            label={t('common.owner')}
            value={formData.assignedTo}
            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            options={users.map(u => ({ value: u.id, label: u.fullName }))}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-border-custom">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit">
              {t('common.save')}
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
