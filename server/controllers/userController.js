import sql from "../configs/db.js"

export const getUserCreation = async (req, res) => {
    try {
        const { userId } = req.auth()
        const creations = await sql`SELECT * FROM creations WHERE user_id=${userId} ORDER BY created_at DESC`
        res.json({ success: true, creations })

    } catch (error) {

        res.json({ success: false, message: error.message })

    }
}

export const getPublishedCreation = async (req, res) => {
    try {

        const creations = await sql`SELECT * FROM creations WHERE publish=true ORDER BY created_at DESC`
        res.json({ success: true, creations })

    } catch (error) {

        res.json({ success: false, message: error.message })

    }
}

export const toggleLikeCreation = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { Id } = req.body

        const [creation] = await sql`SELECT * FROM creations WHERE id=${Id}`
        if (!creation) {
            return res.json({ success: false, message: 'Creation not found' })
        }
        const { like } = creation
        const userIdstr = userId.toString()
        let updatedLikes;
        let message;
        if (like.includes(userIdstr)) {
            updatedLikes = like.filter(id => id !== userIdstr)
            message = 'Like removed'
        } else {
            updatedLikes = [...like, userIdstr]
            message = 'Like added'
        }
        const formattedarray=`{${updatedLikes.json(',')}}`
        await sql`UPDATE creations SET like=${formattedarray}::text[] WHERE id=${Id}`;




        res.json({ success: true, creations })

    } catch (error) {

        res.json({ success: false, message: error.message })

    }
}
