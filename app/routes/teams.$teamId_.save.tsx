import { ActionFunctionArgs, json } from "@remix-run/node";

export async function action({ request, params }: ActionFunctionArgs) {
    const formData = await request.formData();
    const name = formData.get('name');
    console.log(name);
    console.log(params);
    return json({ name });
}