const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/user');

// app.use(bodyParser.json());

//SignUp API
exports.signup = async(req,res,next) => {
    const { name, email, password } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      created_at: new Date(),
    });

    await user.save();

    // Generate a JWT token for the user
    const token = jwt.sign({ id: user._id, email: user.email }, 'your-secret-key-here');

    res.json({
      status: true,
      content: {
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          created_at: user.created_at,
        },
        meta: {
          access_token: token,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Signup failed' });
  }
}

//SignIn API
exports.signin = async(req,res,next) => {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
  
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
  
    // Check if the password matches
    const passwordMatch = await bcrypt.compare(password, user.password);
  
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
  
    // Generate a JWT token for the user
    const token = jwt.sign({ id: user._id, email: user.email }, 'your-secret-key-here');
  
    res.json({
      status: true,
      content: {
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          created_at: user.created_at,
        },
        meta: {
          access_token: token,
        },
      },
    });
}

//Get Me API
exports.getMe = async(req,res,next) =>{
    const token = req.header('Authorization');

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    try {
      const decoded = jwt.verify(token, 'your-secret-key-here');
  
      // Find the user by ID from the JWT token
      const user = await User.findById(decoded.id);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json({
        status: true,
        content: {
          data: {
            id: user._id,
            name: user.name,
            email: user.email,
            created_at: user.created_at,
          },
        },
      });
    } catch (error) {
      res.status(401).json({ error: 'Token is invalid or expired' });
    }
}