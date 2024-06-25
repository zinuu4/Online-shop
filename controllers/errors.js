exports.get404 = (req, res, next) => {
  res.status(404).render('404', {
    pageTitle: '404 Page',
    title: 'Page Not Found!',
    path: undefined,
  });
};

exports.get500 = (req, res, next) => {
  res.status(500).render('500', {
    pageTitle: '500 Page',
    title: 'Some error occurred!',
    path: '/500',
  });
};
