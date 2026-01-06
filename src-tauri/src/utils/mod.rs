use regex::{Regex, Captures};

pub mod file_tree_handler;

pub fn match_rsn_target(name: &str) -> Option<Captures<'_>> {
    let re = Regex::new(r"^__rsn-(\w+)\.(.+)$").unwrap();
    return re.captures(name);
}