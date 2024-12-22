import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, isRouteErrorResponse, useFetcher, useLoaderData, useRouteError } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getTeamMembers, getTeams, updateTeamMember } from "../data/data";
import { toTeamMemberUpdate } from "~/data/models/member";
import { isRootTeam } from "~/data/models/team";

export async function action({ params, request }: ActionFunctionArgs) {
  invariant(params.teamId, "Missing teamId param");
  
  const action = params.action;
  

  if(action == "save"){
    const formData = await request.formData();
    const teamMemberUpdate = toTeamMemberUpdate(formData);
    return updateTeamMember(teamMemberUpdate);
  }

  return null;

};


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
  const members = await getTeamMembers(params.teamId);
  if (!members) {
    throw new Response("Not Found", { status: 404 });
  }

  const teams = await getTeams();

  return json({ members, teams });
};

export default function Members() {
  const { members, teams } = useLoaderData<typeof loader>();
  
  const fetcher = useFetcher();

  return (
    <div id="details">
      {
       fetcher.state === "submitting" || fetcher.state === "loading" ? 
       (<p>Updating...</p>) :
        <div id="contact">
          {members.length > 0 ? members.map((member) => (
            <div key={member.member_id} className="member">
            
                <img
                  alt={`${member.first_name} ${member.last_name} avatar`}
                  key={member.avatar}
                  src={member.avatar ?? ""}
                />
            <div>
              <div className="member-info">
                <h1>{member.first_name} {member.last_name}</h1>
                <span>
                  <b>Role:</b> {member.title} <br />
                  <b>Email:</b> {member.email}
                </span>
              </div>
              
              <div id="contact-form">
                  <Form
                    method="post"
                    onSubmit={(event) => {
                      event.preventDefault();
                      const formData = new FormData(event.currentTarget);
                      fetcher.submit(formData, { method: "post", action: `/members/${member.member_id}/save` });
                    }}
                  >
                    <div>
                      <select defaultValue={member.team_id} name="team_id">
                        { <option id={member.team_id} value={member.team_id}>{teams.filter(t => t.id === member.team_id)[0].name}</option> }
                        {teams.map(t => t.id != member.team_id && !isRootTeam({id: t.id}) && <option id={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                      <button type="submit">Save</button>
                    </div>
                  </Form>
              </div>
              </div>
            </div>
          )) : <li>No members</li>
          }
      </div>
    }
    </div>
  );
}