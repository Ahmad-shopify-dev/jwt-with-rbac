export const checkUserRole = (role) => {
    return (req, res, next) => {
        if(!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access for user role.",
                data: null
            })
        }

        if(req.user.role !== role) {
            return res.status(403).json({
                success: false,
                message: "Access Denied! you do not have access to this resource",
                data: null
            })
        }

        next();
    }
} 

