export type Member = {
  member_id: string | null;
  id: string | null;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  title: string | null;
  team_id: string
  is_active: boolean | null;
  avatar: string | null;
}

export type TeamMemberUpdate = {
  member_id: string;
  team_id: string | null;
}

export function toTeamMemberUpdate(fd: FormData): TeamMemberUpdate {
  return {
    member_id: fd.get("member_id") as string,
    team_id: fd.get("team_id") as string | null,
  };
}