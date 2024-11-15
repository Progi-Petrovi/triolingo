import PathConstants from "@/routes/pathConstants";
import { useNavigate } from "react-router-dom";

function useFetch() {
	const navigate = useNavigate();

	return async function fetchAPI(path: string, requestInit?: RequestInit) {
		const res = await fetch(
			//removes leading and trailing "/"s
			new URL(path.replace(/^\/|\/$/g, ""), PathConstants.API_URL),
			requestInit
		);

		if (res.type == "opaqueredirect" || res.redirected) {
			const url: URL = new URL(res.url);
			if (url.origin == new URL(window.location.href).origin)
				navigate(url.pathname + url.search);
			else window.location.href = url.toString();
		}
		try {
			return { status: res.status, body: await res.json() };
		} catch {
			return { status: res.status };
		}
	};
}

export { useFetch };
