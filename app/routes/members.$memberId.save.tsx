import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";

import invariant from "tiny-invariant";

import { updateTeamMember } from "../data/data";
import { toTeamMemberUpdate } from "~/data/models/member";
import { isRouteErrorResponse } from "@remix-run/react";
import { useRouteError } from "@remix-run/react";

export async function action({ params, request }: ActionFunctionArgs) {
  invariant(params.memberId, "Missing memberId param");
  
  const formData = await request.formData();
  const teamMemberUpdate = toTeamMemberUpdate(formData);
  teamMemberUpdate.member_id = params.memberId;
  
  return await updateTeamMember(teamMemberUpdate);
}