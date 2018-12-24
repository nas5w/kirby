const getPostFiles = (fs, postDir) => {
    return new Promise((resolve, reject) => {
        fs.readdir(postDir, function(err, files) {
            if (err) {
                return reject('Could not list the directory.', err);
            }
            return resolve(files);
        });
    });
};

module.exports = getPostFiles;
