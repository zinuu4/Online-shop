exports.get404 = (req, res, next) => {
  res
    .status(404)
    .render('404', { documentTitle: '404 Page', title: 'Page Not Found!' });
};
