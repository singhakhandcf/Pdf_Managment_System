export enum HttpStatus {
    OK = 200,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
    CREATED = 201,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403
}
export class ApiResponse{
    static SUCCESS : string = 'success';
    static ERROR : string = 'failed';
    static readonly GENERIC_ERROR_MESSAGE: string = 'An error occurred while processing the request';


    static OTP_TIME_LIMIT : string = 'Time limit exceeds please resend Otp';
    static OTP_INVALID : string = 'invalid Otp!';
    static OTP_VERIFIED : string = 'Mobile Number Verified Successfully';
    static OTP_NOT_VERIFIED : string = 'Mobile Number Not Verified';

    static FILE_MISSING : string = "File is missing in the request";
    static INVALID_FORMAT : string = "Please upload a valid file format.";
    static FILE_SIZE_EXCEED : string = "File size exceeds the limit of";
    static FILE_UPLOAD_FAIL : string = "Failed to upload file to s3";
    static CATEGORY_MISSING : string = "Please provide the category.";
    static MEDIA_TYPE_MISSING : string = "Please provide the media type. It can be Video or Img.";
}



// export enum UPLOAD_FILE_SECTIONS {

// }

