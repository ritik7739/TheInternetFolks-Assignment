const Member = require('../model/member'); 
const jwt = require('jsonwebtoken');

exports.addMember = async (req, res, next) => {
  try {
    const { community, user, role } = req.body;
    const token = req.headers.authorization; // Get the JWT token from the headers
    const decodedToken = decodeToken(token);
    const userId = decodedToken.id; // Extract the user's ID from the decoded token

    // Query the Member table to check the user's role in the specified community
    const member = await Member.findOne({ community, user: userId });

    if (!member || member.role !== 'Community Admin') {
      return res.status(403).json({ error: 'NOT_ALLOWED_ACCESS' });
    }

    // Check if the user has the "Community Admin" role in the community
    if (member.role === 'Community Admin') {
      // Create a new Member document
      const newMember = new Member({
        community,
        user,
        role,
        created_at: new Date(),
      });

      // Save the member to the database
      await newMember.save();

      res.status(201).json({
        status: true,
        content: {
          data: newMember,
        },
      });
    } else {
      return res.status(403).json({ error: 'NOT_ALLOWED_ACCESS' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error adding member' });
  }
};

// Function to decode JWT token 
function decodeToken(token) {
  const decoded = jwt.verify(token, 'your-secret-key-here');
  return decoded;
}
