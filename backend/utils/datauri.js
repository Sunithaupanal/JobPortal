import DataUriParser from "datauri/parser.js"

import path from "path";

const getDataUri = (file) => {
    const parser = new DataUriParser();
    // Handle different file object structures
    const fileName = file.originalname || file.filename || 'file';
    const extName = path.extname(fileName).toString();
    return parser.format(extName, file.buffer);
}

export default getDataUri;
