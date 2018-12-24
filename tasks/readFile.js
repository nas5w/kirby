const readFile = (fs, fileLoc) => {
    return new Promise((resolve, reject) => {
        fs.readFile(fileLoc, 'utf8', function(err, source) {
            if (err) {
                return reject('Could not find the file: ', fileLoc, err);
            }
            return resolve(source);
        });
    });
};

module.exports = readFile;
