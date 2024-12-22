import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigate,
  useRouteError,
} from "@remix-run/react";

import appStylesHref from "./app.css";
import { getRootLevel } from "./data/data";
import TeamItem from "./routes/teams.$teamId";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
];

export const loader = async () => {
  const teams = await getRootLevel();
  return json({ teams });
};

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}

export default function App() {
  const { teams } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>

        <div id="sidebar">
          <h1>Team Management</h1>
          <div>
            <button onClick={()=>navigate("/")}>Home</button>
          </div>
          <nav>
            {teams.length ? (
              <ul>
                {teams.map((team) =>
                  <TeamItem key={team.id} team={team}/>
                )}
              </ul>
            ) : (
              <p>
                <i>No teams</i>
              </p>
            )}
          </nav>
        </div>
        <div
          id="detail"
        >
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
