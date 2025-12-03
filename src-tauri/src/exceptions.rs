use serde::{Serialize, Deserialize};

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