use serde::{Deserialize, Serialize};

pub const INVALID_PARAMETER: u16 = 400;
pub const FILE_NOT_FOUND: u16 = 404;
pub const CANNOT_CREATE_FILE: u16 = 406;
pub const CANNOT_DELETE_FILE: u16 = 405;
pub const ALREADY_EXISTS: u16 = 407;
pub const READ_ERROR: u16 = 500;
pub const WRITE_ERROR: u16 = 501;
pub const EXE_PATH_NOT_FOUND: u16 = 402;
pub const TOO_MANY_NODES: u16 = 503;
pub const INVALID_OPERATION: u16 = 504;
pub const COMMING_SOON: u16 = 999;

#[derive(Serialize, Deserialize)]
pub struct BaseException {
    message: String,
    code: u16,
}

impl BaseException {
    pub fn new(message: &str, code: u16) -> Self {
        BaseException {
            message: message.to_string(),
            code,
        }
    }
}
