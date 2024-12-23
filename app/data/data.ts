import { matchSorter } from "match-sorter";
// @ts-ignore - no types, but it's a tiny function
import sortBy from "sort-by";
import invariant from "tiny-invariant";

import { getPool } from "../server";
import { Member, TeamMemberUpdate } from "./models/member";
import { Team, UpdateTeam } from "./models/team";

const root_team_id = '00000000-0000-0000-0000-000000000000'

export async function getTeams(): Promise<Team[]> {
  const pool = getPool();
  const result = await pool.query('SELECT * FROM teams');
  return result.rows;
}

export async function getTeamMembers(teamId: string): Promise<Member[]> {
  const pool = getPool();
  const result = await pool.query('SELECT  m.* , tm.* FROM members m JOIN team_members tm ON tm.member_id = m.id WHERE tm.team_id = $1', [teamId]);

  
  return result.rows;
}

export async function getChildren(teamId: string): Promise<Team[]> {
  const pool = getPool();
  const result = await pool.query('SELECT t.* FROM team_relationships tr JOIN teams t ON tr.child_team_id = t.id WHERE tr.parent_team_id = $1', [teamId]);
  return result.rows;
}

export async function getRootLevel(): Promise<Team[]> {
  const rootLevel = await getChildren(root_team_id);
  return rootLevel;
}

export async function getMembers(): Promise<Member[]> {
  const pool = getPool();
  const result = await pool.query('SELECT * FROM members');
  return result.rows;
}

export async function getTeamByID(id: string): Promise<Team> {
  const pool = getPool();

  const result = await pool.query(`
    SELECT t.*, tr.parent_team_id as parent_id, p.name as parent_name, p.manager_id as parent_manager_id, p.id as parent_id, m.email as manager_email, m.first_name as manager_first_name, m.last_name as manager_last_name, m.id as manager_id, m.avatar as manager_avatar, m.is_active as manager_is_active
    FROM teams t 
    JOIN team_relationships tr ON t.id = tr.child_team_id 
      LEFT JOIN members m ON t.manager_id = m.id 
      LEFT JOIN teams p ON tr.parent_team_id = p.id 
    WHERE t.id = $1`, [id]);

  const row = result.rows[0];

  return {
    id: row.id,
    name: row.name,
    parent_id: row.parent_id,
    parent:{
      id: row.parent_id,
      name: row.parent_name,
      manager_id: row.parent_manager_id,
    },
    manager_id: row.manager_id,
    manager: row.manager_id ? {
      id: row.manager_id,
      member_id: row.manager_id,
      email: row.manager_email,
      first_name: row.manager_first_name,
      last_name: row.manager_last_name,
      is_active: row.manager_is_active,
      avatar: row.manager_avatar,
      title: row.manager_title,
      team_id: row.manager_team_id
    } : null
  };
}

export async function getChildrenRecursive(id: string = root_team_id, maxLevel: number = 100): Promise<Team[]> {
  const pool = getPool();

  const result = await pool.query(`
    WITH RECURSIVE get_hierarchy as (
      SELECT parent_team_id, child_team_id, 1 as level FROM team_relationships WHERE child_team_id = $1
      UNION ALL
        select p.parent_team_id, p.child_team_id, level+1 as level from team_relationships p join get_hierarchy c on p.parent_team_id = c.child_team_id 
        WHERE level <= $2
    ) SELECT id, name, manager_id FROM get_hierarchy JOIN teams t on get_hierarchy.child_team_id = t.id WHERE level > 1`, [id, maxLevel]);

  const toReturn: Team[] = [];

  result.rows.forEach(row => {
    toReturn.push({
      id: row.id,
      name: row.name,
      manager_id: row.manager_id
    });
  });

  return toReturn;
}

export async function getPossibleParents(id: string): Promise<Team[]> {
  const rootLevel = await getRootLevel();
  const pool = getPool();
  const toReturn: Team[] = [];
  for (const node of rootLevel) {
    toReturn.push(node);
    const result = await pool.query(`
      WITH RECURSIVE get_hierarchy as (
      SELECT parent_team_id, child_team_id, 1 as level FROM team_relationships WHERE child_team_id = $1
      UNION ALL
        select p.parent_team_id, p.child_team_id, level+1 as level from team_relationships p join get_hierarchy c on p.parent_team_id = c.child_team_id 
        WHERE p.child_team_id != $2
    ) SELECT id, name, manager_id FROM get_hierarchy JOIN teams t on get_hierarchy.child_team_id = t.id WHERE level > 1`, [node.id,  id]);

    result.rows.forEach(row => {
      toReturn.push({
        id: row.id,
        name: row.name,
        manager_id: row.manager_id
      });
    });
  }

  toReturn.push({
    id: root_team_id,
    name: "Root",
    manager_id: "Nobody"
  })

  return toReturn;
}

export async function updateTeam(team: UpdateTeam): Promise<boolean> {
  const pool = getPool();
  const connection = await pool.connect();
  let toReturn = false;
  try{
    const result = await connection.query('UPDATE teams SET name = $1, manager_id = $2 WHERE id = $3;', [team.name, team.manager_id, team.id]);
    if (result.rowCount == 1) {
      toReturn = true;
    }else{
      toReturn = false;
    }
  } catch (error) {
    console.error(error);
  } finally {
    connection.release();
  }
  return toReturn;
}

export async function updateTeamRelation(teamId: string, parentId: string): Promise<boolean>{
  const pool = getPool();
  const connection = await pool.connect();
  let toReturn = false;
  try{
    await connection.query('UPDATE team_relationships SET parent_team_id = $1 WHERE child_team_id = $2;', [parentId, teamId]);
    toReturn = true;
  } catch (error) {
    console.error(error);
  } finally {
    connection.release();
  }
  return toReturn;
}

export async function updateTeamMember(teamMemberUpdate: TeamMemberUpdate): Promise<boolean> {
  const pool = getPool();
  const connection = await pool.connect();
  let toReturn = false;
  try{
    await connection.query('UPDATE team_members SET team_id = $1 WHERE member_id = $2;', [teamMemberUpdate.team_id, teamMemberUpdate.member_id]);
    toReturn = true;
  } catch (error) {
    console.error(error);
  } finally {
    connection.release();
  }
  return toReturn;
}

export async function updateTeamMembers(currentTeamId: string, newTeamId: string, member: Member): Promise<boolean> {
  const pool = getPool();
  const connection = await pool.connect();
  let toReturn = false;
  try{
    const result = await connection.query('UPDATE team_members SET team_id = $1 WHERE team_id = $2 AND member_id = $3;', [newTeamId, currentTeamId, member.member_id]);
    if (result.rowCount == 1) {
      toReturn = true;
    }else{
      toReturn = false;
    }
  } catch (error) {
    console.error(error);
  } finally {
    connection.release();
  }
  return toReturn;
}