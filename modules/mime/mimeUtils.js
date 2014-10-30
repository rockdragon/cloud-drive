var mime = require('mime');

var mimeTypes = {
    "application/octet-stream": { t: "Archive", i: "s_web_page_white_compressed_32" },
    "application/x-rar-compressed": { t: "Archive", i: "s_web_page_white_compressed_32" },
    "application/zip": { t: "Archive", i: "s_web_page_white_compressed_32" },
    "application/x-7z-compressed": { t: "Archive", i: "s_web_page_white_compressed_32" },

    "audio/mpeg": { t: "Audio", i: "s_web_page_white_sound_32"},
    "audio/mp4": { t: "Audio", i: "s_web_page_white_sound_32"},
    "video/mp4": { t: "Video", i: "s_web_page_white_film_32"},
    "video/x-matroska": { t: "Video", i: "s_web_page_white_film_32"},
    "application/vnd.rn-realmedia-vbr": { t: "Video", i: "s_web_page_white_film_32"},
    "video/x-msvideo": { t: "Video", i: "s_web_page_white_film_32"},
    "video/x-ms-wmv": { t: "Video", i: "s_web_page_white_film_32"},

    "text/plain": {t: "Document", i: "s_web_page_white_text_32"},
    "application/msword": {t: "Document", i: "s_web_page_white_word_32"},
    "application/vnd.ms-powerpoint": {t: "Document", i: "s_web_page_white_powerpoint_32"},
    "application/vnd.ms-excel": {t: "Document", i: "s_web_page_white_32"},
    "application/pdf": {t: "Document", i: "s_web_page_white_acrobat_32"},

    "text/html": {t: "Code", i: "s_web_page_white_code_32"},
    "application/javascript": {t: "Code", i: "s_web_page_white_code_32"},
    "text/x-java-source": {t: "Code", i: "s_web_page_white_code_32"},

    "image/jpeg": {t: "Picture", i: "s_web_page_white_picture_32"},
    "image/png": {t: "Picture", i: "s_web_page_white_picture_32"},
    "image/gif": {t: "Picture", i: "s_web_page_white_picture_32"},
    "image/bmp": {t: "Picture", i: "s_web_page_white_picture_32"},
    "image/svg+xml": {t: "Picture", i: "s_web_page_white_picture_32"},
    "image/tiff": {t: "Picture", i: "s_web_page_white_picture_32"}
};

module.exports.lookup = function (filename) {
    var mimeText = mime.lookup(filename);
    if (mimeTypes.hasOwnProperty(mimeText))
        return mimeTypes[mimeText];
    return {
        t: "File",
        i: "s_web_page_white_32"
    };
};