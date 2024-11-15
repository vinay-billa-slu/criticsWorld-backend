const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const template = "../template/requestResetPassword.handlebars";

const source = fs.readFileSync(path.join(__dirname, template), "utf8");
const compiledTemplate = handlebars.compile(source);

const client = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "", // you email
    pass: "", // generate a password in gmail settings
  },
  host: "smtp.gmail.com",
  post: 465,
});

function sendMail(email, link) {
  const payload = {
    name: email,
    link: link,
  };

  client.sendMail(
    {
      from: "", // your email
      to: email, // user email
      subject: "Reset Password",
      html: compiledTemplate(payload),
    },
    (err) => {
      if (err) {
        return console.log(err);
      }
      return console.log("Success");
    }
  );
}

module.exports = {
  sendMail,
};
