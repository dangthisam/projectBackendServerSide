

const indexContact =async (req, res) => {
    res.render("clients/pages/contacts/index", {
        title: "Liên hệ"
    });
}

module.exports = {
    indexContact
}