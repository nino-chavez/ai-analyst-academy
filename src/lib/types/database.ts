export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      capstone_projects: {
        Row: {
          completed_at: string | null
          content: Json | null
          created_at: string | null
          deliverable_url: string | null
          description: string | null
          id: string
          is_public: boolean | null
          project_type: string | null
          started_at: string | null
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          content?: Json | null
          created_at?: string | null
          deliverable_url?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          project_type?: string | null
          started_at?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          content?: Json | null
          created_at?: string | null
          deliverable_url?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          project_type?: string | null
          started_at?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      lab_progress: {
        Row: {
          completed_at: string | null
          created_at: string | null
          deliverable_url: string | null
          feedback: string | null
          id: string
          lab_id: string
          phase_id: string
          rubric_scores: Json | null
          score: number | null
          started_at: string | null
          status: string | null
          updated_at: string | null
          user_id: string
          work_data: Json | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          deliverable_url?: string | null
          feedback?: string | null
          id?: string
          lab_id: string
          phase_id: string
          rubric_scores?: Json | null
          score?: number | null
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          work_data?: Json | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          deliverable_url?: string | null
          feedback?: string | null
          id?: string
          lab_id?: string
          phase_id?: string
          rubric_scores?: Json | null
          score?: number | null
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          work_data?: Json | null
        }
        Relationships: []
      }
      module_progress: {
        Row: {
          checklist_items: Json | null
          completed_at: string | null
          concepts_understood: string[] | null
          created_at: string | null
          ease_factor: number | null
          exercises_completed: string[] | null
          id: string
          module_id: string
          next_review_at: string | null
          phase_id: string
          quiz_score: number | null
          review_count: number | null
          sections_viewed: string[] | null
          self_assessment_score: number | null
          started_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          checklist_items?: Json | null
          completed_at?: string | null
          concepts_understood?: string[] | null
          created_at?: string | null
          ease_factor?: number | null
          exercises_completed?: string[] | null
          id?: string
          module_id: string
          next_review_at?: string | null
          phase_id: string
          quiz_score?: number | null
          review_count?: number | null
          sections_viewed?: string[] | null
          self_assessment_score?: number | null
          started_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          checklist_items?: Json | null
          completed_at?: string | null
          concepts_understood?: string[] | null
          created_at?: string | null
          ease_factor?: number | null
          exercises_completed?: string[] | null
          id?: string
          module_id?: string
          next_review_at?: string | null
          phase_id?: string
          quiz_score?: number | null
          review_count?: number | null
          sections_viewed?: string[] | null
          self_assessment_score?: number | null
          started_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      phase_deliverables: {
        Row: {
          content: Json | null
          created_at: string | null
          deliverable_url: string | null
          description: string | null
          id: string
          is_public: boolean | null
          phase_id: string
          submitted_at: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          deliverable_url?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          phase_id: string
          submitted_at?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          deliverable_url?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          phase_id?: string
          submitted_at?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      review_queue: {
        Row: {
          concept_id: string
          created_at: string | null
          ease_factor: number | null
          id: string
          interval_days: number | null
          last_reviewed_at: string | null
          module_id: string
          next_review_at: string
          review_count: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          concept_id: string
          created_at?: string | null
          ease_factor?: number | null
          id?: string
          interval_days?: number | null
          last_reviewed_at?: string | null
          module_id: string
          next_review_at: string
          review_count?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          concept_id?: string
          created_at?: string | null
          ease_factor?: number | null
          id?: string
          interval_days?: number | null
          last_reviewed_at?: string | null
          module_id?: string
          next_review_at?: string
          review_count?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      sandbox_sessions: {
        Row: {
          created_at: string | null
          estimated_cost: number | null
          id: string
          lab_id: string | null
          messages: Json | null
          model: string | null
          module_id: string | null
          persona: string | null
          provider: string
          system_prompt: string | null
          total_tokens_used: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          estimated_cost?: number | null
          id?: string
          lab_id?: string | null
          messages?: Json | null
          model?: string | null
          module_id?: string | null
          persona?: string | null
          provider: string
          system_prompt?: string | null
          total_tokens_used?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          estimated_cost?: number | null
          id?: string
          lab_id?: string | null
          messages?: Json | null
          model?: string | null
          module_id?: string | null
          persona?: string | null
          provider?: string
          system_prompt?: string | null
          total_tokens_used?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      saved_prompts: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          is_public: boolean | null
          lab_id: string | null
          prompt_text: string
          tags: string[] | null
          title: string
          updated_at: string | null
          use_count: number | null
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          lab_id?: string | null
          prompt_text: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
          use_count?: number | null
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          lab_id?: string | null
          prompt_text?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          use_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_api_keys: {
        Row: {
          id: string
          user_id: string
          provider: string
          encrypted_key: string
          key_hint: string | null
          is_valid: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          provider: string
          encrypted_key: string
          key_hint?: string | null
          is_valid?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          provider?: string
          encrypted_key?: string
          key_hint?: string | null
          is_valid?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          daily_goal_minutes: number | null
          display_name: string | null
          id: string
          last_active_at: string | null
          onboarding_completed: boolean | null
          persona_type: string | null
          skill_level: string | null
          streak_current: number | null
          streak_longest: number | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          daily_goal_minutes?: number | null
          display_name?: string | null
          id: string
          last_active_at?: string | null
          onboarding_completed?: boolean | null
          persona_type?: string | null
          skill_level?: string | null
          streak_current?: number | null
          streak_longest?: number | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          daily_goal_minutes?: number | null
          display_name?: string | null
          id?: string
          last_active_at?: string | null
          onboarding_completed?: boolean | null
          persona_type?: string | null
          skill_level?: string | null
          streak_current?: number | null
          streak_longest?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

// Convenience type aliases for common table types
export type UserProfile = Tables<'user_profiles'>
export type ModuleProgress = Tables<'module_progress'>
export type LabProgress = Tables<'lab_progress'>
export type PhaseDeliverable = Tables<'phase_deliverables'>
export type CapstoneProject = Tables<'capstone_projects'>
export type SandboxSession = Tables<'sandbox_sessions'>
export type SavedPrompt = Tables<'saved_prompts'>
export type ReviewQueueItem = Tables<'review_queue'>

// Insert types
export type UserProfileInsert = TablesInsert<'user_profiles'>
export type ModuleProgressInsert = TablesInsert<'module_progress'>
export type LabProgressInsert = TablesInsert<'lab_progress'>
export type PhaseDeliverableInsert = TablesInsert<'phase_deliverables'>
export type CapstoneProjectInsert = TablesInsert<'capstone_projects'>
export type SandboxSessionInsert = TablesInsert<'sandbox_sessions'>
export type SavedPromptInsert = TablesInsert<'saved_prompts'>
export type ReviewQueueItemInsert = TablesInsert<'review_queue'>

// Update types
export type UserProfileUpdate = TablesUpdate<'user_profiles'>
export type ModuleProgressUpdate = TablesUpdate<'module_progress'>
export type LabProgressUpdate = TablesUpdate<'lab_progress'>
export type PhaseDeliverableUpdate = TablesUpdate<'phase_deliverables'>
export type CapstoneProjectUpdate = TablesUpdate<'capstone_projects'>
export type SandboxSessionUpdate = TablesUpdate<'sandbox_sessions'>
export type SavedPromptUpdate = TablesUpdate<'saved_prompts'>
export type ReviewQueueItemUpdate = TablesUpdate<'review_queue'>

export type UserApiKey = Tables<'user_api_keys'>
export type UserApiKeyInsert = TablesInsert<'user_api_keys'>
export type UserApiKeyUpdate = TablesUpdate<'user_api_keys'>
