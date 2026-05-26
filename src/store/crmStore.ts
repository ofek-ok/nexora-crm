import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// --- TYPES ---

export type UserRole = 'admin' | 'agent';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface PipelineStatus {
  id: string;
  nameEn: string;
  nameHe: string;
  color: string;
  orderIndex: number;
}

export interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  country: string;
  industry: string;
  leadSource: string;
  dealValue: number;
  assignedOwnerId: string;
  notesCount: number;
  statusId: string;
  tags: string[];
  lastActivityDate: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  leadId: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  country: string;
  industry: string;
  dealValue: number;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
  assignedTo: string; // User ID
  leadId?: string;
  customerId?: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  type: 'note' | 'call' | 'meeting' | 'email' | 'status_change' | 'file_upload' | 'convert';
  contentEn: string;
  contentHe: string;
  leadId?: string;
  customerId?: string;
  createdBy: string; // User ID
  createdAt: string;
}

export interface Note {
  id: string;
  content: string;
  leadId?: string;
  customerId?: string;
  createdBy: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: string;
  leadId?: string;
  customerId?: string;
  createdAt: string;
}

interface CRMState {
  // Auth State
  currentUser: User | null;
  users: User[];
  isAuthenticated: boolean;
  
  // App Configurations
  language: 'en' | 'he';
  theme: 'light' | 'dark';
  searchQuery: string;

  // CRM Entities
  pipelineStatuses: PipelineStatus[];
  leads: Lead[];
  customers: Customer[];
  tasks: Task[];
  activities: Activity[];
  notes: Note[];
  attachments: Attachment[];
  toasts: { id: string; type: 'success' | 'error' | 'warning' | 'info'; message: string }[];

  // Actions
  setLanguage: (lang: 'en' | 'he') => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setSearchQuery: (query: string) => void;
  
  // Toast Actions
  addToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  removeToast: (id: string) => void;

  // Data Fetch Syncing
  fetchData: () => Promise<void>;
  
  // Auth Actions
  login: (email: string, fullName: string, role: UserRole) => boolean;
  register: (email: string, fullName: string, role: UserRole) => boolean;
  logout: () => void;
  
  // Lead Actions
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'lastActivityDate' | 'notesCount'>) => Promise<void>;
  updateLead: (id: string, updates: Partial<Lead>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  convertToCustomer: (leadId: string) => Promise<void>;
  
  // Pipeline Status Actions
  addStatus: (status: Omit<PipelineStatus, 'id'>) => Promise<void>;
  updateStatusesOrder: (statuses: PipelineStatus[]) => Promise<void>;
  deleteStatus: (id: string) => Promise<void>;
  
  // Customer Actions
  updateCustomer: (id: string, updates: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  
  // Task Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  toggleTaskStatus: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  
  // Note Actions
  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  
  // Attachment Actions
  addAttachment: (attachment: Omit<Attachment, 'id' | 'createdAt'>) => Promise<void>;
  deleteAttachment: (id: string) => Promise<void>;
  
  // Reset Data
  resetToMockData: () => void;
}

// --- INITIAL MOCK DATA ---

const DEFAULT_USERS: User[] = [
  { id: 'u-1', email: 'admin@nexora.com', fullName: 'Ofek Ok', role: 'admin', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face' },
  { id: 'u-2', email: 'agent1@nexora.com', fullName: 'Sarah Levi', role: 'agent', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face' },
  { id: 'u-3', email: 'agent2@nexora.com', fullName: 'David Cohen', role: 'agent', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face' }
];

const DEFAULT_STATUSES: PipelineStatus[] = [
  { id: 's-1', nameEn: 'New Lead', nameHe: 'ליד חדש', color: '#2563EB', orderIndex: 0 },
  { id: 's-2', nameEn: 'Contacted', nameHe: 'נוצר קשר', color: '#8B5CF6', orderIndex: 1 },
  { id: 's-3', nameEn: 'Negotiation', nameHe: 'משא ומתן', color: '#F59E0B', orderIndex: 2 },
  { id: 's-4', nameEn: 'Proposal Sent', nameHe: 'הצעה נשלחה', color: '#06B6D4', orderIndex: 3 },
  { id: 's-5', nameEn: 'Closed Won', nameHe: 'עסקה נסגרה בהצלחה', color: '#10B981', orderIndex: 4 },
  { id: 's-6', nameEn: 'Closed Lost', nameHe: 'עסקה אבודה', color: '#EF4444', orderIndex: 5 }
];

const DEFAULT_LEADS: Lead[] = [
  {
    id: 'l-1',
    companyName: 'Acme Corp',
    contactName: 'John Doe',
    email: 'john@acme.com',
    phone: '+1-555-0199',
    country: 'United States',
    industry: 'Software',
    leadSource: 'Website',
    dealValue: 12000,
    assignedOwnerId: 'u-2',
    notesCount: 2,
    statusId: 's-1',
    tags: ['SaaS', 'Enterprise'],
    lastActivityDate: '2026-05-26',
    createdAt: '2026-05-20'
  },
  {
    id: 'l-2',
    companyName: 'CyberShield Ltd',
    contactName: 'Idan Cohen',
    email: 'idan@cybershield.co.il',
    phone: '+972-52-1234567',
    country: 'Israel',
    industry: 'Cybersecurity',
    leadSource: 'LinkedIn',
    dealValue: 45000,
    assignedOwnerId: 'u-1',
    notesCount: 1,
    statusId: 's-3',
    tags: ['High Value', 'Security'],
    lastActivityDate: '2026-05-25',
    createdAt: '2026-05-18'
  },
  {
    id: 'l-3',
    companyName: 'Apex Logistics',
    contactName: 'Emma Watson',
    email: 'emma@apexlog.com',
    phone: '+44-20-7946-0958',
    country: 'United Kingdom',
    industry: 'Logistics',
    leadSource: 'Referral',
    dealValue: 8500,
    assignedOwnerId: 'u-3',
    notesCount: 0,
    statusId: 's-2',
    tags: ['Logistics'],
    lastActivityDate: '2026-05-24',
    createdAt: '2026-05-22'
  },
  {
    id: 'l-4',
    companyName: 'MedTech Systems',
    contactName: 'Noam Levy',
    email: 'noam@medtech.com',
    phone: '+972-54-7654321',
    country: 'Israel',
    industry: 'Healthcare',
    leadSource: 'Cold Outreach',
    dealValue: 23000,
    assignedOwnerId: 'u-2',
    notesCount: 3,
    statusId: 's-4',
    tags: ['Medical', 'Partner'],
    lastActivityDate: '2026-05-26',
    createdAt: '2026-05-15'
  },
  {
    id: 'l-5',
    companyName: 'Fintech Solutions',
    contactName: 'Robert Johnson',
    email: 'robert@fintechsol.com',
    phone: '+1-555-0144',
    country: 'United States',
    industry: 'Finance',
    leadSource: 'Google Ads',
    dealValue: 31000,
    assignedOwnerId: 'u-1',
    notesCount: 1,
    statusId: 's-3',
    tags: ['Fintech'],
    lastActivityDate: '2026-05-25',
    createdAt: '2026-05-19'
  }
];

const DEFAULT_CUSTOMERS: Customer[] = [
  {
    id: 'c-1',
    leadId: 'l-old-1',
    companyName: 'AlphaTech Industries',
    contactName: 'Yoni Levi',
    email: 'yoni@alphatech.co.il',
    phone: '+972-50-9998888',
    country: 'Israel',
    industry: 'Manufacturing',
    dealValue: 60000,
    createdAt: '2026-04-10'
  },
  {
    id: 'c-2',
    leadId: 'l-old-2',
    companyName: 'Global Cloud Services',
    contactName: 'Alice Peterson',
    email: 'alice@globalcloud.com',
    phone: '+1-555-0887',
    country: 'United States',
    industry: 'Cloud Hosting',
    dealValue: 18500,
    createdAt: '2026-05-02'
  }
];

const DEFAULT_TASKS: Task[] = [
  {
    id: 't-1',
    title: 'Call Idan to discuss negotiation details',
    description: 'Review the proposal terms and finalize discount limits.',
    dueDate: '2026-05-26',
    priority: 'high',
    status: 'pending',
    assignedTo: 'u-1',
    leadId: 'l-2',
    createdAt: '2026-05-25'
  },
  {
    id: 't-2',
    title: 'Send formal contract proposal to Acme Corp',
    description: 'Prepare the NDA and master service agreement.',
    dueDate: '2026-05-27',
    priority: 'medium',
    status: 'pending',
    assignedTo: 'u-2',
    leadId: 'l-1',
    createdAt: '2026-05-24'
  },
  {
    id: 't-3',
    title: 'Welcome onboarding call with AlphaTech',
    description: 'Walk through implementation steps with their IT team.',
    dueDate: '2026-05-26',
    priority: 'high',
    status: 'completed',
    assignedTo: 'u-1',
    customerId: 'c-1',
    createdAt: '2026-05-23'
  },
  {
    id: 't-4',
    title: 'Follow up on Apex Logistics response',
    description: 'Verify if they received the initial catalog brochure.',
    dueDate: '2026-05-29',
    priority: 'low',
    status: 'pending',
    assignedTo: 'u-3',
    leadId: 'l-3',
    createdAt: '2026-05-25'
  }
];

const DEFAULT_ACTIVITIES: Activity[] = [
  {
    id: 'a-1',
    type: 'convert',
    contentEn: 'Lead AlphaTech Industries converted to Customer.',
    contentHe: 'הליד AlphaTech Industries הומר ללקוח פעיל.',
    customerId: 'c-1',
    createdBy: 'u-1',
    createdAt: '2026-05-25T14:32:00Z'
  },
  {
    id: 'a-2',
    type: 'note',
    contentEn: 'Added note: Requested custom hosting deployment on AWS Israel region.',
    contentHe: 'נוספה הערה: ביקשו פריסת אירוח מותאמת באזור AWS ישראל.',
    leadId: 'l-2',
    createdBy: 'u-1',
    createdAt: '2026-05-25T11:15:00Z'
  },
  {
    id: 'a-3',
    type: 'status_change',
    contentEn: 'Stage updated to "Negotiation" from "Contacted".',
    contentHe: 'שלב המכירה עודכן מ-"נוצר קשר" ל-"משא ומתן".',
    leadId: 'l-2',
    createdBy: 'u-1',
    createdAt: '2026-05-25T09:40:00Z'
  },
  {
    id: 'a-4',
    type: 'call',
    contentEn: 'Initial phone call: Very interested in dashboard reporting module.',
    contentHe: 'שיחת טלפון ראשונית: התעניינו מאוד במודול הדיווח של לוח הבקרה.',
    leadId: 'l-4',
    createdBy: 'u-2',
    createdAt: '2026-05-24T16:20:00Z'
  }
];

const DEFAULT_NOTES: Note[] = [
  {
    id: 'n-1',
    content: 'Client prefers communications over email first, then WhatsApp for quick clarifications.',
    leadId: 'l-1',
    createdBy: 'u-2',
    createdAt: '2026-05-20T10:00:00Z'
  },
  {
    id: 'n-2',
    content: 'Requested custom hosting deployment on AWS Israel region. Tech team needs to review pricing differences.',
    leadId: 'l-2',
    createdBy: 'u-1',
    createdAt: '2026-05-25T11:15:00Z'
  }
];

const DEFAULT_ATTACHMENTS: Attachment[] = [
  {
    id: 'att-1',
    fileName: 'security_requirements.pdf',
    fileUrl: '#',
    fileSize: '1.2 MB',
    leadId: 'l-2',
    createdAt: '2026-05-25T11:16:00Z'
  }
];

// --- STORAGE KEY UTILS ---
const STORAGE_KEY = 'nexora_crm_state';

const loadSavedState = () => {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    console.error('Failed to load localStorage state', e);
    return null;
  }
};

const saveState = (state: Partial<CRMState>) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      currentUser: state.currentUser,
      users: state.users,
      isAuthenticated: state.isAuthenticated,
      language: state.language,
      theme: state.theme,
      pipelineStatuses: state.pipelineStatuses,
      leads: state.leads,
      customers: state.customers,
      tasks: state.tasks,
      activities: state.activities,
      notes: state.notes,
      attachments: state.attachments
    }));
  } catch (e) {
    console.error('Failed to save state to localStorage', e);
  }
};

// --- STORE CREATION ---

export const useCRMStore = create<CRMState>((set, get) => {
  // Load initial state
  const defaultState = {
    currentUser: DEFAULT_USERS[0],
    users: DEFAULT_USERS,
    isAuthenticated: true,
    language: 'en' as 'en' | 'he',
    theme: 'light' as 'light' | 'dark',
    searchQuery: '',
    pipelineStatuses: DEFAULT_STATUSES,
    leads: DEFAULT_LEADS,
    customers: DEFAULT_CUSTOMERS,
    tasks: DEFAULT_TASKS,
    activities: DEFAULT_ACTIVITIES,
    notes: DEFAULT_NOTES,
    attachments: DEFAULT_ATTACHMENTS,
    toasts: []
  };

  const savedState = loadSavedState();
  const initialState = savedState ? { ...defaultState, ...savedState, language: 'en' as const } : defaultState;

  return {
    ...initialState,

    // App configurations
    setLanguage: (lang) => {
      set({ language: lang });
      saveState(get());
    },
    setTheme: (theme) => {
      set({ theme });
      saveState(get());
    },
    setSearchQuery: (query) => {
      set({ searchQuery: query });
    },

    // Toast Actions
    addToast: (message, type = 'success') => {
      const id = `tst-${Date.now()}`;
      set(state => ({ toasts: [...state.toasts, { id, type, message }] }));
    },
    removeToast: (id) => {
      set(state => ({ toasts: state.toasts.filter(t => t.id !== id) }));
    },

    // --- SUPABASE SYNC ACTION ---
    fetchData: async () => {
      if (!isSupabaseConfigured || !supabase) return;
      try {
        const [
          { data: uData, error: uErr },
          { data: psData, error: psErr },
          { data: lData, error: lErr },
          { data: cData, error: cErr },
          { data: tData, error: tErr },
          { data: actData, error: actErr },
          { data: nData, error: nErr },
          { data: attData, error: attErr }
        ] = await Promise.all([
          supabase.from('users').select('*'),
          supabase.from('pipeline_statuses').select('*').order('order_index'),
          supabase.from('leads').select('*').order('created_at', { ascending: false }),
          supabase.from('customers').select('*').order('created_at', { ascending: false }),
          supabase.from('tasks').select('*').order('due_date'),
          supabase.from('activities').select('*').order('created_at', { ascending: false }),
          supabase.from('notes').select('*').order('created_at', { ascending: false }),
          supabase.from('attachments').select('*').order('created_at', { ascending: false })
        ]);

        if (uErr || psErr || lErr || cErr || tErr || actErr || nErr || attErr) {
          throw new Error('Supabase request failed');
        }

        set({
          users: (uData || []).map(u => ({ id: u.id, email: u.email, fullName: u.full_name, role: u.role, avatarUrl: u.avatar_url })),
          pipelineStatuses: (psData || []).map(s => ({ id: s.id, nameEn: s.name_en, nameHe: s.name_he, color: s.color, orderIndex: s.order_index })),
          leads: (lData || []).map(l => ({
            id: l.id,
            companyName: l.company_name,
            contactName: l.contact_name,
            email: l.email,
            phone: l.phone || '',
            country: l.country || '',
            industry: l.industry || '',
            leadSource: l.lead_source || '',
            dealValue: Number(l.deal_value),
            assignedOwnerId: l.assigned_owner_id || '',
            notesCount: 0,
            statusId: l.status_id,
            tags: l.tags || [],
            lastActivityDate: l.last_activity_date ? l.last_activity_date.split('T')[0] : '',
            createdAt: l.created_at ? l.created_at.split('T')[0] : ''
          })),
          customers: (cData || []).map(c => ({
            id: c.id,
            leadId: c.lead_id || '',
            companyName: c.company_name,
            contactName: c.contact_name,
            email: c.email,
            phone: c.phone || '',
            country: c.country || '',
            industry: c.industry || '',
            dealValue: Number(c.deal_value),
            createdAt: c.created_at ? c.created_at.split('T')[0] : ''
          })),
          tasks: (tData || []).map(t => ({
            id: t.id,
            title: t.title,
            description: t.description || '',
            dueDate: t.due_date,
            priority: t.priority as any,
            status: t.status as any,
            assignedTo: t.assigned_to || '',
            leadId: t.lead_id || undefined,
            customerId: t.customer_id || undefined,
            createdAt: t.created_at
          })),
          activities: (actData || []).map(a => ({
            id: a.id,
            type: a.type as any,
            contentEn: a.content_en,
            contentHe: a.content_he,
            leadId: a.lead_id || undefined,
            customerId: a.customer_id || undefined,
            createdBy: a.created_by || '',
            createdAt: a.created_at
          })),
          notes: (nData || []).map(n => ({
            id: n.id,
            content: n.content,
            leadId: n.lead_id || undefined,
            customerId: n.customer_id || undefined,
            createdBy: n.created_by || '',
            createdAt: n.created_at
          })),
          attachments: (attData || []).map(att => ({
            id: att.id,
            fileName: att.file_name,
            fileUrl: att.file_url,
            fileSize: att.file_size,
            leadId: att.lead_id || undefined,
            customerId: att.customer_id || undefined,
            createdAt: att.created_at
          }))
        });
      } catch (e) {
        console.error('Supabase Sync error:', e);
      }
    },

    // Auth actions
    login: (email, fullName, role) => {
      const match = get().users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (match) {
        set({ currentUser: match, isAuthenticated: true });
        saveState(get());
        return true;
      }
      
      const newUser: User = {
        id: `u-${Date.now()}`,
        email,
        fullName,
        role
      };
      set(state => ({
        users: [...state.users, newUser],
        currentUser: newUser,
        isAuthenticated: true
      }));
      saveState(get());
      return true;
    },
    register: (email, fullName, role) => {
      const exists = get().users.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (exists) return false;

      const newUser: User = {
        id: `u-${Date.now()}`,
        email,
        fullName,
        role
      };
      set(state => ({
        users: [...state.users, newUser],
        currentUser: newUser,
        isAuthenticated: true
      }));
      saveState(get());
      return true;
    },
    logout: () => {
      set({ currentUser: null, isAuthenticated: false });
      saveState(get());
    },

    // Lead Actions
    addLead: async (lead) => {
      const tempId = `l-${Date.now()}`;
      const newLead: Lead = {
        ...lead,
        id: tempId,
        notesCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        lastActivityDate: new Date().toISOString().split('T')[0]
      };
      
      const activity: Activity = {
        id: `a-${Date.now()}`,
        type: 'status_change',
        contentEn: `Lead created for ${lead.companyName}.`,
        contentHe: `נוצר ליד חדש עבור חברת ${lead.companyName}.`,
        leadId: tempId,
        createdBy: get().currentUser?.id || 'u-1',
        createdAt: new Date().toISOString()
      };

      set(state => ({
        leads: [newLead, ...state.leads],
        activities: [activity, ...state.activities]
      }));
      saveState(get());

      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase.from('leads').insert({
            company_name: lead.companyName,
            contact_name: lead.contactName,
            email: lead.email,
            phone: lead.phone,
            country: lead.country,
            industry: lead.industry,
            lead_source: lead.leadSource,
            deal_value: Number(lead.dealValue),
            assigned_owner_id: lead.assignedOwnerId === 'u-1' ? null : lead.assignedOwnerId,
            status_id: lead.statusId
          }).select().single();

          if (error) throw error;
          if (data) {
            // Update local ID to match Supabase UUID
            set(state => ({
              leads: state.leads.map(l => l.id === tempId ? { ...l, id: data.id } : l),
              activities: state.activities.map(a => a.leadId === tempId ? { ...a, leadId: data.id } : a)
            }));
            
            // Sync activity to DB
            await supabase.from('activities').insert({
              type: 'status_change',
              content_en: `Lead created for ${lead.companyName}.`,
              content_he: `נוצר ליד חדש עבור חברת ${lead.companyName}.`,
              lead_id: data.id
            });
          }
        } catch (e) {
          console.error('Supabase write error', e);
        }
      }
    },
    updateLead: async (id, updates) => {
      const originalLead = get().leads.find(l => l.id === id);
      if (!originalLead) return;

      const updatedLead = { ...originalLead, ...updates };

      const activityList = [...get().activities];
      let dbActivity: any = null;
      
      if (updates.statusId && updates.statusId !== originalLead.statusId) {
        const fromStatus = get().pipelineStatuses.find(s => s.id === originalLead.statusId);
        const toStatus = get().pipelineStatuses.find(s => s.id === updates.statusId);
        if (fromStatus && toStatus) {
          const contentEn = `Stage updated to "${toStatus.nameEn}" from "${fromStatus.nameEn}".`;
          const contentHe = `שלב המכירה עודכן מ-"${fromStatus.nameHe}" ל-"${toStatus.nameHe}".`;
          
          activityList.unshift({
            id: `a-${Date.now()}`,
            type: 'status_change',
            contentEn,
            contentHe,
            leadId: id,
            createdBy: get().currentUser?.id || 'u-1',
            createdAt: new Date().toISOString()
          });

          dbActivity = {
            type: 'status_change',
            content_en: contentEn,
            content_he: contentHe,
            lead_id: id
          };
        }
      }

      set(state => ({
        leads: state.leads.map(l => l.id === id ? updatedLead : l),
        activities: activityList
      }));
      saveState(get());

      if (isSupabaseConfigured && supabase) {
        try {
          const payload: any = {};
          if (updates.companyName) payload.company_name = updates.companyName;
          if (updates.contactName) payload.contact_name = updates.contactName;
          if (updates.email) payload.email = updates.email;
          if (updates.phone !== undefined) payload.phone = updates.phone;
          if (updates.country !== undefined) payload.country = updates.country;
          if (updates.industry !== undefined) payload.industry = updates.industry;
          if (updates.leadSource !== undefined) payload.lead_source = updates.leadSource;
          if (updates.dealValue !== undefined) payload.deal_value = Number(updates.dealValue);
          if (updates.assignedOwnerId !== undefined) payload.assigned_owner_id = updates.assignedOwnerId;
          if (updates.statusId !== undefined) payload.status_id = updates.statusId;
          if (updates.tags !== undefined) payload.tags = updates.tags;

          const { error } = await supabase.from('leads').update(payload).eq('id', id);
          if (error) throw error;

          if (dbActivity) {
            await supabase.from('activities').insert(dbActivity);
          }
        } catch (e) {
          console.error('Supabase update error', e);
        }
      }
    },
    deleteLead: async (id) => {
      set(state => ({
        leads: state.leads.filter(l => l.id !== id),
        activities: state.activities.filter(a => a.leadId !== id),
        tasks: state.tasks.filter(t => t.leadId !== id),
        notes: state.notes.filter(n => n.leadId !== id),
        attachments: state.attachments.filter(att => att.leadId !== id)
      }));
      saveState(get());

      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from('leads').delete().eq('id', id);
        } catch (e) {
          console.error('Supabase delete error', e);
        }
      }
    },
    convertToCustomer: async (leadId) => {
      const lead = get().leads.find(l => l.id === leadId);
      if (!lead) return;

      const tempCustId = `c-${Date.now()}`;
      const newCustomer: Customer = {
        id: tempCustId,
        leadId: lead.id,
        companyName: lead.companyName,
        contactName: lead.contactName,
        email: lead.email,
        phone: lead.phone,
        country: lead.country,
        industry: lead.industry,
        dealValue: lead.dealValue,
        createdAt: new Date().toISOString().split('T')[0]
      };

      const activity: Activity = {
        id: `a-${Date.now()}`,
        type: 'convert',
        contentEn: `Lead ${lead.companyName} converted to Active Customer.`,
        contentHe: `הליד ${lead.companyName} הומר ללקוח פעיל בהצלחה.`,
        customerId: tempCustId,
        createdBy: get().currentUser?.id || 'u-1',
        createdAt: new Date().toISOString()
      };

      const wonStatus = get().pipelineStatuses.find(s => s.nameEn.toLowerCase() === 'closed won' || s.nameHe === 'עסקה נסגרה בהצלחה');

      set(state => ({
        customers: [newCustomer, ...state.customers],
        leads: state.leads.map(l => l.id === leadId ? { ...l, statusId: wonStatus?.id || l.statusId } : l),
        activities: [activity, ...state.activities]
      }));
      saveState(get());

      if (isSupabaseConfigured && supabase) {
        try {
          // Insert customer to db
          const { data: custData, error: custErr } = await supabase.from('customers').insert({
            lead_id: lead.id,
            company_name: lead.companyName,
            contact_name: lead.contactName,
            email: lead.email,
            phone: lead.phone,
            country: lead.country,
            industry: lead.industry,
            deal_value: Number(lead.dealValue)
          }).select().single();

          if (custErr) throw custErr;
          if (custData) {
            set(state => ({
              customers: state.customers.map(c => c.id === tempCustId ? { ...c, id: custData.id } : c),
              activities: state.activities.map(a => a.customerId === tempCustId ? { ...a, customerId: custData.id } : a)
            }));

            // Sync won status on lead in db
            if (wonStatus) {
              await supabase.from('leads').update({ status_id: wonStatus.id }).eq('id', leadId);
            }

            // Sync activity to db
            await supabase.from('activities').insert({
              type: 'convert',
              content_en: `Lead ${lead.companyName} converted to Active Customer.`,
              content_he: `הליד ${lead.companyName} הומר ללקוח פעיל בהצלחה.`,
              customer_id: custData.id
            });
          }
        } catch (e) {
          console.error('Supabase convert error', e);
        }
      }
    },

    // Pipeline Status Actions
    addStatus: async (status) => {
      const tempId = `s-${Date.now()}`;
      const newStatus: PipelineStatus = {
        ...status,
        id: tempId
      };
      set(state => ({
        pipelineStatuses: [...state.pipelineStatuses, newStatus]
      }));
      saveState(get());

      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase.from('pipeline_statuses').insert({
            name_en: status.nameEn,
            name_he: status.nameHe,
            color: status.color,
            order_index: status.orderIndex
          }).select().single();

          if (error) throw error;
          if (data) {
            set(state => ({
              pipelineStatuses: state.pipelineStatuses.map(s => s.id === tempId ? { ...s, id: data.id } : s)
            }));
          }
        } catch (e) {
          console.error('Supabase addStatus error', e);
        }
      }
    },
    updateStatusesOrder: async (statuses) => {
      set({ pipelineStatuses: statuses });
      saveState(get());

      if (isSupabaseConfigured && supabase) {
        const client = supabase;
        try {
          // Perform bulk updates in DB
          await Promise.all(statuses.map(s => 
            client.from('pipeline_statuses').update({ order_index: s.orderIndex }).eq('id', s.id)
          ));
        } catch (e) {
          console.error('Supabase updateStatusesOrder error', e);
        }
      }
    },
    deleteStatus: async (id) => {
      if (get().pipelineStatuses.length <= 1) return;
      
      const fallbackStatus = get().pipelineStatuses.find(s => s.id !== id);
      const fallbackStatusId = fallbackStatus?.id || '';

      set(state => ({
        pipelineStatuses: state.pipelineStatuses.filter(s => s.id !== id),
        leads: state.leads.map(l => l.statusId === id ? { ...l, statusId: fallbackStatusId } : l)
      }));
      saveState(get());

      if (isSupabaseConfigured && supabase) {
        try {
          // Re-assign leads of this status in db first
          await supabase.from('leads').update({ status_id: fallbackStatusId }).eq('status_id', id);
          // Delete status in db
          await supabase.from('pipeline_statuses').delete().eq('id', id);
        } catch (e) {
          console.error('Supabase deleteStatus error', e);
        }
      }
    },

    // Customer Actions
    updateCustomer: async (id, updates) => {
      set(state => ({
        customers: state.customers.map(c => c.id === id ? { ...c, ...updates } : c)
      }));
      saveState(get());

      if (isSupabaseConfigured && supabase) {
        try {
          const payload: any = {};
          if (updates.companyName) payload.company_name = updates.companyName;
          if (updates.contactName) payload.contact_name = updates.contactName;
          if (updates.email) payload.email = updates.email;
          if (updates.phone !== undefined) payload.phone = updates.phone;
          if (updates.country !== undefined) payload.country = updates.country;
          if (updates.industry !== undefined) payload.industry = updates.industry;
          if (updates.dealValue !== undefined) payload.deal_value = Number(updates.dealValue);

          await supabase.from('customers').update(payload).eq('id', id);
        } catch (e) {
          console.error('Supabase updateCustomer error', e);
        }
      }
    },
    deleteCustomer: async (id) => {
      set(state => ({
        customers: state.customers.filter(c => c.id !== id),
        activities: state.activities.filter(a => a.customerId !== id),
        tasks: state.tasks.filter(t => t.customerId !== id),
        notes: state.notes.filter(n => n.customerId !== id),
        attachments: state.attachments.filter(att => att.customerId !== id)
      }));
      saveState(get());

      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from('customers').delete().eq('id', id);
        } catch (e) {
          console.error('Supabase deleteCustomer error', e);
        }
      }
    },

    // Task Actions
    addTask: async (task) => {
      const tempId = `t-${Date.now()}`;
      const newTask: Task = {
        ...task,
        id: tempId,
        createdAt: new Date().toISOString()
      };
      
      const activity: Activity = {
        id: `a-${Date.now()}`,
        type: 'meeting',
        contentEn: `New task assigned: "${task.title}".`,
        contentHe: `משימה חדשה הוקצתה: "${task.title}".`,
        leadId: task.leadId,
        customerId: task.customerId,
        createdBy: get().currentUser?.id || 'u-1',
        createdAt: new Date().toISOString()
      };

      set(state => ({
        tasks: [newTask, ...state.tasks],
        activities: [activity, ...state.activities]
      }));
      saveState(get());

      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase.from('tasks').insert({
            title: task.title,
            description: task.description || '',
            due_date: task.dueDate,
            priority: task.priority,
            status: task.status,
            assigned_to: task.assignedTo === 'u-1' ? null : task.assignedTo,
            lead_id: task.leadId || null,
            customer_id: task.customerId || null
          }).select().single();

          if (error) throw error;
          if (data) {
            set(state => ({
              tasks: state.tasks.map(t => t.id === tempId ? { ...t, id: data.id } : t),
              activities: state.activities.map(a => a.createdAt === activity.createdAt ? { ...a, leadId: task.leadId, customerId: task.customerId } : a)
            }));

            await supabase.from('activities').insert({
              type: 'meeting',
              content_en: `New task assigned: "${task.title}".`,
              content_he: `משימה חדשה הוקצתה: "${task.title}".`,
              lead_id: task.leadId || null,
              customer_id: task.customerId || null
            });
          }
        } catch (e) {
          console.error('Supabase addTask error', e);
        }
      }
    },
    toggleTaskStatus: async (id) => {
      const task = get().tasks.find(t => t.id === id);
      if (!task) return;
      
      const nextStatus = task.status === 'completed' ? 'pending' : 'completed';

      set(state => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, status: nextStatus } : t)
      }));
      saveState(get());

      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from('tasks').update({ status: nextStatus }).eq('id', id);
        } catch (e) {
          console.error('Supabase toggleTaskStatus error', e);
        }
      }
    },
    deleteTask: async (id) => {
      set(state => ({
        tasks: state.tasks.filter(t => t.id !== id)
      }));
      saveState(get());

      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from('tasks').delete().eq('id', id);
        } catch (e) {
          console.error('Supabase deleteTask error', e);
        }
      }
    },

    // Note Actions
    addNote: async (note) => {
      const tempId = `n-${Date.now()}`;
      const newNote: Note = {
        ...note,
        id: tempId,
        createdAt: new Date().toISOString()
      };

      const activity: Activity = {
        id: `a-${Date.now()}`,
        type: 'note',
        contentEn: `Added note: "${note.content.substring(0, 40)}..."`,
        contentHe: `נוספה הערה: "${note.content.substring(0, 40)}..."`,
        leadId: note.leadId,
        customerId: note.customerId,
        createdBy: note.createdBy,
        createdAt: new Date().toISOString()
      };

      const leadId = note.leadId;
      const leadsUpdated = leadId
        ? get().leads.map(l => l.id === leadId ? { ...l, notesCount: l.notesCount + 1 } : l)
        : get().leads;

      set(state => ({
        notes: [newNote, ...state.notes],
        leads: leadsUpdated,
        activities: [activity, ...state.activities]
      }));
      saveState(get());

      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase.from('notes').insert({
            content: note.content,
            lead_id: note.leadId || null,
            customer_id: note.customerId || null,
            created_by: note.createdBy === 'u-1' ? null : note.createdBy
          }).select().single();

          if (error) throw error;
          if (data) {
            set(state => ({
              notes: state.notes.map(n => n.id === tempId ? { ...n, id: data.id } : n)
            }));

            await supabase.from('activities').insert({
              type: 'note',
              content_en: `Added note: "${note.content.substring(0, 40)}..."`,
              content_he: `נוספה הערה: "${note.content.substring(0, 40)}..."`,
              lead_id: note.leadId || null,
              customer_id: note.customerId || null
            });
          }
        } catch (e) {
          console.error('Supabase addNote error', e);
        }
      }
    },
    deleteNote: async (id) => {
      const note = get().notes.find(n => n.id === id);
      const leadId = note?.leadId;
      const leadsUpdated = leadId
        ? get().leads.map(l => l.id === leadId ? { ...l, notesCount: Math.max(0, l.notesCount - 1) } : l)
        : get().leads;

      set(state => ({
        notes: state.notes.filter(n => n.id !== id),
        leads: leadsUpdated
      }));
      saveState(get());

      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from('notes').delete().eq('id', id);
        } catch (e) {
          console.error('Supabase deleteNote error', e);
        }
      }
    },

    // Attachment Actions
    addAttachment: async (attachment) => {
      const tempId = `att-${Date.now()}`;
      const newAttachment: Attachment = {
        ...attachment,
        id: tempId,
        createdAt: new Date().toISOString()
      };

      const activity: Activity = {
        id: `a-${Date.now()}`,
        type: 'file_upload',
        contentEn: `Uploaded file: ${attachment.fileName}`,
        contentHe: `הועלה קובץ חדש: ${attachment.fileName}`,
        leadId: attachment.leadId,
        customerId: attachment.customerId,
        createdBy: get().currentUser?.id || 'u-1',
        createdAt: new Date().toISOString()
      };

      set(state => ({
        attachments: [newAttachment, ...state.attachments],
        activities: [activity, ...state.activities]
      }));
      saveState(get());

      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase.from('attachments').insert({
            file_name: attachment.fileName,
            file_url: attachment.fileUrl,
            file_size: attachment.fileSize,
            lead_id: attachment.leadId || null,
            customer_id: attachment.customerId || null
          }).select().single();

          if (error) throw error;
          if (data) {
            set(state => ({
              attachments: state.attachments.map(att => att.id === tempId ? { ...att, id: data.id } : att)
            }));

            await supabase.from('activities').insert({
              type: 'file_upload',
              content_en: `Uploaded file: ${attachment.fileName}`,
              content_he: `הועלה קובץ חדש: ${attachment.fileName}`,
              lead_id: attachment.leadId || null,
              customer_id: attachment.customerId || null
            });
          }
        } catch (e) {
          console.error('Supabase addAttachment error', e);
        }
      }
    },
    deleteAttachment: async (id) => {
      set(state => ({
        attachments: state.attachments.filter(att => att.id !== id)
      }));
      saveState(get());

      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from('attachments').delete().eq('id', id);
        } catch (e) {
          console.error('Supabase deleteAttachment error', e);
        }
      }
    },

    // Reset Data Helper
    resetToMockData: () => {
      set({
        currentUser: DEFAULT_USERS[0],
        users: DEFAULT_USERS,
        isAuthenticated: true,
        pipelineStatuses: DEFAULT_STATUSES,
        leads: DEFAULT_LEADS,
        customers: DEFAULT_CUSTOMERS,
        tasks: DEFAULT_TASKS,
        activities: DEFAULT_ACTIVITIES,
        notes: DEFAULT_NOTES,
        attachments: DEFAULT_ATTACHMENTS
      });
      saveState(get());
    }
  };
});
