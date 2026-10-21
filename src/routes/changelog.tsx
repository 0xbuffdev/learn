import { redirect } from "react-router";
import { COMPANY_LINKS } from "../lib/site";

/** Keep the former changelog URL pointed at the company's canonical page. */
export function loader() {
	return redirect(COMPANY_LINKS.changelog);
}

export function clientLoader() {
	return redirect(COMPANY_LINKS.changelog);
}

export default function ChangelogRedirect() {
	return null;
}
