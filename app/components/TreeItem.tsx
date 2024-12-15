import { NavLink, useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { getChildren } from "~/data/data";
import type { Team } from "~/data/models/team";

interface TreeItemProps {
  team: Team;
}

export function TreeItem({ team }: TreeItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const fetcher = useFetcher<{ childTeams: Team[] }>();
  const childTeams = fetcher.data?.childTeams ?? [];
  const isLoading = fetcher.state === "loading";
  
  const handleToggle = () => {
    if (!isOpen && !fetcher.data) {
      // Only fetch if we're opening and haven't loaded data yet
      fetcher.load(`/teams/${team.id}`);
    }
    setIsOpen(!isOpen);
  };
  
  return (
    <li>
      <div className="tree-item-header">
        <NavLink
          className={({ isActive, isPending }) =>
            isActive ? "active" : isPending ? "pending" : ""
          }
          to={`teams/${team.id}`}
        >
          {team.name ? team.name : <i>No Name</i>}
        </NavLink>
        <button onClick={handleToggle}>
            {isLoading ? "..." : isOpen ? "-" : "+"}
        </button>
      </div>
      {isOpen && (
        <ul>
          {isLoading ? (
            <li>Loading...</li>
          ) : childTeams.length > 0 ? (
            childTeams.map(childTeam => (
              <TreeItem key={childTeam.id} team={childTeam} />
            ))
          ) : (
            <li>No children</li>
          )}
        </ul>
      )}
    </li>
  );
}
