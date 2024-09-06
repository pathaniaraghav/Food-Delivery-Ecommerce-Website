const User = require("../models/auth");

// Signup handler
async function handleUserSignup(req, resp) {
    const {name ,email,username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username,email });
    if (existingUser) {
        return resp.json({ success: false, message: "Username and Email already exists. Please choose another one." });
    }

    // Directly store the plain text password (Not recommended for production)
    await User.create({ name,email,username, password });
    return resp.redirect("/login.html");
}

// Login handler
async function handleUserLogin(req, resp) {
    const { username, password } = req.body;

    if(!username || !password)
    {
        resp.json({error:"All fields are required"});
    }
    // Directly match the plain text password
    const user = await User.findOne({ username, password });

    if (!user) {
        return resp.redirect("/login.html?error=Invalid Username or Password");
    }
    return resp.redirect("/home.html");
}

async function redirecttochangepassword(req,resp)
{
    return resp.render('change-password');
}

async function changepassword(req,resp)
{
    try
    {
        const {username,newPassword}=req.body;
        if(!username||!newPassword)
        {
            resp.render('change-password',{message:'all fields are required'});
        }
        const updatedUser=await User.findOneAndUpdate(
            {username:username},
            {password:newPassword},
            {new:true}
        );
    
        if(!updatedUser)
        {
            return resp.render('change-password',{message:'User not found'});
        }
        return resp.redirect('/login.html');
    }catch(error)
    {
        resp.render('change-password',{message:"An error occured",error});
    }
}

async function redirecttodelete(req,resp)
{
    return resp.render('delete-account')
}

async function deleteaccount(req,resp)
{
    try
    {
        const {username}=req.body;
        if (!username) {
            return resp.render('delete-account', { message: 'Username is required' });
        }
        const result = await User.findOneAndDelete({ username });
        if (!result) {
            return resp.render('delete-account', { message: 'User not found' });
        }
        return resp.redirect('/login.html');
    }
    catch(error)
    {
        return resp.render('delete-account',{message:'An error occured',error});
    }
}

module.exports = {
    handleUserSignup,
    handleUserLogin,
    changepassword,
    redirecttochangepassword,
    redirecttodelete,
    deleteaccount
};
