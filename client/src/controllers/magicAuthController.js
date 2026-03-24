const jwt = require("jsonwebtoken");
const User = require("./models/User");
const sendEmail = require("../../utils/sendEmail");

exports.sendMagicLink = async (req, res) => {
  const { email } = req.body;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({ email });
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "10m" }
  );

  const link = `${process.env.CLIENT_URL}/magic-login/${token}`;

  const html = `
    <div style="font-family: Arial;">
      <h2>Login to Sandy’s Sweet Nest 🍰</h2>
      <p>Click below to login securely:</p>
      <a href="${link}" style="padding:10px 20px;background:#f472b6;color:white;text-decoration:none;border-radius:6px;">
        Login Now
      </a>
      <p>This link expires in 10 minutes.</p>
    </div>
  `;

  await sendEmail(email, "Your Magic Login Link 🍰", html);

  res.json({ message: "Magic link sent to email" });
};

exports.verifyMagicLink = async (req, res) => {
  try {
    const { token } = req.params;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    res.json({
      token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      }),
      user,
    });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired link" });
  }
};
