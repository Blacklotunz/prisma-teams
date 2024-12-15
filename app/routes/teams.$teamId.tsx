import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, NavLink, useFetcher, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getChildren, getTeamMembers } from "../data/data";
import { Team } from "~/data/models/team";
import { useState } from "react";

interface TreeItemProps {
  team: Team;
}

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.teamId, "Missing teamId param");
  const formData = await request.formData();
};

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.teamId, "Missing teamId param");
  const childTeams = await getChildren(params.teamId);
  if (!childTeams) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ childTeams });
};


export default function TeamItem({ team }: TreeItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const fetcher = useFetcher<{ childTeams: Team[] }>();
  const isLoading = fetcher.state === "loading";
  const childTeams = fetcher.data?.childTeams ?? [];
  
  const handleToggle = async () => {
    if (!isOpen && !fetcher.data) {
      fetcher.load(`/teams/${team.id}`);
    }
    setIsOpen(!isOpen);
  };
  
  return (
    <li>
      <div className="tree-item-header">
        <button onClick={handleToggle}>
            {isLoading ? "..." : isOpen ? "-" : "+"}
        </button>
        <NavLink
          className={({ isActive, isPending }) =>
            isActive ? "active" : isPending ? "pending" : ""
          }
          to={`members/${team.id}`}
        >
          {team.name ? team.name : <i>No Name</i>}
        </NavLink>
        <div className="tree-item-actions">
          <NavLink to={`/teams/${team.id}/edit`} aria-label="Edit Team">
            ✏️
          </NavLink>
        </div>
      </div>
      {isOpen && (
        <ul className="inner-tree">
          {isLoading ? (
            <li>Loading...</li>
          ) : childTeams.length > 0 ? (
            childTeams.map(childTeam => (
              <TeamItem key={childTeam.id} team={childTeam} />
            ))
          ) : (
            <li>No teams</li>
          )}
        </ul>
      )}
    </li>
  );
}
