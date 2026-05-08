import { createUser } from "@/src/lib/user"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const {email, name} = body

        const user = await createUser(body)

        await resend.emails.send({
            from: "<anamateasovich98@gmail.com",
            to: email,
            subject: "Bienvenido 🎉",
            html: `<h1>Hola ${name}</h1><p>Gracias por registrarte</p>`,
        })

        return Response.json(user)
    } catch (error: any) {
        console.error(error)
        return new Response(error.message, {status: 400})
    }
}