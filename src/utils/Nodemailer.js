import dotenv from 'dotenv'
import nodemailer from "nodemailer";

dotenv.config({ path:'././.env' })

let transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true, // upgrade later with STARTTLS
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

const sendMail = (mailOptions) => {
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                reject(error);
            } else {
                resolve(info);
            }
        });
    });
};

const validateUserCCAuth = (userccid, userccpass) => {
    let ccTransporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: true, // upgrade later with STARTTLS
        auth: {
            user: userccid,
            pass: userccpass,
        },
    });

    return new Promise((resolve, reject) => {
        ccTransporter.verify((error, success) => {
            if(error) {
                reject(error)
            } else {
                resolve(success)
            }
        })
    })
}

export { sendMail, validateUserCCAuth };
