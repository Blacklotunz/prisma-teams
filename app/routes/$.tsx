import { useNavigate } from "@remix-run/react";

export function loader() {
    return new Response("Not Found", {
      status: 404,
    });
  }

export default function NotFoundPage() {
    const navigate = useNavigate();
    return <div style={{textAlign: "center"}}>
        <h1>Are you lost?</h1><br/>
        <button onClick={()=>navigate("/")}>Go Home</button>
    </div>
  }