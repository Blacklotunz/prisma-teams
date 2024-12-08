export type Team = {
    id: string;
    name: string;
    parent: Team | null;
    children: Team[];
}