const jwt = require("jsonwebtoken");
const crypto = require("crypto");
module.exports = {
    getJitsiStreams: async (req, res) => {
        const data = jwt.decode(
            req.headers["authorization"].replace("Bearer ", ""),
            process.env.JWT_SECRET
        );

        const roomName = crypto.randomBytes(16).toString("hex");
        
        const jitsiDomain = process.env.JITSI_DOMAIN || "meet.jit.si";
        const jitsiLink = `https://${jitsiDomain}/${roomName}`;
        
        return res.json({
            success: 1,
            roomName: `EduStream_${roomName}`,
            userData: {
                name: data.name,
                avatar: data.photo,
                rol: data.rol
            },
            link: jitsiLink
        });
    }
}