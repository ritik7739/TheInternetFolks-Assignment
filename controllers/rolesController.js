const Role = require('../model/roles');

//API to Create a new Role
exports.createRole = async(req,res,next) =>{
    const { name } = req.body;

    try {
      // Create a new role
      const role = new Role({
        name,
      });
  
      await role.save();
  
      res.json({
        status: true,
        content: {
          data: {
            id: role.id,
            name: role.name,
            created_at: role.created_at,
            updated_at: role.updated_at,
          },
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Role creation failed' });
    }
}

//API to Get all roles in a pagigination
exports.getRole = async(req,res,next) =>{
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
  const perPage = 10; // Number of roles per page

  try {
    const totalRoles = await Role.countDocuments();

    const roles = await Role.find()
      .skip((page - 1) * perPage)
      .limit(perPage);

    const totalPages = Math.ceil(totalRoles / perPage);

    res.json({
      status: true,
      content: {
        meta: {
          total: totalRoles,
          pages: totalPages,
          page,
        },
        data: roles.map((role) => ({
          id: role.id,
          name: role.name,
          created_at: role.created_at,
          updated_at: role.updated_at,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching roles' });
  }
}