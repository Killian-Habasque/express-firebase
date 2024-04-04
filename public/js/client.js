export const boards = {
    getAll: () => fetch("/users").then(res => res.json())
}
