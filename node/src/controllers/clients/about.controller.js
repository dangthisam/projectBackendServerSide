

const indexAbout = async (req, res) => {
    res.render("clients/pages/about/index", {
        title: "Giới thiệu"
    });
}

module.exports = {
    indexAbout
}