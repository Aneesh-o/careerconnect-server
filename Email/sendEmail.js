const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service:"gmail",
  port: 587,
  secure: false, 
  auth: {
    user: "muhammadirfank645@gmail.com",
    pass: "fnqcschgvqhaakyn",
  },



  
});

// // async..await is not allowed in global scope, must use a wrapper
// async function main() {
//   // send mail with defined transport object
  

//   // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
// }

// main().catch(console.error);

exports.sendEmail = async (userEmail,jobTitile) =>{
    try {
        const info = await transporter.sendMail({
            from: 'Confirmation mail " <muhammadirfank645@gmail.com>', // sender address
            to: userEmail, // list of receivers
            subject: "Application Confirmation – Your Job Application Has Been Received", // Subject line
            text: "Confirmation email", // plain text body
            html: `<p>Thank you for applying for the <b>${jobTitile}</b>. We have successfully received your application, and our team is currently reviewing your qualifications.You can expect to hear from us soon regarding the next steps in the hiring process. In the meantime,We appreciate your interest and wish you the best of luck!</p>`, // html body
          });
          console.log("Message sent: %s", info);

    } catch (error) {
        console.log(error);
        
    }
}

