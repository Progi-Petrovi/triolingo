import PathConstants from "@/routes/pathConstants";

function useFetch() {
    return async function fetchAPI(path: string, requestInit?: RequestInit) {
        if (!requestInit) {
            requestInit = {};
        }

        requestInit.credentials = "include";

        const res = await fetch(
            //removes leading and trailing "/"s
            new URL(path.replace(/^\/|\/$/g, ""), PathConstants.API_URL),
            requestInit
        );

        try {
            const rawBody = await res.text();
            try {
                const jsonBody = JSON.parse(rawBody);
                return { status: res.status, body: jsonBody };
            } catch {
                return { status: res.status, body: rawBody };
            }
        } catch {
            return { status: res.status };
        }
    };
}

export { useFetch };
