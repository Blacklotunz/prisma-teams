import { Member } from "./member";

export type Team = {
    id: string;
    name: string;
    manager_id: string | null;
    manager?: Member | null; // there should be separation between db data model and business logic model. e.g. manager here is not returned from db, but is a business logic model
    parent_id?: string | null;
    parent?: Team | null;
    children?: Team[];
}

export type UpdateTeam = {
    id: string;
    name: string;
    manager_id: string | null;
    parent_id: string | null;
}

export function mergeFormDataForTeamUpdate(fd: FormData): UpdateTeam {
    const teamData: UpdateTeam = {
        id: fd.get("id") as string,
        name: fd.get("name") as string,
        manager_id: fd.get("manager_id") as string | null,
        parent_id: fd.get("parent_id") as string | null
    };

    return teamData;
}