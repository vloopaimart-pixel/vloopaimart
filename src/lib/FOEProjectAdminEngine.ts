/**
 * VLOOP FOE PROJECT ADMINISTRATION CENTER
 * Phase 49 — Enterprise Project Management System
 *
 * This module provides the administration architecture for managing Future Opportunity Projects.
 * It does NOT handle payment processing, financial settlement, or winner allocation.
 */

import { supabase } from './supabase';

export const FOE_PROJECT_ADMIN_VERSION = '49.0.0' as const;

// ============================================================
// PROJECT CATEGORIES
// ============================================================

export const PROJECT_CATEGORIES = {
  AFFORDABLE_HOUSING: 'affordable_housing',
  LAND_PROJECTS: 'land_projects',
  VILLA_PROJECTS: 'villa_projects',
  APARTMENT_PROJECTS: 'apartment_projects',
  VEHICLE_PROGRAMS: 'vehicle_programs',
  EV_PROGRAMS: 'ev_programs',
  GOLD_PROGRAMS: 'gold_programs',
  HEALTHCARE_PROGRAMS: 'healthcare_programs',
  EDUCATION_PROGRAMS: 'education_programs',
  COMMUNITY_DEVELOPMENT: 'community_development',
  FUTURE_ENTERPRISE: 'future_enterprise',
} as const;

export type ProjectCategory = typeof PROJECT_CATEGORIES[keyof typeof PROJECT_CATEGORIES];

export const PROJECT_CATEGORY_LABELS: Record<ProjectCategory, string> = {
  affordable_housing: 'Affordable Housing',
  land_projects: 'Land Projects',
  villa_projects: 'Villa Projects',
  apartment_projects: 'Apartment Projects',
  vehicle_programs: 'Vehicle Programs',
  ev_programs: 'EV Programs',
  gold_programs: 'Gold Programs',
  healthcare_programs: 'Healthcare Programs',
  education_programs: 'Education Programs',
  community_development: 'Community Development',
  future_enterprise: 'Future Enterprise',
};

// ============================================================
// PROJECT STATUS
// ============================================================

export const PROJECT_STATUS = {
  DRAFT: 'draft',
  COMING_SOON: 'coming_soon',
  OPEN: 'open',
  ACTIVE: 'active',
  PAUSED: 'paused',
  CLOSED: 'closed',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
} as const;

export type ProjectStatus = typeof PROJECT_STATUS[keyof typeof PROJECT_STATUS];

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  draft: 'Draft',
  coming_soon: 'Coming Soon',
  open: 'Open',
  active: 'Active',
  paused: 'Paused',
  closed: 'Closed',
  completed: 'Completed',
  archived: 'Archived',
};

// ============================================================
// ADMIN ACTIONS
// ============================================================

export const ADMIN_ACTIONS = {
  CREATED: 'created',
  UPDATED: 'updated',
  PUBLISHED: 'published',
  UNPUBLISHED: 'unpublished',
  PAUSED: 'paused',
  RESUMED: 'resumed',
  CLOSED: 'closed',
  ARCHIVED: 'archived',
  RESTORED: 'restored',
  DELETED: 'deleted',
  DUPLICATED: 'duplicated',
  SETTINGS_CHANGED: 'settings_changed',
  STATUS_CHANGED: 'status_changed',
} as const;

export type AdminAction = typeof ADMIN_ACTIONS[keyof typeof ADMIN_ACTIONS];

// ============================================================
// ADMIN ROLES
// ============================================================

export const ADMIN_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ENTERPRISE_ADMIN: 'enterprise_admin',
  REGIONAL_ADMIN: 'regional_admin',
  PROJECT_MANAGER: 'project_manager',
  AUDIT_OFFICER: 'audit_officer',
  SUPPORT_TEAM: 'support_team',
  READ_ONLY_AUDITOR: 'read_only_auditor',
} as const;

export type AdminRoleCode = typeof ADMIN_ROLES[keyof typeof ADMIN_ROLES];

export const ADMIN_ROLE_LABELS: Record<AdminRoleCode, string> = {
  super_admin: 'Super Admin',
  enterprise_admin: 'Enterprise Admin',
  regional_admin: 'Regional Admin',
  project_manager: 'Project Manager',
  audit_officer: 'Audit Officer',
  support_team: 'Support Team',
  read_only_auditor: 'Read-only Auditor',
};

// ============================================================
// INTERFACES
// ============================================================

export interface ProjectTemplate {
  id: string;
  template_code: string;
  template_name: string;
  category: ProjectCategory;
  description: string | null;
  banner_image_url: string | null;
  default_duration_days: number;
  default_target_value: number | null;
  default_min_participation: number;
  default_max_participation: number;
  allowed_unit_types: string[];
  default_visibility: 'public' | 'private' | 'restricted';
  default_countries: string[];
  default_languages: string[];
  settings_template: Record<string, unknown>;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
}

export interface AdminRoleConfig {
  id: string;
  role_code: AdminRoleCode;
  role_name: string;
  description: string | null;
  hierarchy_level: number;
  permissions: Record<string, unknown>;
  can_create_projects: boolean;
  can_edit_projects: boolean;
  can_pause_projects: boolean;
  can_archive_projects: boolean;
  can_manage_templates: boolean;
  can_view_audit: boolean;
  can_export_reports: boolean;
  can_manage_admins: boolean;
  is_active: boolean;
}

export interface ProjectAdminLog {
  id: string;
  project_id: string | null;
  admin_id: string | null;
  action: AdminAction;
  previous_state: Record<string, unknown>;
  new_state: Record<string, unknown>;
  changes: Record<string, unknown>;
  ip_address: string | null;
  audit_notes: string | null;
  created_at: string;
  project_name?: string;
  admin_name?: string;
}

export interface AIMonitoring {
  id: string;
  project_id: string;
  monitoring_date: string;
  participation_count: number;
  participation_delta: number;
  participation_trend: 'increasing' | 'stable' | 'decreasing' | null;
  predicted_participation: number | null;
  predicted_completion_date: string | null;
  growth_rate: number;
  risk_score: number;
  risk_alerts: unknown[];
  fraud_risk_score: number;
  fraud_alerts: unknown[];
  project_health_score: number;
  trust_score_avg: number;
  ai_recommendations: unknown[];
  ai_priority_level: 'low' | 'normal' | 'high' | 'critical';
}

export interface ProjectStatusHistory {
  id: string;
  project_id: string;
  from_status: string | null;
  to_status: string;
  reason: string | null;
  changed_by: string | null;
  changed_at: string;
  notes: string | null;
}

export interface AdminDashboardStats {
  projects: {
    total: number;
    active: number;
    coming_soon: number;
    completed: number;
    closed: number;
  };
  participation: {
    total_participants: number;
    total_units: number;
    total_smartpoints: number;
  };
  progress: {
    avg_progress: number;
    high_progress_count: number;
  };
  transparency: {
    avg_score: number;
    flagged_count: number;
  };
}

export interface AIMonitoringSummary {
  alerts: {
    total_risk_alerts: number;
    total_fraud_alerts: number;
    high_risk_count: number;
    critical_count: number;
  };
  health: {
    avg_health_score: number;
    avg_trust_score: number;
  };
  trends: {
    increasing: number;
    stable: number;
    decreasing: number;
  };
}

export interface ReportConfig {
  id: string;
  report_code: string;
  report_name: string;
  report_type: 'project_summary' | 'participation_summary' | 'growth_analytics' | 'transparency_report' | 'audit_report' | 'admin_activity';
  description: string | null;
  columns: unknown[];
  filters: Record<string, unknown>;
  export_formats: string[];
  schedule_enabled: boolean;
  is_active: boolean;
}

export interface ProjectAssignment {
  id: string;
  project_id: string;
  admin_id: string;
  role: string;
  assigned_by: string | null;
  assigned_at: string;
  is_primary: boolean;
  is_active: boolean;
}

// ============================================================
// DASHBOARD STATS FUNCTIONS
// ============================================================

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const { data, error } = await supabase.rpc('foe_get_admin_dashboard_stats');
  if (error) throw error;
  return data as AdminDashboardStats;
}

export async function getAIMonitoringSummary(projectId?: string): Promise<AIMonitoringSummary> {
  const { data, error } = await supabase.rpc('foe_get_ai_monitoring_summary', {
    p_project_id: projectId || null,
  });
  if (error) throw error;
  return data as AIMonitoringSummary;
}

// ============================================================
// PROJECT MANAGEMENT FUNCTIONS
// ============================================================

export async function updateProjectStatus(
  projectId: string,
  newStatus: ProjectStatus,
  adminId: string,
  reason?: string
): Promise<boolean> {
  const { data, error } = await supabase.rpc('foe_update_project_status', {
    p_project_id: projectId,
    p_new_status: newStatus,
    p_admin_id: adminId,
    p_reason: reason || null,
  });
  if (error) throw error;
  return data as boolean;
}

export async function logProjectAction(
  projectId: string,
  adminId: string,
  action: AdminAction,
  previousState: Record<string, unknown> = {},
  newState: Record<string, unknown> = {},
  changes: Record<string, unknown> = {},
  notes?: string
): Promise<void> {
  const { error } = await supabase.rpc('foe_log_project_action', {
    p_project_id: projectId,
    p_admin_id: adminId,
    p_action: action,
    p_previous_state: previousState,
    p_new_state: newState,
    p_changes: changes,
    p_notes: notes || null,
  });
  if (error) throw error;
}

// ============================================================
// AUDIT LOG FUNCTIONS
// ============================================================

export async function getProjectAuditLog(projectId?: string): Promise<ProjectAdminLog[]> {
  const { data, error } = await supabase.rpc('foe_get_project_audit_log', {
    p_project_id: projectId || null,
  });
  if (error) throw error;
  return (data || []) as ProjectAdminLog[];
}

export async function getStatusHistory(projectId: string): Promise<ProjectStatusHistory[]> {
  const { data, error } = await supabase
    .from('foe_project_status_history')
    .select('*')
    .eq('project_id', projectId)
    .order('changed_at', { ascending: false });
  if (error) throw error;
  return (data || []) as ProjectStatusHistory[];
}

// ============================================================
// TEMPLATE FUNCTIONS
// ============================================================

export async function getProjectTemplates(): Promise<ProjectTemplate[]> {
  const { data, error } = await supabase
    .from('foe_project_templates')
    .select('*')
    .eq('is_active', true)
    .order('template_name');
  if (error) throw error;
  return (data || []) as ProjectTemplate[];
}

export async function getTemplateByCode(code: string): Promise<ProjectTemplate | null> {
  const { data, error } = await supabase
    .from('foe_project_templates')
    .select('*')
    .eq('template_code', code)
    .maybeSingle();
  if (error) throw error;
  return data as ProjectTemplate | null;
}

// ============================================================
// ADMIN ROLE FUNCTIONS
// ============================================================

export async function getAdminRoles(): Promise<AdminRoleConfig[]> {
  const { data, error } = await supabase
    .from('foe_admin_roles_config')
    .select('*')
    .eq('is_active', true)
    .order('hierarchy_level');
  if (error) throw error;
  return (data || []) as AdminRoleConfig[];
}

// ============================================================
// REPORT FUNCTIONS
// ============================================================

export async function getReportConfigs(): Promise<ReportConfig[]> {
  const { data, error } = await supabase
    .from('foe_reports_config')
    .select('*')
    .eq('is_active', true)
    .order('report_name');
  if (error) throw error;
  return (data || []) as ReportConfig[];
}

// ============================================================
// AI MONITORING FUNCTIONS
// ============================================================

export async function getAIMonitoring(projectId: string, limit: number = 30): Promise<AIMonitoring[]> {
  const { data, error } = await supabase
    .from('foe_ai_monitoring')
    .select('*')
    .eq('project_id', projectId)
    .order('monitoring_date', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data || []) as AIMonitoring[];
}

// ============================================================
// ASSIGNMENT FUNCTIONS
// ============================================================

export async function getProjectAssignments(projectId: string): Promise<ProjectAssignment[]> {
  const { data, error } = await supabase
    .from('foe_project_assignments')
    .select('*')
    .eq('project_id', projectId)
    .eq('is_active', true);
  if (error) throw error;
  return (data || []) as ProjectAssignment[];
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getStatusLabel(status: string): string {
  return PROJECT_STATUS_LABELS[status as ProjectStatus] || status;
}

export function getStatusColor(status: ProjectStatus): string {
  const colors: Record<ProjectStatus, string> = {
    draft: 'bg-gray-500',
    coming_soon: 'bg-amber-500',
    open: 'bg-blue-500',
    active: 'bg-emerald-500',
    paused: 'bg-purple-500',
    closed: 'bg-red-500',
    completed: 'bg-green-500',
    archived: 'bg-slate-500',
  };
  return colors[status] || 'bg-gray-500';
}

export function getStatusBgClass(status: ProjectStatus): string {
  const classes: Record<ProjectStatus, string> = {
    draft: 'bg-gray-500/20 text-gray-400',
    coming_soon: 'bg-amber-500/20 text-amber-400',
    open: 'bg-blue-500/20 text-blue-400',
    active: 'bg-emerald-500/20 text-emerald-400',
    paused: 'bg-purple-500/20 text-purple-400',
    closed: 'bg-red-500/20 text-red-400',
    completed: 'bg-green-500/20 text-green-400',
    archived: 'bg-slate-500/20 text-slate-400',
  };
  return classes[status] || 'bg-gray-500/20 text-gray-400';
}

export function getCategoryLabel(category: string): string {
  return PROJECT_CATEGORY_LABELS[category as ProjectCategory] || category;
}

export function getActionLabel(action: AdminAction): string {
  const labels: Record<AdminAction, string> = {
    created: 'Created',
    updated: 'Updated',
    published: 'Published',
    unpublished: 'Unpublished',
    paused: 'Paused',
    resumed: 'Resumed',
    closed: 'Closed',
    archived: 'Archived',
    restored: 'Restored',
    deleted: 'Deleted',
    duplicated: 'Duplicated',
    settings_changed: 'Settings Changed',
    status_changed: 'Status Changed',
  };
  return labels[action] || action;
}

export function getRoleLabel(role: string): string {
  return ADMIN_ROLE_LABELS[role as AdminRoleCode] || role;
}

export function getPriorityColor(level: 'low' | 'normal' | 'high' | 'critical'): string {
  const colors = {
    low: 'text-slate-400',
    normal: 'text-blue-400',
    high: 'text-amber-400',
    critical: 'text-red-400',
  };
  return colors[level] || 'text-gray-400';
}

export function getTrendIcon(trend: 'increasing' | 'stable' | 'decreasing' | null): string {
  if (!trend) return '→';
  const icons = {
    increasing: '↑',
    stable: '→',
    decreasing: '↓',
  };
  return icons[trend];
}

export function getTrendColor(trend: 'increasing' | 'stable' | 'decreasing' | null): string {
  if (!trend) return 'text-gray-400';
  const colors = {
    increasing: 'text-emerald-400',
    stable: 'text-blue-400',
    decreasing: 'text-red-400',
  };
  return colors[trend] || 'text-gray-400';
}

// ============================================================
// MOCK DATA FOR PREVIEW
// ============================================================

export function getMockDashboardStats(): AdminDashboardStats {
  return {
    projects: {
      total: 24,
      active: 8,
      coming_soon: 5,
      completed: 6,
      closed: 2,
    },
    participation: {
      total_participants: 1250,
      total_units: 3420,
      total_smartpoints: 845000,
    },
    progress: {
      avg_progress: 42,
      high_progress_count: 5,
    },
    transparency: {
      avg_score: 96,
      flagged_count: 3,
    },
  };
}

export function getMockAIMonitoringSummary(): AIMonitoringSummary {
  return {
    alerts: {
      total_risk_alerts: 12,
      total_fraud_alerts: 4,
      high_risk_count: 2,
      critical_count: 1,
    },
    health: {
      avg_health_score: 94,
      avg_trust_score: 98,
    },
    trends: {
      increasing: 15,
      stable: 6,
      decreasing: 1,
    },
  };
}

export function getMockAuditLog(): ProjectAdminLog[] {
  return [
    {
      id: 'log-1',
      project_id: 'proj-1',
      admin_id: 'admin-1',
      action: 'created',
      previous_state: {},
      new_state: { name: 'Green Valley Housing' },
      changes: {},
      ip_address: '192.168.1.1',
      audit_notes: 'Project created for affordable housing initiative',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      project_name: 'Green Valley Housing',
      admin_name: 'Admin User',
    },
    {
      id: 'log-2',
      project_id: 'proj-2',
      admin_id: 'admin-1',
      action: 'status_changed',
      previous_state: { status: 'draft' },
      new_state: { status: 'active' },
      changes: { status: 'draft → active' },
      ip_address: '192.168.1.1',
      audit_notes: 'Project approved and activated',
      created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      project_name: 'EV Future Program',
      admin_name: 'Admin User',
    },
  ];
}
