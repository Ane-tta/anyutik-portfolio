const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const multer = require("multer");
const nodemailer = require("nodemailer");
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.get("/", (_req, res) => {
	res.sendFile(`${__dirname}/index.html`, (err) => {
		if (err) {
			res.end("The server is not available");
		}
	});
});

app.get("*", function (_req, res) {
	res.redirect("/");
});

app.post("/contact", multer().none(), async (req, res) => {
	// try {
	// 	const { status, error, response } = await sendEmail(req.body);
	// 	res.status(status).send(response || error);
	// } catch(err) {
	// 	res.status(err.responseCode || 502).send();
	// }

	res.status(400).send();
});

app.listen(port, () => console.log(`App is listening on port ${port}`));

const sendEmail = (content) => {
	return new Promise((resolve, reject) => {
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: "awesomekittyhere@gmail.com",
				pass: "338090aA",
			},
		});

		var mailOptions = {
			from: "awesomekittyhere@gmail.com",
			to: "favourite.ak@gmail.com",
			subject: "Sending Email using Node.js",
			html: `<div>
			<p><strong>Name: </strong>${content.name}</p>
			<p><strong>Email: </strong>${content.email}</p>
			${content.phone ? `<p><strong>Phone: </strong>${content.phone}</p>` : ""}
			<p><strong>Message: </strong>${content.message}</p>
		</div>`,
		};

		transporter.sendMail(mailOptions, (error, info) => {
			error
				? reject({ status: 502, error })
				: resolve({ status: 200, response: info.response });
		});
	});
};