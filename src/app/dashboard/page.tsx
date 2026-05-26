'use client';

import { useCRMStore } from '@/store/crmStore';
import { useTranslation } from '@/hooks/useTranslation';
import { Card } from '@/components/ui/Card';
import { 
  Users2, 
  ShieldCheck, 
  FolderOpen, 
  DollarSign, 
  CheckSquare, 
  ArrowRight,
  Plus,
  MessageSquare,
  Phone,
  FileText,
  UserCheck,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { t, language } = useTranslation();
  const leads = useCRMStore((state) => state.leads);
  const customers = useCRMStore((state) => state.customers);
  const tasks = useCRMStore((state) => state.tasks);
  const activities = useCRMStore((state) => state.activities);
  const statuses = useCRMStore((state) => state.pipelineStatuses);
  const currentUser = useCRMStore((state) => state.currentUser);

  // --- STATS CALCULATIONS ---
  // --- ROLE FILTERED DATA (Disabled: Everyone sees everything)
  const visibleLeads = leads;
  const visibleCustomers = customers;
  const visibleTasks = tasks;
  const visibleActivities = activities;

  // --- STATS CALCULATIONS ---
  const totalLeads = visibleLeads.length;
  const activeCustomers = visibleCustomers.length;
  
  // Open deals: leads not in Closed Won (s-5) or Closed Lost (s-6)
  const openDealsList = visibleLeads.filter(
    (l) => l.statusId !== 's-5' && l.statusId !== 's-6'
  );
  const openDealsCount = openDealsList.length;

  // Pipeline value: sum of deal values for all open deals
  const pipelineValue = openDealsList.reduce((sum, l) => sum + l.dealValue, 0);

  // Tasks due today: pending tasks due on or before 2026-05-26
  const todayStr = '2026-05-26'; // Fixed reference today date for MVP consistency
  const tasksDueTodayCount = visibleTasks.filter(
    (t) => t.dueDate === todayStr && t.status === 'pending'
  ).length;

  // --- CHART CALCULATIONS ---
  // Distribution of deal value per stage
  const stageData = statuses.map((status) => {
    const leadsInStage = visibleLeads.filter((l) => l.statusId === status.id);
    const value = leadsInStage.reduce((sum, l) => sum + l.dealValue, 0);
    const count = leadsInStage.length;
    return {
      statusId: status.id,
      name: language === 'he' ? status.nameHe : status.nameEn,
      color: status.color,
      value,
      count
    };
  });

  const maxStageValue = Math.max(...stageData.map((d) => d.value), 1);

  // Get recent 5 activities
  const recentActivities = visibleActivities.slice(0, 5);

  const activityIcons = {
    note: <MessageSquare className="w-4 h-4 text-brand-primary" />,
    call: <Phone className="w-4 h-4 text-emerald-500" />,
    meeting: <CheckSquare className="w-4 h-4 text-indigo-500" />,
    email: <MessageSquare className="w-4 h-4 text-amber-500" />,
    status_change: <FolderOpen className="w-4 h-4 text-cyan-500" />,
    file_upload: <FileText className="w-4 h-4 text-rose-500" />,
    convert: <UserCheck className="w-4 h-4 text-brand-success" />
  };

  const activityBg = {
    note: 'bg-brand-primary-light',
    call: 'bg-emerald-50 dark:bg-emerald-950/30',
    meeting: 'bg-indigo-50 dark:bg-indigo-950/30',
    email: 'bg-amber-50 dark:bg-amber-950/30',
    status_change: 'bg-cyan-50 dark:bg-cyan-950/30',
    file_upload: 'bg-rose-50 dark:bg-rose-950/30',
    convert: 'bg-brand-success-light'
  };

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-display tracking-tight text-text-primary">
            {language === 'he' ? 'ברוך הבא ל-Nexora CRM' : 'Welcome to Nexora CRM'}
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            {language === 'he' 
              ? 'ריכוז הנתונים והפעילויות החמות ביותר למכירות שלך להיום.' 
              : 'Summary of the hottest sales metrics and actions for today.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/leads">
            <button className="inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 px-4 py-2.5 text-sm gap-2 bg-brand-primary text-white hover:bg-brand-primary-hover shadow-sm active:scale-[0.98] cursor-pointer">
              <Plus className="w-4 h-4" />
              <span>{t('leads.newLead')}</span>
            </button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {/* Total Leads */}
        <Card className="hover-lift flex flex-col justify-between p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              {t('dashboard.totalLeads')}
            </span>
            <div className="p-2.5 rounded-xl bg-brand-primary-light text-brand-primary">
              <Users2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold font-display text-text-primary">
              {totalLeads}
            </h3>
            <span className="text-[10px] text-brand-success font-semibold flex items-center gap-0.5 mt-1.5">
              <TrendingUp className="w-3 h-3" /> +12% {language === 'he' ? 'החודש' : 'this month'}
            </span>
          </div>
        </Card>

        {/* Active Customers */}
        <Card className="hover-lift flex flex-col justify-between p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              {t('dashboard.activeCustomers')}
            </span>
            <div className="p-2.5 rounded-xl bg-brand-success-light text-brand-success">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold font-display text-text-primary">
              {activeCustomers}
            </h3>
            <span className="text-[10px] text-text-secondary font-semibold block mt-1.5">
              {language === 'he' ? 'יחס המרה של 18%' : '18% conversion rate'}
            </span>
          </div>
        </Card>

        {/* Open Deals */}
        <Card className="hover-lift flex flex-col justify-between p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              {t('dashboard.openDeals')}
            </span>
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-brand-warning">
              <FolderOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold font-display text-text-primary">
              {openDealsCount}
            </h3>
            <span className="text-[10px] text-brand-warning font-semibold block mt-1.5">
              {language === 'he' ? 'בתהליכי משא ומתן' : 'In pipeline negotiation'}
            </span>
          </div>
        </Card>

        {/* Pipeline Value */}
        <Card className="hover-lift flex flex-col justify-between p-5 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              {t('dashboard.pipelineValue')}
            </span>
            <div className="p-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/30 text-cyan-500">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold font-display text-text-primary">
              ${pipelineValue.toLocaleString()}
            </h3>
            <span className="text-[10px] text-brand-success font-semibold flex items-center gap-0.5 mt-1.5">
              <TrendingUp className="w-3 h-3" /> +8.4% {language === 'he' ? 'משבוע שעבר' : 'vs last week'}
            </span>
          </div>
        </Card>

        {/* Tasks Due Today */}
        <Card className="hover-lift flex flex-col justify-between p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              {t('dashboard.tasksDue')}
            </span>
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-brand-danger">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold font-display text-text-primary">
              {tasksDueTodayCount}
            </h3>
            <span className="text-[10px] text-brand-danger font-semibold block mt-1.5">
              {language === 'he' ? 'דורשות טיפול מיידי' : 'Require urgent attention'}
            </span>
          </div>
        </Card>
      </div>

      {/* Main Grid: Pipeline Chart & Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales Pipeline Chart */}
        <Card className="lg:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold font-display text-text-primary border-b border-border-custom pb-3">
              {t('dashboard.dealsSummary')}
            </h3>
            <div className="space-y-4 mt-6">
              {stageData.map((stage) => {
                const percentage = Math.round((stage.value / maxStageValue) * 100) || 0;
                return (
                  <div key={stage.statusId} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-text-primary font-semibold">{stage.name}</span>
                      <span className="text-text-secondary">
                        {stage.count} {t('pipeline.dealsCount')} • 
                        <strong className="text-text-primary ms-1">${stage.value.toLocaleString()}</strong>
                      </span>
                    </div>
                    {/* Visual Bar */}
                    <div className="w-full h-3 bg-bg-tertiary rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500 ease-out"
                        style={{ 
                          width: `${Math.max(percentage, 2)}%`, 
                          backgroundColor: stage.color 
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-border-custom flex items-center justify-between text-xs text-text-secondary">
            <span>
              {language === 'he' 
                ? 'מחושב מתוך ערך העסקאות הפעילות בלבד' 
                : 'Calculated from active deal values in progress'}
            </span>
            <Link href="/pipeline" className="text-brand-primary font-semibold hover:underline flex items-center gap-1">
              <span>{language === 'he' ? 'ללוח ה-Kanban' : 'Go to Kanban Pipeline'}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </Link>
          </div>
        </Card>

        {/* Activity Timeline */}
        <Card className="flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold font-display text-text-primary border-b border-border-custom pb-3">
              {t('dashboard.recentActivity')}
            </h3>
            
            <div className="relative mt-6 ps-4 border-s border-border-custom space-y-6">
              {recentActivities.map((act) => {
                const date = new Date(act.createdAt);
                const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                return (
                  <div key={act.id} className="relative">
                    {/* Circle icon marker */}
                    <div className={`absolute -start-[27px] top-0 p-1.5 rounded-xl border border-border-custom shadow-sm ${activityBg[act.type] || 'bg-bg-secondary'}`}>
                      {activityIcons[act.type]}
                    </div>
                    
                    {/* Activity Item content */}
                    <div className="ps-2">
                      <p className="text-xs text-text-primary leading-relaxed font-medium">
                        {language === 'he' ? act.contentHe : act.contentEn}
                      </p>
                      <span className="text-[10px] text-text-tertiary block mt-1">
                        {formattedTime} • {date.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })}

              {recentActivities.length === 0 && (
                <div className="text-center py-10 text-xs text-text-tertiary">
                  {t('common.noData')}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border-custom">
            <span className="text-[10px] text-text-tertiary block">
              {language === 'he' ? '* עדכון הפעילויות מתבצע בזמן אמת' : '* Activity timeline updates automatically in real-time'}
            </span>
          </div>
        </Card>

      </div>
    </div>
  );
}
