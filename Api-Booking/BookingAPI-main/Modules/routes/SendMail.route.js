module.exports = function (app) {

  app.get("/Sendmail/:email", function (req, res) {

    const email = req.params.email;

    console.log("Send mail to:", email);

    res.json({
      success: true,
      message: "Email sent to " + email
    });

  });

};