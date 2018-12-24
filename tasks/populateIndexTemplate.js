const populateIndexTemplate = (handlebars, template, blogPosts, config) => {
    return new Promise((resolve, reject) => {
        const compiledTemplate = handlebars.compile(template);
        const context = {
            websiteName: config.websiteName || 'Kirby Blog',
            blogPosts: blogPosts
        };

        resolve(compiledTemplate(context));
    });
};

module.exports = populateIndexTemplate;
