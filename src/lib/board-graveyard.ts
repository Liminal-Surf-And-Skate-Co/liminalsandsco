import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeError } from "@/lib/error-sanitize";

export interface BoardMemorial {
  id: string;
  user_id: string;
  board_type: "skate" | "surf";
  image_url: string | null;
  trick_attempted: string;
  spot_tagged: string;
  memory_date: string;
  description: string;
  board_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface BoardMemorialInput {
  board_type: "skate" | "surf";
  image_url?: string;
  trick_attempted: string;
  spot_tagged: string;
  memory_date: string;
  description: string;
  board_name?: string;
}

export function useBoardGraveyard() {
  return useQuery({
    queryKey: ["board_graveyard"],
    queryFn: async (): Promise<BoardMemorial[]> => {
      const { data, error } = await supabase
        .from("board_graveyard")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw new Error(sanitizeError(error));
      return (data ?? []) as BoardMemorial[];
    },
  });
}

export function useCreateBoardMemorial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: BoardMemorialInput) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Sign in to memorialize your board");

      // Validate character limits
      if (input.description.length > 500) {
        throw new Error("Description must be 500 characters or less");
      }
      if (input.trick_attempted.length > 200) {
        throw new Error("Trick name must be 200 characters or less");
      }

      const { data, error } = await supabase
        .from("board_graveyard")
        .insert({
          user_id: user.id,
          board_type: input.board_type,
          image_url: input.image_url || null,
          trick_attempted: input.trick_attempted,
          spot_tagged: input.spot_tagged,
          memory_date: input.memory_date,
          description: input.description,
          board_name: input.board_name || null,
        })
        .select()
        .single();
      if (error) throw new Error(sanitizeError(error));
      return data as BoardMemorial;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["board_graveyard"] }),
  });
}

export function useDeleteBoardMemorial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("board_graveyard").delete().eq("id", id);
      if (error) throw new Error(sanitizeError(error));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["board_graveyard"] }),
  });
}
