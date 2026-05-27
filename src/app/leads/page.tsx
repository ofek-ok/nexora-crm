'use client';

import { useCRMStore, Lead, PipelineStatus } from '@/store/crmStore';
import { useTranslation } from '@/hooks/useTranslation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  User,
  ArrowUpDown,
  FileText,
  Paperclip,
  Clock,
  X,
  MessageSquare
} from 'lucide-react';
import { useState, useMemo } from 'react';

export default function LeadsPage() {
  const { t, language, dir } = useTranslation();
  const isRTL = language === 'he';

  // --- STATE ---
  const leads = useCRMStore((state) => state.leads);
  const statuses = useCRMStore((state) => state.pipelineStatuses);
  const users = useCRMStore((state) => state.users);
  const currentUser = useCRMStore((state) => state.currentUser);
  const addLead = useCRMStore((state) => state.addLead);
  const updateLead = useCRMStore((state) => state.updateLead);
  const deleteLead = useCRMStore((state) => state.deleteLead);
  const convertToCustomer = useCRMStore((state) => state.convertToCustomer);
  const addToast = useCRMStore((state) => state.addToast);
  
  // Notes and Attachments
  const notes = useCRMStore((state) => state.notes);
  const attachments = useCRMStore((state) => state.attachments);
  const addNote = useCRMStore((state) => state.addNote);
  const addAttachment = useCRMStore((state) => state.addAttachment);
  const deleteNote = useCRMStore((state) => state.deleteNote);

  // Search & Filters
  const [localSearch, setLocalSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSource, setFilterSource] = useState('all');
  const [filterIndustry, setFilterIndustry] = useState('all');

  // Sorting
  const [sortField, setSortField] = useState<keyof Lead>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  // Detailed Side Panel
  const [detailsLead, setDetailsLead] = useState<Lead | null>(null);
  const [newNoteContent, setNewNoteContent] = useState('');

  // Form Fields
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    country: '',
    industry: '',
    leadSource: '',
    dealValue: 0,
    assignedOwnerId: 'u-1',
    statusId: 's-1',
    tags: '',
    notes: ''
  });

  // Sources and Industries options for dropdowns
  const sourceOptions = [
    { value: 'Shanghai Port', label: 'Shanghai Port (נמל שנגחאי)' },
    { value: 'Haifa Port', label: 'Haifa Port (נמל חיפה)' },
    { value: 'Ashdod Port', label: 'Ashdod Port (נמל אשדוד)' },
    { value: 'Rotterdam Port', label: 'Rotterdam Port (נמל רוטרדם)' },
    { value: 'Ben Gurion Airport', label: 'Ben Gurion Airport (נתב"ג)' },
    { value: 'Port of Houston', label: 'Port of Houston (נמל יוסטון)' }
  ];

  const industryOptions = [
    { value: 'Sea Freight (FCL)', label: 'Sea Freight - FCL (מכולה מלאה)' },
    { value: 'Sea Freight (LCL)', label: 'Sea Freight - LCL (מכולה חלקית)' },
    { value: 'Air Freight', label: 'Air Freight (שילוח אווירי)' },
    { value: 'Land Transport', label: 'Land Transport (הובלה יבשתית)' },
    { value: 'Customs Clearance', label: 'Customs Clearance (עמילות מכס)' }
  ];

  // --- HANDLERS ---
  const handleSort = (field: keyof Lead) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleOpenAdd = () => {
    setFormData({
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      country: '',
      industry: 'Sea Freight (FCL)',
      leadSource: 'Shanghai Port',
      dealValue: 0,
      assignedOwnerId: users[0]?.id || 'u-1',
      statusId: statuses[0]?.id || 's-1',
      tags: '',
      notes: ''
    });
    setIsAddOpen(true);
  };

  const handleOpenEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setFormData({
      companyName: lead.companyName,
      contactName: lead.contactName,
      email: lead.email,
      phone: lead.phone,
      country: lead.country,
      industry: lead.industry,
      leadSource: lead.leadSource,
      dealValue: lead.dealValue,
      assignedOwnerId: lead.assignedOwnerId,
      statusId: lead.statusId,
      tags: lead.tags.join(', '),
      notes: ''
    });
    setIsEditOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || !formData.contactName || !formData.email) {
      addToast(isRTL ? 'נא למלא שדות חובה' : 'Please fill required fields', 'error');
      return;
    }

    addLead({
      companyName: formData.companyName,
      contactName: formData.contactName,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      industry: formData.industry,
      leadSource: formData.leadSource,
      dealValue: Number(formData.dealValue),
      assignedOwnerId: formData.assignedOwnerId,
      statusId: formData.statusId,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : []
    });

    setIsAddOpen(false);
    addToast(isRTL ? 'הליד נוצר בהצלחה' : 'Lead created successfully', 'success');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;

    updateLead(selectedLead.id, {
      companyName: formData.companyName,
      contactName: formData.contactName,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      industry: formData.industry,
      leadSource: formData.leadSource,
      dealValue: Number(formData.dealValue),
      assignedOwnerId: formData.assignedOwnerId,
      statusId: formData.statusId,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : []
    });

    setIsEditOpen(false);
    // Sync side panel if open
    if (detailsLead?.id === selectedLead.id) {
      setDetailsLead(useCRMStore.getState().leads.find(l => l.id === selectedLead.id) || null);
    }
    addToast(isRTL ? 'הליד עודכן בהצלחה' : 'Lead updated successfully', 'success');
  };

  const handleDelete = (id: string) => {
    if (confirm(t('leads.deleteLeadConfirm'))) {
      deleteLead(id);
      if (detailsLead?.id === id) setDetailsLead(null);
      addToast(isRTL ? 'הליד נמחק בהצלחה' : 'Lead deleted successfully', 'warning');
    }
  };

  const handleConvert = (leadId: string) => {
    convertToCustomer(leadId);
    addToast(t('leads.convertSuccess'), 'success');
    // Refresh detailed panel status visual
    if (detailsLead?.id === leadId) {
      setDetailsLead(useCRMStore.getState().leads.find(l => l.id === leadId) || null);
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailsLead || !newNoteContent.trim()) return;

    addNote({
      content: newNoteContent,
      leadId: detailsLead.id,
      createdBy: 'u-1' // Admin
    });

    setNewNoteContent('');
    addToast(isRTL ? 'הערה נוספה' : 'Note added', 'success');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!detailsLead || !e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    addAttachment({
      fileName: file.name,
      fileUrl: '#',
      fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      leadId: detailsLead.id
    });

    addToast(isRTL ? 'קובץ הועלה בהצלחה' : 'File uploaded successfully', 'success');
  };

  // --- COMPUTED DATA ---
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Role Filter Check (Disabled: Everyone sees everything)
      const roleMatch = true;
      if (!roleMatch) return false;

      // Search Match
      const searchMatch = 
        localSearch === '' ||
        lead.companyName.toLowerCase().includes(localSearch.toLowerCase()) ||
        lead.contactName.toLowerCase().includes(localSearch.toLowerCase()) ||
        lead.email.toLowerCase().includes(localSearch.toLowerCase()) ||
        lead.phone.includes(localSearch);

      // Filters Match
      const statusMatch = filterStatus === 'all' || lead.statusId === filterStatus;
      const sourceMatch = filterSource === 'all' || lead.leadSource === filterSource;
      const industryMatch = filterIndustry === 'all' || lead.industry === filterIndustry;

      return searchMatch && statusMatch && sourceMatch && industryMatch;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      // Handle tags comparison
      if (Array.isArray(valA) && Array.isArray(valB)) {
        valA = valA.join('');
        valB = valB.join('');
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [leads, localSearch, filterStatus, filterSource, filterIndustry, sortField, sortDirection, currentUser]);

  // Pagination Calculations
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage) || 1;
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLeads.slice(start, start + itemsPerPage);
  }, [filteredLeads, currentPage]);

  const leadNotes = useMemo(() => {
    if (!detailsLead) return [];
    return notes.filter(n => n.leadId === detailsLead.id);
  }, [notes, detailsLead]);

  const leadAttachments = useMemo(() => {
    if (!detailsLead) return [];
    return attachments.filter(att => att.leadId === detailsLead.id);
  }, [attachments, detailsLead]);

  return (
    <div className="flex gap-6 h-full relative" dir={dir}>
      
      {/* Main Leads List Container */}
      <div className={`flex-1 space-y-6 transition-all duration-300 ${detailsLead ? 'lg:max-w-[calc(100%-400px)]' : ''}`}>
        
        {/* Module Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold font-display tracking-tight text-text-primary">
              {t('leads.title')}
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              {isRTL ? 'נהל, סנן והמר לידים לעסקאות פעילות בקלות.' : 'Manage, filter and convert sales leads into customers.'}
            </p>
          </div>
          <Button onClick={handleOpenAdd} leftIcon={<Plus className="w-4 h-4" />}>
            {t('leads.newLead')}
          </Button>
        </div>

        {/* Filters and Search Bar */}
        <Card className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between bg-bg-secondary border-border-custom shadow-sm">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute start-3.5 top-3 w-4 h-4 text-text-tertiary pointer-events-none" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={t('common.search')}
              className="w-full py-2 px-4 ps-10 text-sm border border-border-custom rounded-xl bg-bg-tertiary/20 text-text-primary focus:bg-bg-secondary focus:border-brand-primary outline-none transition-all duration-200"
            />
          </div>

          {/* Filtering selectors */}
          <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="py-2 px-3 text-xs border border-border-custom rounded-xl bg-bg-secondary text-text-primary outline-none focus:border-brand-primary appearance-none cursor-pointer"
            >
              <option value="all">{t('common.status')}: {t('common.all')}</option>
              {statuses.map(s => (
                <option key={s.id} value={s.id}>{isRTL ? s.nameHe : s.nameEn}</option>
              ))}
            </select>

            {/* Source Filter */}
            <select
              value={filterSource}
              onChange={(e) => {
                setFilterSource(e.target.value);
                setCurrentPage(1);
              }}
              className="py-2 px-3 text-xs border border-border-custom rounded-xl bg-bg-secondary text-text-primary outline-none focus:border-brand-primary appearance-none cursor-pointer"
            >
              <option value="all">{t('common.source')}: {t('common.all')}</option>
              {sourceOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label.split(' ')[0]}</option>
              ))}
            </select>

            {/* Industry Filter */}
            <select
              value={filterIndustry}
              onChange={(e) => {
                setFilterIndustry(e.target.value);
                setCurrentPage(1);
              }}
              className="py-2 px-3 text-xs border border-border-custom rounded-xl bg-bg-secondary text-text-primary outline-none focus:border-brand-primary appearance-none cursor-pointer"
            >
              <option value="all">{t('common.industry')}: {t('common.all')}</option>
              {industryOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label.split(' ')[0]}</option>
              ))}
            </select>
          </div>
        </Card>

        {/* Leads Table Card */}
        <Card className="overflow-hidden border border-border-custom p-0 bg-bg-secondary shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse text-sm">
              <thead className="bg-bg-tertiary/40 border-b border-border-custom text-text-secondary select-none">
                <tr>
                  <th onClick={() => handleSort('companyName')} className="px-6 py-4 font-semibold text-start cursor-pointer hover:text-text-primary">
                    <span className="flex items-center gap-1.5">{t('common.company')} <ArrowUpDown className="w-3.5 h-3.5" /></span>
                  </th>
                  <th onClick={() => handleSort('contactName')} className="px-6 py-4 font-semibold text-start cursor-pointer hover:text-text-primary">
                    <span className="flex items-center gap-1.5">{t('common.contact')} <ArrowUpDown className="w-3.5 h-3.5" /></span>
                  </th>
                  <th onClick={() => handleSort('dealValue')} className="px-6 py-4 font-semibold text-start cursor-pointer hover:text-text-primary">
                    <span className="flex items-center gap-1.5">{t('common.dealValue')} <ArrowUpDown className="w-3.5 h-3.5" /></span>
                  </th>
                  <th className="px-6 py-4 font-semibold text-start">{t('common.status')}</th>
                  <th className="px-6 py-4 font-semibold text-start">{t('common.owner')}</th>
                  <th className="px-6 py-4 font-semibold text-start">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-custom text-text-primary">
                {paginatedLeads.map((lead) => {
                  const status = statuses.find(s => s.id === lead.statusId);
                  const owner = users.find(u => u.id === lead.assignedOwnerId);
                  
                  return (
                    <tr 
                      key={lead.id} 
                      className={`hover:bg-bg-tertiary/20 transition-colors cursor-pointer ${detailsLead?.id === lead.id ? 'bg-brand-primary-light/10' : ''}`}
                      onClick={() => setDetailsLead(lead)}
                    >
                      <td className="px-6 py-4.5 font-semibold text-text-primary">{lead.companyName}</td>
                      <td className="px-6 py-4.5 text-text-secondary">{lead.contactName}</td>
                      <td className="px-6 py-4.5 font-bold">${lead.dealValue.toLocaleString()}</td>
                      <td className="px-6 py-4.5">
                        <span 
                          className="px-2.5 py-1 text-xs rounded-full font-semibold border"
                          style={{ 
                            color: status?.color, 
                            borderColor: `${status?.color}20`, 
                            backgroundColor: `${status?.color}10` 
                          }}
                        >
                          {isRTL ? status?.nameHe : status?.nameEn}
                        </span>
                      </td>
                      <td className="px-6 py-4.5">
                        <span className="text-xs text-text-secondary flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-text-tertiary" /> {owner?.fullName}
                        </span>
                      </td>
                      <td className="px-6 py-4.5" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleConvert(lead.id)}
                            className="p-1.5 rounded-lg text-brand-success hover:bg-brand-success-light/20 transition-colors cursor-pointer"
                            title={t('common.convert')}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(lead)}
                            className="p-1.5 rounded-lg text-brand-primary hover:bg-brand-primary-light/20 transition-colors cursor-pointer"
                            title={t('common.edit')}
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(lead.id)}
                            className="p-1.5 rounded-lg text-brand-danger hover:bg-brand-danger-light/20 transition-colors cursor-pointer"
                            title={t('common.delete')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredLeads.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-text-secondary">
                      {t('common.noData')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {filteredLeads.length > 0 && (
            <div className="px-6 py-4 border-t border-border-custom flex items-center justify-between text-xs text-text-secondary select-none">
              <span>
                {isRTL 
                  ? `מציג ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, filteredLeads.length)} מתוך ${filteredLeads.length} לידים`
                  : `Showing ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, filteredLeads.length)} of ${filteredLeads.length} leads`}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-border-custom bg-bg-secondary text-text-secondary hover:text-text-primary disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                </button>
                <span className="font-semibold text-text-primary">{currentPage} / {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-border-custom bg-bg-secondary text-text-secondary hover:text-text-primary disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* --- SIDE DETAILS DRAWER PANEL --- */}
      {detailsLead && (
        <aside className="w-[370px] bg-bg-secondary border border-border-custom rounded-2xl p-6 shadow-lg fixed lg:sticky top-20 right-6 lg:right-auto bottom-6 z-20 overflow-y-auto animate-slide-in flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border-custom pb-4 mb-4">
              <h4 className="font-semibold font-display text-text-primary">{detailsLead.companyName}</h4>
              <button 
                onClick={() => setDetailsLead(null)}
                className="p-1 rounded-lg hover:bg-bg-tertiary text-text-secondary hover:text-text-primary cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Fields List */}
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-text-tertiary block font-bold mb-1 uppercase tracking-wider">{t('common.contact')}</span>
                <span className="text-text-primary font-medium text-sm">{detailsLead.contactName}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-text-tertiary block font-bold mb-1 uppercase tracking-wider">{t('common.email')}</span>
                  <span className="text-text-primary font-medium truncate block">{detailsLead.email}</span>
                </div>
                <div>
                  <span className="text-text-tertiary block font-bold mb-1 uppercase tracking-wider">{t('common.phone')}</span>
                  <span className="text-text-primary font-medium">{detailsLead.phone || '-'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-text-tertiary block font-bold mb-1 uppercase tracking-wider">{t('common.dealValue')}</span>
                  <span className="text-brand-primary font-bold text-sm">${detailsLead.dealValue.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-text-tertiary block font-bold mb-1 uppercase tracking-wider">{t('common.source')}</span>
                  <span className="text-text-primary font-medium">{detailsLead.leadSource}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-text-tertiary block font-bold mb-1 uppercase tracking-wider">{t('common.industry')}</span>
                  <span className="text-text-primary font-medium">{detailsLead.industry}</span>
                </div>
                <div>
                  <span className="text-text-tertiary block font-bold mb-1 uppercase tracking-wider">{t('common.country')}</span>
                  <span className="text-text-primary font-medium">{detailsLead.country || '-'}</span>
                </div>
              </div>

              {detailsLead.tags.length > 0 && (
                <div>
                  <span className="text-text-tertiary block font-bold mb-1 uppercase tracking-wider">{t('common.tags')}</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {detailsLead.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded-md bg-bg-tertiary text-text-secondary font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Note addition */}
            <div className="mt-8 border-t border-border-custom pt-6">
              <h5 className="font-semibold font-display text-text-primary text-xs mb-3 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-brand-primary" /> {t('common.notes')}
              </h5>
              
              <form onSubmit={handleAddNote} className="mb-4">
                <textarea
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder={t('leads.addNote')}
                  rows={2}
                  className="w-full text-xs p-3 border border-border-custom rounded-xl bg-bg-tertiary/10 text-text-primary outline-none focus:border-brand-primary resize-none placeholder-text-tertiary"
                />
                <Button type="submit" size="sm" className="mt-2 text-[10px] w-full">
                  {t('common.add')}
                </Button>
              </form>

              {/* Notes List */}
              <ul className="space-y-3.5 max-h-[180px] overflow-y-auto pr-1">
                {leadNotes.map(n => {
                  const creator = users.find(u => u.id === n.createdBy);
                  return (
                    <li key={n.id} className="p-3 border border-border-custom bg-bg-tertiary/20 rounded-xl relative group">
                      <p className="text-xs text-text-primary leading-relaxed">{n.content}</p>
                      <div className="flex items-center justify-between mt-2 text-[9px] text-text-tertiary">
                        <span className="flex items-center gap-1.5">
                          <span>{new Date(n.createdAt).toLocaleString()}</span>
                          {creator && <span className="font-semibold text-brand-primary">by {creator.fullName}</span>}
                        </span>
                        <button 
                          onClick={() => deleteNote(n.id)}
                          className="text-brand-danger opacity-0 group-hover:opacity-100 hover:underline transition-opacity cursor-pointer"
                        >
                          {t('common.delete')}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Attachments Section */}
            <div className="mt-8 border-t border-border-custom pt-6">
              <h5 className="font-semibold font-display text-text-primary text-xs mb-3 flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Paperclip className="w-3.5 h-3.5 text-brand-primary" /> {t('common.attachments')}</span>
                <label className="text-[10px] text-brand-primary font-semibold hover:underline cursor-pointer">
                  {t('common.add')}
                  <input type="file" onChange={handleFileUpload} className="hidden" />
                </label>
              </h5>

              <ul className="space-y-2">
                {leadAttachments.map(att => (
                  <li key={att.id} className="flex items-center justify-between p-2.5 border border-border-custom rounded-xl text-xs">
                    <span className="font-medium text-text-primary truncate max-w-[180px]">{att.fileName}</span>
                    <span className="text-[10px] text-text-tertiary">{att.fileSize}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      )}

      {/* --- MODALS (Create/Edit Form) --- */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title={t('leads.newLead')}>
        <form onSubmit={handleAddSubmit} className="space-y-4 text-start">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t('common.company')}
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              required
            />
            <Input
              label={t('common.contact')}
              value={formData.contactName}
              onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t('common.email')}
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label={t('common.phone')}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label={t('common.dealValue') + ' ($)'}
              type="number"
              value={formData.dealValue}
              onChange={(e) => setFormData({ ...formData, dealValue: Number(e.target.value) })}
            />
            <Select
              label={t('common.source')}
              value={formData.leadSource}
              onChange={(e) => setFormData({ ...formData, leadSource: e.target.value })}
              options={sourceOptions}
            />
            <Select
              label={t('common.industry')}
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              options={industryOptions}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t('common.country')}
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            />
            <Input
              label={t('common.tags') + ' (' + (isRTL ? 'מופרדים בפסיקים' : 'comma separated') + ')'}
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="e.g. SaaS, Enterprise"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label={t('common.owner')}
              value={formData.assignedOwnerId}
              onChange={(e) => setFormData({ ...formData, assignedOwnerId: e.target.value })}
              options={users.map(u => ({ value: u.id, label: u.fullName }))}
            />
            <Select
              label={t('common.status')}
              value={formData.statusId}
              onChange={(e) => setFormData({ ...formData, statusId: e.target.value })}
              options={statuses.map(s => ({ value: s.id, label: isRTL ? s.nameHe : s.nameEn }))}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border-custom">
            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit">
              {t('common.save')}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title={t('leads.editLead')}>
        <form onSubmit={handleEditSubmit} className="space-y-4 text-start">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t('common.company')}
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              required
            />
            <Input
              label={t('common.contact')}
              value={formData.contactName}
              onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t('common.email')}
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label={t('common.phone')}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label={t('common.dealValue') + ' ($)'}
              type="number"
              value={formData.dealValue}
              onChange={(e) => setFormData({ ...formData, dealValue: Number(e.target.value) })}
            />
            <Select
              label={t('common.source')}
              value={formData.leadSource}
              onChange={(e) => setFormData({ ...formData, leadSource: e.target.value })}
              options={sourceOptions}
            />
            <Select
              label={t('common.industry')}
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              options={industryOptions}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t('common.country')}
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            />
            <Input
              label={t('common.tags') + ' (' + (isRTL ? 'מופרדים בפסיקים' : 'comma separated') + ')'}
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label={t('common.owner')}
              value={formData.assignedOwnerId}
              onChange={(e) => setFormData({ ...formData, assignedOwnerId: e.target.value })}
              options={users.map(u => ({ value: u.id, label: u.fullName }))}
            />
            <Select
              label={t('common.status')}
              value={formData.statusId}
              onChange={(e) => setFormData({ ...formData, statusId: e.target.value })}
              options={statuses.map(s => ({ value: s.id, label: isRTL ? s.nameHe : s.nameEn }))}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border-custom">
            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
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
