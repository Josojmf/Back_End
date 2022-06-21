
  export type User = {
    _id: string,
    usuario:string
    email: string,
    token: string
}
export type Message = {
    sala:string
    user: string,
    message:string
}

export type Post = {
    email: string,
    comment:string
}

export type Sala = {
    sala:string,
    users:string[],
}

