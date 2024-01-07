const Community = require('../model/community');
const Member = require('../model/member');
const jwt = require('jsonwebtoken');
const User = require('../model/user');

//API to Create a Community
exports.create = async(req,res,next) =>{
    const { name } = req.body;
  const token = req.header('Authorization'); // Retrieve the JWT token from the headers

  try {
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify and decode the JWT token
    const decoded = jwt.verify(token, 'your-secret-key-here');

    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const owner = decoded.id;

    // Generate a slug based on the name (you can use a library like slugify)
    const slug = name.toLowerCase().replace(/ /g, '-');

    const community = new Community({
      name,
      slug,
      owner,
    });

    await community.save();

    // Add the owner as a member with the role "Community Admin"
    const member = new Member({
      community: community._id,
      user: owner,
      role: 'Community Admin', 
    });

    await member.save();

    res.json({
      status: true,
      content: {
        data: {
          id: community._id,
          name: community.name,
          slug: community.slug,
          owner: community.owner,
          created_at: community.created_at,
          updated_at: community.updated_at,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Community creation failed',error:error });
  }
}

//API to get All Communities-
exports.getAll = async(req,res,next) =>{
   const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
  const perPage = 10; // Number of communities per page

  try {
    const totalCommunities = await Community.countDocuments();

    const communities = await Community.find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .select('name slug owner created_at updated_at');

    const totalPages = Math.ceil(totalCommunities / perPage);

    const result = await Promise.all(
      communities.map(async (community) => {
        const owner = await User.findById(community.owner); // Fetch owner's name

        return {
          id: community._id, // Use _id for MongoDB documents
          name: community.name,
          slug: community.slug,
          owner: {
            id: community.owner,
            name: owner ? owner.name : 'Unknown', // Provide a default if the owner is not found
          },
          created_at: community.created_at,
          updated_at: community.updated_at,
        };
      })
    );

    res.json({
      status: true,
      content: {
        meta: {
          total: totalCommunities,
          pages: totalPages,
          page,
        },
        data: result,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching communities' });
  }
}

//API to get All Community Members =
exports.getAllMembers = async(req,res,next) =>{
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
  const perPage = 10; // Number of members per page
  const communityId = req.params.id;

  try {
    const totalMembers = await Member.countDocuments({ community: communityId });

    const members = await Member.find({ community: communityId })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate('user', 'id name') // Expand the user with id and name only
      .populate('role', 'id name'); // Expand the role with id and name

    const totalPages = Math.ceil(totalMembers / perPage);

    res.json({
      status: true,
      content: {
        meta: {
          total: totalMembers,
          pages: totalPages,
          page,
        },
        data: members.map(async(member) => {
          const user= User.findById(member.user);
         return{
          id: member.id,
          community: member.community,
          user: {
            id: member.user,
            name: user.name,
          },
          role: {
            id: member.role,
            name: member.role,
          },
          created_at: member.created_at,
        }
      }),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching members' });
  }
}

