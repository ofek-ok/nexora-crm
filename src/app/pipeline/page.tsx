'use client';

import { useCRMStore, Lead, PipelineStatus } from '@/store/crmStore';
import { useTranslation } from '@/hooks/useTranslation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { 
  Plus, 
  Trash2, 
  Settings, 
  DollarSign, 
  TrendingUp, 
  Users,
  Grid,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

export default function PipelinePage() {
  const { t, language, dir } = useTranslation();
  const isRTL = language === 'he';

  const leads = useCRMStore((state) => state.leads);
  const statuses = useCRMStore((state) => state.pipelineStatuses);
  const updateLead = useCRMStore((state) => state.updateLead);
  const addStatus = useCRMStore((state) => state.addStatus);
  const deleteStatus = useCRMStore((state) => state.deleteStatus);
  const addToast = useCRMStore((state) => state.addToast);

  // HTML5 Drag and Drop state
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [draggedOverColId, setDraggedOverColId] = useState<string | null>(null);

  // Custom stage modal state
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [stageNameEn, setStageNameEn] = useState('');
  const [stageNameHe, setStageNameHe] = useState('');
  const [stageColor, setStageColor] = useState('#2563EB');

  // --- DRAG AND DROP HANDLERS ---
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedLeadId(id);
  };

  const handleDragOver = (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    if (draggedOverColId !== colId) {
      setDraggedOverColId(colId);
    }
  };

  const handleDragEnd = () => {
    setDraggedLeadId(null);
    setDraggedOverColId(null);
  };

  const handleDrop = (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('text/plain') || draggedLeadId;
    if (leadId) {
      updateLead(leadId, { statusId: colId });
      addToast(isRTL ? 'שלב העסקה עודכן בהצלחה' : 'Deal stage updated successfully', 'success');
    }
    handleDragEnd();
  };

  // --- CREATE STAGE HANDLER ---
  const handleCreateStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stageNameEn || !stageNameHe) {
      addToast(isRTL ? 'נא למלא את שם השלב בשתי השפות' : 'Please provide stage names in both languages', 'error');
      return;
    }

    const orderIndex = statuses.length;
    addStatus({
      nameEn: stageNameEn,
      nameHe: stageNameHe,
      color: stageColor,
      orderIndex
    });

    setStageNameEn('');
    setStageNameHe('');
    setStageColor('#2563EB');
    setIsStageModalOpen(false);
    addToast(isRTL ? 'שלב מכירות חדש נוסף' : 'New sales stage added', 'success');
  };

  const handleDeleteStage = (id: string, name: string) => {
    if (confirm(isRTL ? `האם למחוק את השלב "${name}"? כל הלידים המשוייכים אליו יועברו לשלב הבא.` : `Delete stage "${name}"? Leads will fall back to other stages.`)) {
      deleteStatus(id);
      addToast(isRTL ? 'השלב נמחק' : 'Stage deleted', 'warning');
    }
  };

  // Pipeline overall summary
  const openLeads = leads.filter(l => l.statusId !== 's-5' && l.statusId !== 's-6');
  const totalPipelineValue = openLeads.reduce((sum, l) => sum + l.dealValue, 0);

  return (
    <div className="space-y-6" dir={dir}>
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-display tracking-tight text-text-primary">
            {t('pipeline.title')}
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            {isRTL 
              ? 'גרור והשלך לידים בין שלבי המכירה. ראה את שווי העסקאות בכל שלב בזמן אמת.' 
              : 'Drag & drop cards to progress deals. Visualize value distribution at a glance.'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            leftIcon={<Settings className="w-4 h-4" />}
            onClick={() => setIsStageModalOpen(true)}
          >
            {t('pipeline.addStatus')}
          </Button>
        </div>
      </div>

      {/* Pipeline KPI Ribbon */}
      <Card className="p-4 bg-bg-secondary border-border-custom shadow-sm flex flex-wrap gap-6 items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-brand-primary-light text-brand-primary">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
              {t('pipeline.totalValue')} ({isRTL ? 'עסקאות פעילות' : 'Active Pipeline'})
            </span>
            <span className="text-xl font-bold font-display text-text-primary">
              ${totalPipelineValue.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500">
            <Grid className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
              {isRTL ? 'סה"כ שלבים' : 'Total Stages'}
            </span>
            <span className="text-xl font-bold font-display text-text-primary">
              {statuses.length}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-brand-warning">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
              {isRTL ? 'לידים פתוחים' : 'Open Leads'}
            </span>
            <span className="text-xl font-bold font-display text-text-primary">
              {openLeads.length}
            </span>
          </div>
        </div>
      </Card>

      {/* Kanban Scroll Board */}
      <div className="flex gap-4 overflow-x-auto pb-4 pt-1 select-none">
        {statuses.map((status) => {
          const colLeads = leads.filter(l => l.statusId === status.id);
          const colValue = colLeads.reduce((sum, l) => sum + l.dealValue, 0);
          
          const isOver = draggedOverColId === status.id;

          return (
            <div
              key={status.id}
              className={`flex-shrink-0 w-80 rounded-2xl p-4 flex flex-col gap-3 transition-colors duration-200 border min-h-[500px] ${
                isOver 
                  ? 'border-brand-primary bg-brand-primary-light/5 dark:bg-brand-primary-light/5' 
                  : 'border-border-custom bg-bg-secondary/40'
              }`}
              onDragOver={(e) => handleDragOver(e, status.id)}
              onDrop={(e) => handleDrop(e, status.id)}
              onDragLeave={() => setDraggedOverColId(null)}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-border-custom">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div 
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: status.color }}
                  />
                  <h4 className="font-semibold text-sm text-text-primary truncate" title={isRTL ? status.nameHe : status.nameEn}>
                    {isRTL ? status.nameHe : status.nameEn}
                  </h4>
                  <span className="px-1.5 py-0.5 rounded-md bg-bg-tertiary text-[10px] font-bold text-text-secondary">
                    {colLeads.length}
                  </span>
                </div>
                
                {/* Delete Stage Button (only show if not default built-in status to prevent breakages, or show for all but keep 1) */}
                {statuses.length > 1 && !['s-1', 's-2', 's-3', 's-4', 's-5', 's-6'].includes(status.id) && (
                  <button
                    onClick={() => handleDeleteStage(status.id, isRTL ? status.nameHe : status.nameEn)}
                    className="p-1 rounded text-text-tertiary hover:text-brand-danger hover:bg-brand-danger-light/10 transition-colors cursor-pointer"
                    title={isRTL ? 'מחק שלב' : 'Delete stage'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Column Stats */}
              <div className="flex items-center justify-between text-[10px] text-text-secondary font-semibold bg-bg-tertiary/20 p-2 rounded-lg">
                <span>{isRTL ? 'שווי כולל' : 'Stage Value'}</span>
                <span className="text-text-primary font-bold">${colValue.toLocaleString()}</span>
              </div>

              {/* Column Cards Area */}
              <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto max-h-[550px] pr-1">
                {colLeads.map((lead) => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, lead.id)}
                    onDragEnd={handleDragEnd}
                    className="kanban-card p-4 rounded-xl border border-border-custom bg-bg-secondary shadow-sm hover:shadow hover:border-text-tertiary/40 cursor-grab active:cursor-grabbing transition-all flex flex-col gap-3"
                  >
                    <div>
                      <span className="text-[10px] text-text-tertiary uppercase tracking-wider block font-bold mb-1">
                        {lead.industry}
                      </span>
                      <h5 className="font-semibold text-text-primary text-sm leading-snug">
                        {lead.companyName}
                      </h5>
                      <span className="text-xs text-text-secondary block mt-0.5">
                        {lead.contactName}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-bg-tertiary">
                      <span className="font-bold text-xs text-brand-primary">
                        ${lead.dealValue.toLocaleString()}
                      </span>
                      
                      {lead.tags.length > 0 && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-bg-tertiary text-text-secondary font-medium">
                          {lead.tags[0]}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {colLeads.length === 0 && (
                  <div className="flex-1 flex items-center justify-center border border-dashed border-border-custom/60 rounded-xl p-6 text-center text-xs text-text-tertiary opacity-60">
                    {isRTL ? 'גרור ליד לכאן' : 'Drag deals here'}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* --- ADD NEW PIPELINE STAGE MODAL --- */}
      <Modal isOpen={isStageModalOpen} onClose={() => setIsStageModalOpen(false)} title={t('pipeline.addStatus')}>
        <form onSubmit={handleCreateStage} className="space-y-4 text-start">
          <Input
            label={t('pipeline.newStatusName') + ' (English)'}
            value={stageNameEn}
            onChange={(e) => setStageNameEn(e.target.value)}
            required
            placeholder="e.g. Discovery"
          />

          <Input
            label={t('pipeline.newStatusName') + ' (עברית)'}
            value={stageNameHe}
            onChange={(e) => setStageNameHe(e.target.value)}
            required
            placeholder="לדוגמה: פגישת היכרות"
          />

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-text-secondary">
              {t('pipeline.stageColor')}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={stageColor}
                onChange={(e) => setStageColor(e.target.value)}
                className="w-10 h-10 border border-border-custom rounded-xl cursor-pointer"
              />
              <span className="text-xs text-text-secondary font-mono uppercase">{stageColor}</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border-custom">
            <Button type="button" variant="outline" onClick={() => setIsStageModalOpen(false)}>
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
