const express = require("express");
const app = express();
const path = require("path")
const dotEnv = require("dotenv");
const helmet = require("helmet");
const dbConnection = require("./config/dbConnection");
const UserModel = require("./model/userModel");
const jwt = require("jsonwebtoken");
const { checkreqbody } = require("./utility/bodyValidation");
const ConversionModel = require("./model/conversionModel");
const MessageModel = require("./model/messageModel");

// dotEnv.config({path: path.join(__dirname,`./config/${process.env.NODE_ENV}.env`)})

// db
dbConnection();

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(helmet());

app.post("/sig_up_User", async (req, res) => {

    // const { mobile, password, email, name } = req.body;
    try {

        for (const key in req.body) {
            if (req.body[key] === "") {
                return res.status(422).json({ success: false, msg: "pleae Check request body", error: `error in ${key} field` })
            }
        }

        const newUser = new UserModel(req.body)
        await newUser.save();
        res.status(200).json({ success: true, msg: "user register successful!" })

    } catch (error) {
        res.status(500).json({ success: false, msg: "internal server Error !" })
    }
})

app.post("/login", async (req, res) => {
    const { mobile, password } = req.body
    try {

        if (!mobile || !password) {
            return res.status(422).json({ success: false, msg: "pleae Check request body", error: `error in field` })
        }

        const findUser = await UserModel.findOne({ mobile }).select("+password");
        if (!findUser.mobile) {
            return res.status(404).json({ success: false, msg: "user Not found" })
        }
        const isPasswordMatch = await findUser.comparePassword(password)
        console.log(isPasswordMatch, "match")
        if (!isPasswordMatch) {
            return res.status(400).json({ success: true, msg: "credential mismatch !" })
        }

        const token = await findUser.generateJwt();

        if (!token) {
            return res.status(400).json({ success: true, msg: "credential mismatch !" })
        }
        res.status(200).json({ success: true, token: token, msg: "user login successfull!" })
    } catch (error) {
        res.status(500).json({ success: false, msg: "internal server Error !" })
    }
})

app.post("/creat_conversion", async (req, res) => {

    try {
        const { senderId, receiverId } = req.body;
        if (!senderId || !receiverId) {
            return res.status(422).json({ success: false, msg: "pleae Check request body", error: `error in field` })
        }
        const findConversation = await ConversionModel.findOne({ members: { $eq: [senderId, receiverId] } });
        // if already conversation in db that time not add new convesation

        if (!findConversation) {
            const conversation = new ConversionModel({ members: [senderId, receiverId] })
            await conversation.save();
        }
        res.status(200).json({ success: true, msg: "conversation get Successfull" });

    } catch (error) {
        res.status(500).json({ success: false, msg: "internal server Error !" })
    }
})

app.get("/creat_conversion/:userId", async (req, res) => {
    const userId = req.params.userId
    try {

        const findconversation = await ConversionModel.find({ members: { $in: [userId] } })

        const findReceiveruser = await Promise.all(findconversation.map(async (item) => {
            let receiverid = item.members.find((item) => item !== userId);
            return await UserModel.findById(receiverid);
        }))

        res.status(200).json({ success: true, findReceiveruser, msg: "conversation get !" })
    } catch (error) {
        res.status(500).json({ success: false, msg: "internal server Error !" })
    }
})

app.post("/message", async (req, res) => {

    const { senderId, conversationId, message, receiverId } = req.body;
    try {
        if (!senderId || !conversationId || !message) {
            return res.status(422).json({ success: false, msg: "check request body" })
        }
        const createMessate = new MessageModel({ senderId, conversationId, message, receiverId });
        await createMessate.save();
        res.status(200).json({ success: true, msg: "send message !" })
    } catch (error) {
        res.status(500).json({ success: false, msg: "internal server Error !" })
    }

})

app.get("/message/:conversationId", async (req, res) => {

    const conversationId = req.params.conversationId;
    try {
        const findConversation = await MessageModel.find({ conversationId }, { _id: 0 ,updatedAt:0 ,__v:0})
        res.status(200).json({ success: true, messages: findConversation, msg: "Message !" })
    } catch (error) {
        res.status(500).json({ success: false, msg: "internal server Error !" })
    }

})

app.listen(8080, () => {
    console.log(`server start at port 8080`)
})