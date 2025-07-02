import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'imo60067035@gmail.com',
    pass: 'xezvjklbtvoifccb'
  }
});

const sendEmail = async (to, token) => {
    const url = "http://localhost:5173/resetpassword/"+token;
    let mailOptions = {
      from: '"Rental Management System" <imo60067035@gmail.com>',
      to, 
      subject: 'Change password',
      text: 'Hello world?',
      html: `
<head>
  <style>
    .container {
      background-color: #fff;
      padding: 20px;
      border-radius: 8px;
      max-width: 350px; 
      box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
      text-align: center;
    }
    h1 {
      text-align: center;
    }
    p {
    	margin: 15px 0;
      line-height: 1rem;
    	color: #7b7474e3;
    	font-size: 13px;
      text-align: left;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Password Reset</h1>
    <p>You have initiated a password reset. To gain access to your account and change password, simply click the link below.</p>
    <br />
    <a href=${url}> CLICK HERE </a>
    <br />
    <p>Remember this link will expire after one hour.</p>
  </div>
</body>
 `
    };
    
    return transporter.sendMail(mailOptions);
}
export default sendEmail;
