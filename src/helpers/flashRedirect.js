export const flashAndRedirect = (req, res, type, message, url) => {
    req.flash(type, message);
    res.redirect(url);
};

export const successRedirect = (req, res, message, url) => {
    flashAndRedirect(req, res, 'succes_msg', message, url);
};

export const errorRedirect = (req, res, message, url) => {
    flashAndRedirect(req, res, 'error_msg', message, url);
};
