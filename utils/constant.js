var constant = function() {
    this.INTERNAL_SERVER_ERROR = "Internal server error.";
    this.BAD_REQUEST = "Bad request.";
    this.DOCUMENT_UPLOAD_SUCCESS = "Document uploaded successfully.";
    this.SEARCH_RESULT_SUCCESS = "Search result fetched successfully.";
    this.DATA_UPLOADED_SUCCESS = "Data uploaded successfully.";
    this.DATA_UPLOADED_FAILURE = "Failed to upload data.";
};

module.exports = new constant();