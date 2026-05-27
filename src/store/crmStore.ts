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
  login: (email: string, password?: string) => Promise<boolean>;
  register: (email: string, password?: string, fullName?: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  updateUserRole: (id: string, role: UserRole) => Promise<void>;
  
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
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
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
  { id: 's-1', nameEn: 'Inquiry Received', nameHe: 'פנייה / בירור', color: '#2563EB', orderIndex: 0 },
  { id: 's-2', nameEn: 'Quotation Offered', nameHe: 'הצעת מחיר', color: '#8B5CF6', orderIndex: 1 },
  { id: 's-3', nameEn: 'Booking Confirmed', nameHe: 'אישור בוקינג', color: '#F59E0B', orderIndex: 2 },
  { id: 's-4', nameEn: 'Customs & Docs', nameHe: 'מכס ומסמכים', color: '#06B6D4', orderIndex: 3 },
  { id: 's-5', nameEn: 'In Transit', nameHe: 'בדרך / שילוח פעיל', color: '#3B82F6', orderIndex: 4 },
  { id: 's-6', nameEn: 'Delivered', nameHe: 'נמסר ליעד', color: '#10B981', orderIndex: 5 },
  { id: 's-7', nameEn: 'Cancelled', nameHe: 'בוטל', color: '#EF4444', orderIndex: 6 }
];

const DEFAULT_LEADS: Lead[] = [
  {
    id: 'l-1',
    companyName: 'Global Importers Inc',
    contactName: 'John Doe',
    email: 'john@globalimp.com',
    phone: '+1-555-0199',
    country: 'Haifa Port (Israel)',
    industry: 'Sea Freight (FCL)',
    leadSource: 'Shanghai Port',
    dealValue: 4800,
    assignedOwnerId: 'u-2',
    notesCount: 2,
    statusId: 's-1',
    tags: ['Electronics', 'Urgent'],
    lastActivityDate: '2026-05-26',
    createdAt: '2026-05-20'
  },
  {
    id: 'l-2',
    companyName: 'Israel Agri-Export',
    contactName: 'Idan Cohen',
    email: 'idan@israelagri.co.il',
    phone: '+972-52-1234567',
    country: 'Rotterdam (Netherlands)',
    industry: 'Sea Freight (FCL)',
    leadSource: 'Ashdod Port',
    dealValue: 6200,
    assignedOwnerId: 'u-1',
    notesCount: 1,
    statusId: 's-3',
    tags: ['Reefer', 'Fruits'],
    lastActivityDate: '2026-05-25',
    createdAt: '2026-05-18'
  },
  {
    id: 'l-3',
    companyName: 'Apex Fashion Group',
    contactName: 'Emma Watson',
    email: 'emma@apexfashion.com',
    phone: '+44-20-7946-0958',
    country: 'Ben Gurion Airport (Israel)',
    industry: 'Air Freight',
    leadSource: 'London Heathrow',
    dealValue: 12500,
    assignedOwnerId: 'u-3',
    notesCount: 0,
    statusId: 's-2',
    tags: ['Apparel', 'Express'],
    lastActivityDate: '2026-05-24',
    createdAt: '2026-05-22'
  },
  {
    id: 'l-4',
    companyName: 'MedTech Equipment',
    contactName: 'Noam Levy',
    email: 'noam@medtech.co.il',
    phone: '+972-54-7654321',
    country: 'Haifa Port (Israel)',
    industry: 'Sea Freight (LCL)',
    leadSource: 'Hamburg Port',
    dealValue: 3100,
    assignedOwnerId: 'u-2',
    notesCount: 3,
    statusId: 's-4',
    tags: ['Medical', 'Fragile'],
    lastActivityDate: '2026-05-27',
    createdAt: '2026-05-15'
  },
  {
    id: 'l-5',
    companyName: 'Prime Chemical Distrib',
    contactName: 'Robert Johnson',
    email: 'robert@primechem.com',
    phone: '+1-555-0144',
    country: 'Ashdod Port (Israel)',
    industry: 'Sea Freight (FCL)',
    leadSource: 'Port of Houston',
    dealValue: 15400,
    assignedOwnerId: 'u-1',
    notesCount: 1,
    statusId: 's-3',
    tags: ['Chemicals', 'Hazmat'],
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

const isUUID = (val?: string | null): boolean => {
  if (!val) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(val);
};

const migrateUserReferences = async (supabase: any, oldId: string, newId: string) => {
  try {
    await supabase.from('leads').update({ assigned_owner_id: newId }).eq('assigned_owner_id', oldId);
    await supabase.from('tasks').update({ assigned_to: newId }).eq('assigned_to', oldId);
    await supabase.from('notes').update({ created_by: newId }).eq('created_by', oldId);
    await supabase.from('activities').update({ created_by: newId }).eq('created_by', oldId);
  } catch (e) {
    console.error('Failed to migrate user references:', e);
  }
};

export const useCRMStore = create<CRMState>((set, get) => {
  // Load initial state
  const defaultState = {
    currentUser: null,
    users: isSupabaseConfigured ? [] : DEFAULT_USERS,
    isAuthenticated: false,
    language: 'en' as 'en' | 'he',
    theme: 'light' as 'light' | 'dark',
    searchQuery: '',
    pipelineStatuses: isSupabaseConfigured ? [] : DEFAULT_STATUSES,
    leads: isSupabaseConfigured ? [] : DEFAULT_LEADS,
    customers: isSupabaseConfigured ? [] : DEFAULT_CUSTOMERS,
    tasks: isSupabaseConfigured ? [] : DEFAULT_TASKS,
    activities: isSupabaseConfigured ? [] : DEFAULT_ACTIVITIES,
    notes: isSupabaseConfigured ? [] : DEFAULT_NOTES,
    attachments: isSupabaseConfigured ? [] : DEFAULT_ATTACHMENTS,
    toasts: []
  };

  const savedState = loadSavedState();

  // If Supabase is configured, check if savedState contains mock data and clear it to prevent mock users showing up
  if (isSupabaseConfigured && savedState) {
    const hasMockData = savedState.users?.some((u: any) => u.id && !isUUID(u.id));
    if (hasMockData) {
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }

  const initialState = savedState ? { ...defaultState, ...savedState, language: 'en' as const } : defaultState;

  if (isSupabaseConfigured) {
    initialState.users = [];
    initialState.pipelineStatuses = [];
    initialState.leads = [];
    initialState.customers = [];
    initialState.tasks = [];
    initialState.activities = [];
    initialState.notes = [];
    initialState.attachments = [];
  }

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

        let finalStatuses = (psData || []).map(s => ({ id: s.id, nameEn: s.name_en, nameHe: s.name_he, color: s.color, orderIndex: s.order_index }));

        if (finalStatuses.length === 0) {
          try {
            const { data: seeded, error: seedErr } = await supabase
              .from('pipeline_statuses')
              .insert(DEFAULT_STATUSES.map(s => ({
                id: s.id,
                name_en: s.nameEn,
                name_he: s.nameHe,
                color: s.color,
                order_index: s.orderIndex
              })))
              .select();

            if (!seedErr && seeded) {
              finalStatuses = seeded.map(s => ({ id: s.id, nameEn: s.name_en, nameHe: s.name_he, color: s.color, orderIndex: s.order_index }));
            }
          } catch (seedError) {
            console.error('Auto-seeding pipeline statuses failed:', seedError);
          }
        }

        set({
          users: (uData || []).map(u => ({ id: u.id, email: u.email, fullName: u.full_name, role: u.role, avatarUrl: u.avatar_url })),
          pipelineStatuses: finalStatuses,
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
            notesCount: (nData || []).filter(n => n.lead_id === l.id).length,
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
    login: async (email, password = '') => {
      if (isSupabaseConfigured && supabase) {
        try {
          // 1. Sign in via Supabase Auth
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: email.toLowerCase(),
            password: password
          });

          if (authError) throw authError;

          if (authData.user) {
            // 2. Fetch profile from public.users table by Auth ID
            const { data: profile, error: profileError } = await supabase
              .from('users')
              .select('*')
              .eq('id', authData.user.id)
              .maybeSingle();

            if (profileError) throw profileError;

            let mappedUser: User;

            if (profile) {
              mappedUser = {
                id: profile.id,
                email: profile.email,
                fullName: profile.full_name,
                role: profile.role as UserRole,
                avatarUrl: profile.avatar_url || undefined
              };
            } else {
              // Check if a profile with the same email already exists (e.g., from old mock register)
              const { data: existingEmailProfile } = await supabase
                .from('users')
                .select('*')
                .eq('email', email.toLowerCase())
                .maybeSingle();

              if (existingEmailProfile) {
                // Migrate foreign key references first to prevent constraint violations
                await migrateUserReferences(supabase, existingEmailProfile.id, authData.user.id);

                // Migrate the old profile ID to match the new Auth ID
                const { data: updatedProfile, error: updateError } = await supabase
                  .from('users')
                  .update({ id: authData.user.id })
                  .eq('id', existingEmailProfile.id)
                  .select()
                  .single();

                if (!updateError && updatedProfile) {
                  mappedUser = {
                    id: updatedProfile.id,
                    email: updatedProfile.email,
                    fullName: updatedProfile.full_name,
                    role: updatedProfile.role as UserRole,
                    avatarUrl: updatedProfile.avatar_url || undefined
                  };
                } else {
                  console.error('Failed to link old profile ID, creating new fallback:', updateError);
                  throw updateError || new Error('Update failed');
                }
              } else {
                // Auto-profile sync: If profile is completely missing, create it!
                const defaultName = authData.user.user_metadata?.full_name || email.split('@')[0];
                const { data: newProfile, error: insertError } = await supabase
                  .from('users')
                  .insert({
                    id: authData.user.id,
                    email: email.toLowerCase(),
                    full_name: defaultName,
                    role: 'admin'
                  })
                  .select()
                  .single();

                if (insertError) {
                  console.error('Failed to auto-create public user profile:', insertError);
                  // Fallback to minimal user structure
                  mappedUser = {
                    id: authData.user.id,
                    email: authData.user.email || email,
                    fullName: defaultName,
                    role: 'admin'
                  };
                } else {
                  mappedUser = {
                    id: newProfile.id,
                    email: newProfile.email,
                    fullName: newProfile.full_name,
                    role: newProfile.role as UserRole,
                    avatarUrl: newProfile.avatar_url || undefined
                  };
                }
              }
            }

            set({ currentUser: mappedUser, isAuthenticated: true });
            saveState(get());
            return true;
          }

          return false;
        } catch (e) {
          console.error('Supabase login error:', e);
          throw e;
        }
      }

      // Local mock fallback
      const match = get().users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (match) {
        set({ currentUser: match, isAuthenticated: true });
        saveState(get());
        return true;
      }
      
      return false;
    },
    register: async (email, password = '', fullName = '', role = 'admin') => {
      if (isSupabaseConfigured && supabase) {
        try {
          // 1. Register with Supabase Auth
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: email.toLowerCase(),
            password: password,
            options: {
              data: {
                full_name: fullName,
                role: role
              }
            }
          });

          if (authError) throw authError;

          if (authData.user) {
            // 2. Insert profile into public.users
            const { data: newUser, error: insertError } = await supabase
              .from('users')
              .insert({
                id: authData.user.id,
                email: email.toLowerCase(),
                full_name: fullName,
                role: role
              })
              .select()
              .single();

            if (insertError) {
              console.error('Error inserting into public.users, checking for old profile:', insertError);
              
              // Check if a profile with the same email already exists (old system migration)
              const { data: existingEmailProfile } = await supabase
                .from('users')
                .select('*')
                .eq('email', email.toLowerCase())
                .maybeSingle();

              if (existingEmailProfile) {
                // Migrate foreign key references first to prevent constraint violations
                await migrateUserReferences(supabase, existingEmailProfile.id, authData.user.id);

                // Migrate the old profile to the new Auth user ID
                const { data: updatedProfile, error: updateError } = await supabase
                  .from('users')
                  .update({
                    id: authData.user.id,
                    full_name: fullName,
                    role: role
                  })
                  .eq('id', existingEmailProfile.id)
                  .select()
                  .single();

                if (!updateError && updatedProfile) {
                  const mappedUser: User = {
                    id: updatedProfile.id,
                    email: updatedProfile.email,
                    fullName: updatedProfile.full_name,
                    role: updatedProfile.role as UserRole,
                    avatarUrl: updatedProfile.avatar_url || undefined
                  };
                  set(state => ({
                    users: [...state.users.filter(u => u.id !== mappedUser.id), mappedUser],
                    currentUser: mappedUser,
                    isAuthenticated: true
                  }));
                  saveState(get());
                  return true;
                }
              }

              // Check if profile was already inserted by a database trigger
              const { data: existingProfile } = await supabase
                .from('users')
                .select('*')
                .eq('id', authData.user.id)
                .maybeSingle();
                
              if (existingProfile) {
                const mappedUser: User = {
                  id: existingProfile.id,
                  email: existingProfile.email,
                  fullName: existingProfile.full_name,
                  role: existingProfile.role as UserRole,
                  avatarUrl: existingProfile.avatar_url || undefined
                };
                set(state => ({
                  users: [...state.users.filter(u => u.id !== mappedUser.id), mappedUser],
                  currentUser: mappedUser,
                  isAuthenticated: true
                }));
                saveState(get());
                return true;
              }
              throw insertError;
            }

            if (newUser) {
              const mappedUser: User = {
                id: newUser.id,
                email: newUser.email,
                fullName: newUser.full_name,
                role: newUser.role as UserRole,
                avatarUrl: newUser.avatar_url || undefined
              };
              set(state => ({
                users: [...state.users, mappedUser],
                currentUser: mappedUser,
                isAuthenticated: true
              }));
              saveState(get());
              return true;
            }
          }
          return false;
        } catch (e) {
          console.error('Supabase register error:', e);
          throw e;
        }
      }

      // Local mock fallback
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
    updateUserRole: async (id, role) => {
      set(state => ({
        users: state.users.map(u => u.id === id ? { ...u, role } : u),
        currentUser: state.currentUser?.id === id ? { ...state.currentUser, role } : state.currentUser
      }));
      saveState(get());

      if (isSupabaseConfigured && supabase) {
        try {
          const { error } = await supabase
            .from('users')
            .update({ role })
            .eq('id', id);
          if (error) throw error;
        } catch (e) {
          console.error('Supabase updateUserRole error:', e);
        }
      }
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
            assigned_owner_id: isUUID(lead.assignedOwnerId) ? lead.assignedOwnerId : null,
            status_id: isUUID(lead.statusId) ? lead.statusId : (get().pipelineStatuses.find(s => isUUID(s.id))?.id || lead.statusId)
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
          if (updates.assignedOwnerId !== undefined) {
            payload.assigned_owner_id = isUUID(updates.assignedOwnerId) ? updates.assignedOwnerId : null;
          }
          if (updates.statusId !== undefined) {
            payload.status_id = isUUID(updates.statusId) ? updates.statusId : (get().pipelineStatuses.find(s => isUUID(s.id))?.id || updates.statusId);
          }
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
            lead_id: isUUID(lead.id) ? lead.id : null,
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
            if (wonStatus && isUUID(leadId)) {
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
            assigned_to: isUUID(task.assignedTo) ? task.assignedTo : null,
            lead_id: isUUID(task.leadId || '') ? task.leadId : null,
            customer_id: isUUID(task.customerId || '') ? task.customerId : null
          }).select().single();

          if (error) throw error;
          if (data) {
            set(state => ({
              tasks: state.tasks.map(t => t.id === tempId ? { ...t, id: data.id } : t),
              activities: state.activities.map(a => a.createdAt === activity.createdAt ? { ...a, leadId: isUUID(task.leadId || '') ? task.leadId : undefined, customerId: isUUID(task.customerId || '') ? task.customerId : undefined } : a)
            }));

            await supabase.from('activities').insert({
              type: 'meeting',
              content_en: `New task assigned: "${task.title}".`,
              content_he: `משימה חדשה הוקצתה: "${task.title}".`,
              lead_id: isUUID(task.leadId || '') ? task.leadId : null,
              customer_id: isUUID(task.customerId || '') ? task.customerId : null
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
    updateTask: async (id, updates) => {
      const task = get().tasks.find(t => t.id === id);
      if (!task) return;

      set(state => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
      }));
      saveState(get());

      if (isSupabaseConfigured && supabase) {
        try {
          const payload: any = {};
          if (updates.title !== undefined) payload.title = updates.title;
          if (updates.description !== undefined) payload.description = updates.description;
          if (updates.dueDate !== undefined) payload.due_date = updates.dueDate;
          if (updates.priority !== undefined) payload.priority = updates.priority;
          if (updates.status !== undefined) payload.status = updates.status;
          if (updates.assignedTo !== undefined) {
            payload.assigned_to = isUUID(updates.assignedTo) ? updates.assignedTo : null;
          }

          await supabase.from('tasks').update(payload).eq('id', id);
        } catch (e) {
          console.error('Supabase updateTask error:', e);
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
            lead_id: isUUID(note.leadId || '') ? note.leadId : null,
            customer_id: isUUID(note.customerId || '') ? note.customerId : null,
            created_by: isUUID(note.createdBy) ? note.createdBy : null
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
              lead_id: isUUID(note.leadId || '') ? note.leadId : null,
              customer_id: isUUID(note.customerId || '') ? note.customerId : null
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
            lead_id: isUUID(attachment.leadId || '') ? attachment.leadId : null,
            customer_id: isUUID(attachment.customerId || '') ? attachment.customerId : null
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
              lead_id: isUUID(attachment.leadId || '') ? attachment.leadId : null,
              customer_id: isUUID(attachment.customerId || '') ? attachment.customerId : null
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
      if (isSupabaseConfigured) {
        set({
          currentUser: get().currentUser,
          users: [],
          isAuthenticated: get().isAuthenticated,
          pipelineStatuses: [],
          leads: [],
          customers: [],
          tasks: [],
          activities: [],
          notes: [],
          attachments: []
        });
        saveState(get());
        get().fetchData();
      } else {
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
    }
  };
});
