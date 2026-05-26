'use client';

import { useCRMStore, PipelineStatus } from '@/store/crmStore';
import { useTranslation } from '@/hooks/useTranslation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { 
  Globe, 
  Sun, 
  Moon, 
  Settings as SettingsIcon, 
  Users, 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  RotateCcw,
  Palette,
  CheckCircle,
  Plus
} from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const { t, language, toggleLanguage, dir } = useTranslation();
  const isRTL = language === 'he';

  const theme = useCRMStore((state) => state.theme);
  const setTheme = useCRMStore((state) => state.setTheme);
  const statuses = useCRMStore((state) => state.pipelineStatuses);
  const updateStatusesOrder = useCRMStore((state) => state.updateStatusesOrder);
  const deleteStatus = useCRMStore((state) => state.deleteStatus);
  const resetToMockData = useCRMStore((state) => state.resetToMockData);
  const users = useCRMStore((state) => state.users);
  const login = useCRMStore((state) => state.login);
  const addToast = useCRMStore((state) => state.addToast);
  const currentUser = useCRMStore((state) => state.currentUser);
  const updateUserRole = useCRMStore((state) => state.updateUserRole);

  // New user form state
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'agent'>('agent');

  // Change Theme utility
  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    if (typeof document !== 'undefined') {
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    addToast(isRTL ? 'ערכת הנושא עודכנה' : 'Theme updated successfully', 'success');
  };

  // Reordering stages
  const moveStage = (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= statuses.length) return;

    const list = [...statuses];
    const temp = list[index];
    list[index] = list[nextIndex];
    list[nextIndex] = temp;

    // Recalculate indexes
    const updated = list.map((s, idx) => ({ ...s, orderIndex: idx }));
    updateStatusesOrder(updated);
    addToast(isRTL ? 'סדר השלבים עודכן' : 'Stage order updated', 'success');
  };

  // Reset to Mock data trigger
  const handleResetData = () => {
    if (confirm(isRTL ? 'האם אתה בטוח שברצונך לאפס את כל הנתונים לברירת מחדל? כל הלידים והמשימות החדשות יימחקו!' : 'Are you sure you want to reset all CRM data? All local changes will be lost.')) {
      resetToMockData();
      addToast(isRTL ? 'המערכת אותחלה בהצלחה' : 'System data reset completed', 'success');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  // Add simulated user
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail || !newUserName) return;

    // Use login action internally to register user
    await login(newUserEmail, newUserName, newUserRole);
    setNewUserEmail('');
    setNewUserName('');
    addToast(isRTL ? 'משתמש נוסף בהצלחה' : 'User added successfully', 'success');
  };

  // Change user role
  const handleUserRoleChange = async (userId: string, newRole: 'admin' | 'agent') => {
    try {
      await updateUserRole(userId, newRole);
      addToast(isRTL ? 'תפקיד המשתמש עודכן בהצלחה' : 'User role updated successfully', 'success');
    } catch (e) {
      console.error(e);
      addToast(isRTL ? 'שגיאה בעדכון התפקיד' : 'Error updating user role', 'error');
    }
  };

  return (
    <div className="space-y-6" dir={dir}>
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold font-display tracking-tight text-text-primary">
          {t('settings.title')}
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          {isRTL ? 'נהל הגדרות שפה, ערכות נושא, משתמשים ושלבי מכירה.' : 'Manage localization, dark mode, team roles, and sales pipeline stages.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Preferences */}
        <div className="space-y-6 lg:col-span-1">
          {/* Language & Theme Card */}
          <Card>
            <h4 className="font-semibold font-display text-text-primary text-sm border-b border-border-custom pb-3.5 mb-4 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-brand-primary" /> {isRTL ? 'העדפות מערכת' : 'System Preferences'}
            </h4>

            {/* Language */}
            <div className="space-y-3 mb-6">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block">
                {t('settings.language')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    useCRMStore.getState().setLanguage('en');
                    addToast('Language set to English', 'success');
                  }}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all duration-200 cursor-pointer ${
                    language === 'en' 
                      ? 'bg-brand-primary text-white border-brand-primary' 
                      : 'border-border-custom hover:bg-bg-tertiary text-text-secondary'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => {
                    useCRMStore.getState().setLanguage('he');
                    addToast('השפה שונתה לעברית', 'success');
                  }}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all duration-200 cursor-pointer ${
                    language === 'he' 
                      ? 'bg-brand-primary text-white border-brand-primary' 
                      : 'border-border-custom hover:bg-bg-tertiary text-text-secondary'
                  }`}
                >
                  עברית
                </button>
              </div>
            </div>

            {/* Theme */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block">
                {t('settings.theme')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`py-2.5 px-3 text-xs font-semibold rounded-xl border flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                    theme === 'light' 
                      ? 'bg-brand-primary text-white border-brand-primary' 
                      : 'border-border-custom hover:bg-bg-tertiary text-text-secondary'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>{t('settings.light')}</span>
                </button>
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`py-2.5 px-3 text-xs font-semibold rounded-xl border flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                    theme === 'dark' 
                      ? 'bg-brand-primary text-white border-brand-primary' 
                      : 'border-border-custom hover:bg-bg-tertiary text-text-secondary'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>{t('settings.dark')}</span>
                </button>
              </div>
            </div>
          </Card>

          {/* System Maintenance / Reset */}
          <Card className="border-brand-danger/20">
            <h4 className="font-semibold font-display text-text-primary text-sm border-b border-border-custom pb-3.5 mb-4 flex items-center gap-1.5 text-brand-danger">
              <RotateCcw className="w-4 h-4" /> {isRTL ? 'איפוס מערכת' : 'System Reset'}
            </h4>
            <p className="text-xs text-text-secondary mb-4 leading-relaxed">
              {isRTL 
                ? 'איפוס ימחק את כל הלידים, המשימות והלקוחות החדשים שנוצרו ויחזיר את המערכת לנתוני הדמו המקוריים.' 
                : 'Resetting restores the database to initial mock profiles. All additions will be deleted.'}
            </p>
            <Button
              variant="danger"
              size="sm"
              onClick={handleResetData}
              className="w-full flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isRTL ? 'אפס נתוני מערכת' : 'Reset to Defaults'}</span>
            </Button>
          </Card>
        </div>

        {/* Right Columns: Pipeline stages reordering & User Management */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* Pipeline Config stage list */}
          <Card>
            <h4 className="font-semibold font-display text-text-primary text-sm border-b border-border-custom pb-3.5 mb-4 flex items-center gap-1.5">
              <SettingsIcon className="w-4 h-4 text-brand-primary" /> {t('settings.pipelineConfig')}
            </h4>

            <div className="space-y-2">
              {statuses.map((status, index) => (
                <div 
                  key={status.id}
                  className="flex items-center justify-between p-3.5 border border-border-custom rounded-xl bg-bg-tertiary/20"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-lg flex-shrink-0 border border-black/5"
                      style={{ backgroundColor: status.color }}
                    />
                    <span className="font-semibold text-sm text-text-primary">
                      {isRTL ? status.nameHe : status.nameEn}
                    </span>
                    <span className="text-[10px] text-text-tertiary font-mono uppercase">
                      ({isRTL ? status.nameEn : status.nameHe})
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Up control */}
                    <button
                      onClick={() => moveStage(index, 'up')}
                      disabled={index === 0}
                      className="p-1.5 rounded hover:bg-bg-tertiary disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-4 h-4 text-text-secondary" />
                    </button>
                    {/* Down control */}
                    <button
                      onClick={() => moveStage(index, 'down')}
                      disabled={index === statuses.length - 1}
                      className="p-1.5 rounded hover:bg-bg-tertiary disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-4 h-4 text-text-secondary" />
                    </button>

                    {/* Delete button for custom stages */}
                    {statuses.length > 1 && !['s-1', 's-2', 's-3', 's-4', 's-5', 's-6'].includes(status.id) && (
                      <button
                        onClick={() => deleteStatus(status.id)}
                        className="p-1.5 rounded hover:bg-brand-danger-light/20 text-text-tertiary hover:text-brand-danger cursor-pointer"
                        title="Delete Stage"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* User management simulator */}
          <Card>
            <h4 className="font-semibold font-display text-text-primary text-sm border-b border-border-custom pb-3.5 mb-4 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-brand-primary" /> {isRTL ? 'ניהול צוות מכירות' : 'Team Roles Management'}
            </h4>

            {/* List current users */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {users.map(u => (
                <div key={u.id} className="flex items-center gap-3 p-3 border border-border-custom rounded-xl bg-bg-secondary">
                  <div className="w-9 h-9 rounded-xl bg-brand-primary-light text-brand-primary flex items-center justify-center font-bold text-xs uppercase">
                    {u.fullName.charAt(0)}
                  </div>
                  <div className="overflow-hidden flex-1">
                    <h5 className="text-xs font-semibold text-text-primary truncate">{u.fullName}</h5>
                    <p className="text-[10px] text-text-secondary truncate">{u.email}</p>
                  </div>
                  {currentUser?.role === 'admin' ? (
                    <select
                      value={u.role}
                      onChange={(e) => handleUserRoleChange(u.id, e.target.value as 'admin' | 'agent')}
                      className="text-[10px] bg-bg-tertiary border border-border-custom rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-primary font-semibold text-text-primary cursor-pointer"
                    >
                      <option value="agent">{isRTL ? 'נציג' : 'Agent'}</option>
                      <option value="admin">{isRTL ? 'מנהל' : 'Admin'}</option>
                    </select>
                  ) : (
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      u.role === 'admin' ? 'bg-brand-primary-light text-brand-primary' : 'bg-bg-tertiary text-text-secondary'
                    }`}>
                      {u.role === 'admin' ? (isRTL ? 'מנהל' : 'Admin') : (isRTL ? 'נציג' : 'Agent')}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Add user form simulator */}
            <form onSubmit={handleAddUser} className="p-4 border border-border-custom rounded-2xl bg-bg-tertiary/20 space-y-4">
              <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block">
                {isRTL ? 'הוסף חבר צוות חדש' : 'Simulate Adding Team Member'}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label={t('auth.fullName')}
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Levy Cohen"
                  required
                />
                <Input
                  label={t('auth.email')}
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="e.g. levy@nexora.com"
                  required
                />
              </div>

              <div className="flex items-end justify-between gap-4">
                <Select
                  label={t('auth.role')}
                  value={newUserRole}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewUserRole(e.target.value as 'admin' | 'agent')}
                  options={[
                    { value: 'agent', label: 'Agent (נציג)' },
                    { value: 'admin', label: 'Admin (מנהל)' }
                  ]}
                  containerClassName="max-w-xs"
                />

                <Button type="submit" size="sm" className="mb-0.5" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                  {t('common.add')}
                </Button>
              </div>
            </form>
          </Card>

        </div>

      </div>
    </div>
  );
}
