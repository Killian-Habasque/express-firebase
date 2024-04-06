
export const auth = {
    register: (pseudo, password) => fetch("/api/register", {method: "POST", body: JSON.stringify({ pseudo, password }), headers: {
        Accept: "application/json", 
        "Content-Type": "application/json"
    }}).then(res => res.json()),
    login: (email, password) => fetch("/api/login", {method: "POST", body: JSON.stringify({ email, password }), headers: {
        Accept: "application/json", 
        "Content-Type": "application/json"
    }}).then(res => res.json()),
    // logout: () => fetch("/auth/logout", {method: "POST"}).then(res => res.json()),
}

export const client = {
    auth
}