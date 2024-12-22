import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { json } from "@remix-run/node";
import { isRouteErrorResponse, NavLink, useFetcher, useLoaderData, useRouteError } from "@remix-run/react";
import { getTeamByID, getChildrenRecursive, getMembers, updateTeam, getRootLevel, getPossibleParents, updateTeamRelation } from "~/data/data";
import { isRootTeam, mergeFormDataForTeamUpdate as toTeamUpdate } from "~/data/models/team";
import { useEffect, useRef, useState } from "react";
import { isString } from "~/data/models/typeguards";

export function ErrorBoundary() {
    const error = useRouteError();
  
    if (isRouteErrorResponse(error)) {
      return (
        <div>
          <h1>
            {error.status} {error.statusText}
          </h1>
          <p>ROUTE: {error.data}</p>
        </div>
      );
    } else if (error instanceof Error) {
      return (
        <div>
          <h1>Error</h1>
          <p>Whoops! this is nasty</p>
        </div>
      );
    } else {
      return <h1>Unknown Error</h1>;
    }
  }

export async function loader({ params }: LoaderFunctionArgs) {
    invariant(params.teamId, "Missing teamId param");
    const team = await getTeamByID(params.teamId);
    team.children = await getChildrenRecursive(params.teamId);
    const members = await getMembers();
    const possibleParents = await getPossibleParents(params.teamId);
    return json({ team, members, possibleParents });
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const teamUpdate = toTeamUpdate(formData);
    // update teams could be done in parallel
    const success1 = await updateTeam(teamUpdate);
    let success2 = false;
    if(isString(teamUpdate.parent_id)){
      success2 = await updateTeamRelation(teamUpdate.id, teamUpdate.parent_id);
    }
    return json({ success: (success1 && success2) });
}

export default function EditTeam() {
    const { team, members, possibleParents } = useLoaderData<typeof loader>();
    
    const fetcher = useFetcher();

    const [teamName, setTeamName] = useState(team.name);
    const [teamManagerID, setTeamManagerID] = useState(team.manager_id ? team.manager_id : "nobody");
    const [teamManagerName, setTeamManagerName] = useState(team.manager ? team.manager.first_name+' '+team.manager.last_name : "nobody");
    
    const [teamParentID, setTeamParentID] = useState(team.parent_id ? team.parent_id : "placeholder");
    const [teamParentName, setTeamParentName] = useState(team.parent?.name ? team.parent?.name : "placeholder");
    
    // Use useEffect to update state when loader data changes
    useEffect(() => {
        setTeamName(team.name);
        setTeamManagerID(team.manager_id ? team.manager_id : "nobody");
        setTeamManagerName(team.manager ? team.manager.first_name + ' ' + team.manager.last_name : "nobody");
        setTeamParentID(team.parent_id ? team.parent_id : "placeholder");
        setTeamParentName(team.parent?.name ? team.parent?.name : "placeholder");
    }, [team]);

    return (
        <div id="contact">
            <div>
                <h1>Edit Team</h1>
                <div id="contact-form">
                    <p>
                        <span>Team Name</span>   
                        <input
                            type="text"
                            id="name"
                            value={teamName}
                            aria-label="Team name"
                            onChange={(e) => {
                                setTeamName(e.target.value);
                                team.name = e.target.value;
                            }}
                        />
                    </p>
                    <p>
                        <span>Team Manager</span>
                        <select value={teamManagerID} name="manager" onChange={(e) => {
                            setTeamManagerID(e.target.value);
                            const m = members.find(m => m.id === e.target.value);
                            setTeamManagerName(m?.first_name+' '+m?.last_name);
                            team.manager_id = e.target.value;
                        }}>
                            {
                              teamManagerID !== "nobody" && teamManagerName ? 
                              <option key={teamManagerID} value={teamManagerID}>{teamManagerName}</option> :
                              <option key="nobody" value="nobody">Nobody</option>
                            }
                            {
                              members.map((member) => (
                                member.id !== team.manager_id &&
                                <option key={member.id} value={!!member.id ? member.id : ""}>{member.first_name+' '+member.last_name}</option>
                              ))
                            }
                        </select>
                    </p>
                    <p>
                        <span>Reports to</span>
                        <select value={teamParentID} name="parent" onChange={(e) => {
                            setTeamParentID(e.target.value);
                            const p = possibleParents.find(p => p.id === e.target.value);
                            setTeamParentName(p?.name ? p?.name : "Root");
                            team.parent_id = e.target.value;
                        }}>
                            {!isRootTeam({id: teamParentID}) && teamParentName ? 
                                <option value={teamParentID}>{teamParentName}</option> : 
                                <option value="root">No-Team</option>}
                            {
                                possibleParents?.map((team) => 
                                    team.id !== teamParentID &&
                                    <option key={team.id} value={team.id}>{team.name}</option>
                                )
                            }
                        </select>
                    </p>
                    <button disabled={fetcher.state === "submitting"} type="button" aria-label="Save" 
                        onClick={
                            () => {
                                fetcher.submit({...team}, {
                                    method: 'post',
                                        action: `/teams/${team.id}/edit`,
                                    });
                                }
                        }>💾 Save</button>
                    <div>
                        <br />
                        <p>
                            {team.children?.length} teams report to {team.name}:
                        </p>
                        <ul>
                            {team.children?.map((child) => (
                                <li key={child.id}>
                                    <div>
                                        <NavLink to={`/teams/${child.id}/edit`}>{child.name}</NavLink>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                  
                </div>
            </div>
        </div>
    );
}
