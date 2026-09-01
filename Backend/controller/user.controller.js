import User from "../model/user.model.js";
import bcryptjs from "bcryptjs";

// ➤ Meal Counts Based on Plans
const PLAN_MEAL_COUNTS = {
    basic: 30,
    silver: 35,
    gold: 40
};

// ➤ USER SIGNUP FUNCTION
export const signup = async (req, res) => {
    const { fullname, email, password, plan } = req.body;

    if (!fullname?.trim() || !email?.trim() || !password) {
        return res.status(400).json({ message: "Full name, email, and password are required" });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    try {
        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashPassword = await bcryptjs.hash(password, 10);

        const remainingUses = PLAN_MEAL_COUNTS[plan?.toLowerCase()] || 0;  // ✅ Assign meal count based on plan

        const newUser = new User({
            fullname,
            email: normalizedEmail,
            password: hashPassword,
            role: "user",
            plan: plan || "null",
            remainingUses  // ✅ Save remaining meals directly in DB
        });

        await newUser.save();

        return res.status(201).json({
            message: "User created successfully",
            redirectPath: "/profile",
            user: {
                _id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                plan: newUser.plan,
                remainingUses: newUser.remainingUses
            },
        });

    } catch (error) {
        console.error("Error during signup:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ➤ USER LOGIN FUNCTION
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const existingUser = await User.findOne({ email: email.trim().toLowerCase() });

        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcryptjs.compare(password, existingUser.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        return res.status(200).json({
            message: "Login successful",
            redirectPath: "/profile",
            user: {
                _id: existingUser._id,
                fullname: existingUser.fullname,
                email: existingUser.email,
                plan: existingUser.plan,
                remainingUses: existingUser.remainingUses
            },
        });

    } catch (error) {
        console.error("Error during login:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ➤ UPDATE REMAINING MEALS FUNCTION
export const updateMealCount = async (req, res) => {
    const { userId } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.remainingUses > 0) {
            user.remainingUses -= 1;  // ✅ Deduct 1 meal from the user's count
            await user.save();
            return res.status(200).json({ remainingUses: user.remainingUses });
        } else {
            return res.status(400).json({ message: "No remaining meals. Please renew your plan." });
        }
    } catch (error) {
        console.error("Error updating meal count:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ➤ GET USER BY ID FUNCTION
export const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);

    } catch (error) {
        console.error("Error fetching user:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

