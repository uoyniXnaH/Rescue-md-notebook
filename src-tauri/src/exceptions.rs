use serde::{Serialize, Deserialize};

// pub const FILE_NOT_FOUND: u16 = 404;
pub const CANNOT_CREATE_FILE: u16 = 406;
pub const CANNOT_DELETE_FILE: u16 = 405;
pub const READ_ERROR: u16 = 500;
pub const WRITE_ERROR: u16 = 501;
pub const EXE_PATH_NOT_FOUND: u16 = 402;

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