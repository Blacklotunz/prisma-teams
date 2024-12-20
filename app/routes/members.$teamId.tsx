import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getTeamMembers } from "../data/data";

export async function action({ params, request }: ActionFunctionArgs) {
  invariant(params.teamId, "Missing teamId param");
  const formData = await request.formData();
  // return updateTeam(params.teamId, {
  //   favorite: formData.get("favorite") === "true",
  // });
};

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.teamId, "Missing teamId param");
  const members = await getTeamMembers(params.teamId);
  if (!members) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ members });
};

const placeholder_member = (<div key="placeholder" className="member">
  <div>
    <img
      alt={`placeholder avatar`}
      key="placeholder"
      src="https://via.placeholder.com/150"
    />
  </div>
  <div className="member-info">
    <h1>Placeholder</h1>
    <div className="member-actions">
      <Form action="edit">
        <button type="submit" disabled>Edit</button>
      </Form>
      <Form
        action="destroy"
        method="post"
        onSubmit={(event) => {
          const response = confirm(
            "Please confirm you want to delete this record.",
          );
          if (!response) {
            event.preventDefault();
          }
        }}
      >
        <button type="submit" disabled>Delete</button>
      </Form>
    </div>
  </div>
</div>)

export default function Members() {
  const { members } = useLoaderData<typeof loader>();
  return (
    <div id="members">
      <div>
        {members.length > 0 ? members.map((member) => (
          <div key={member.id} className="member">
            <div>
              <img
                alt={`${member.first_name} ${member.last_name} avatar`}
                key={member.avatar}
                src={member.avatar ?? ""}
              />
            </div>
            <div className="member-info">
              <h1>{member.first_name} {member.last_name}</h1>
              <div className="member-actions">
                <Form action="edit">
                  <button type="submit">Edit</button>
                </Form>
                <Form
                  action="destroy"
                  method="post"
                  onSubmit={(event) => {
                    const response = confirm(
                      "Please confirm you want to delete this record.",
                    );
                    if (!response) {
                      event.preventDefault();
                    }
                  }}
                >
                  <button type="submit">Delete</button>
                </Form>
              </div>
            </div>
          </div>
        )) : <li>No members</li>}
      </div>
    </div>
  );
}