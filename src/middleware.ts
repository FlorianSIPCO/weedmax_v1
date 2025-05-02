import withAuth from "next-auth/middleware"

export default withAuth({
    pages: {
        signIn: '/login',
    }
})

export const config = {
    matcher: ["/dashboard/:path*"] // protège toutes les pages enfants de /dashboard
}