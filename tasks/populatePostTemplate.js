const populatePostTemplate = (
    yamlFront,
    handlebars,
    marked,
    template,
    source,
    config
) => {
    return new Promise((resolve, reject) => {
        // Split source into metadata and content
        const contentWithMetadata = yamlFront.loadFront(source);
        const postContent = marked(contentWithMetadata.__content);
        const compiledTemplate = handlebars.compile(template);
        const date = new Date(contentWithMetadata.dateTime);
        const postDate = date.toLocaleDateString(
            config.postDateFormat.locale,
            config.postDateFormat.dateOptions
        );
        const postTime = date.toLocaleTimeString(
            config.postDateFormat.locale,
            config.postDateFormat.timeOptions
        );

        const context = {
            postContent: postContent,
            websiteName: config.websiteName || 'Kirby Blog',
            postTitle: contentWithMetadata.title || '',
            postDate: postDate,
            postTime: postTime
        };
        return resolve({
            title: contentWithMetadata.title,
            permalink: contentWithMetadata.permalink,
            post: compiledTemplate(context)
        });
    });
};

module.exports = populatePostTemplate;
