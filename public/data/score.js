
export const board = {
    getScores: () => fetch("/api/scores").then(res => res.json()),
    setScore: () => fetch("/api/score", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    }).then(res => res.json()),
}

export const score = {
    board
}