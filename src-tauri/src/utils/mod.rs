use regex::{Captures, Regex};

use crate::nodes::NodeType;

pub mod file_tree_handler;

pub fn match_rsn_target(name: &str) -> Option<Captures<'_>> {
    let re = Regex::new(r"^__rsn-(\w+)\.(.+)$").unwrap();
    return re.captures(name);
}

fn match_date(name: &str) -> Option<Captures<'_>> {
    let re = Regex::new(r"^(\d{4})-(\d{2})-(\d{2})$").unwrap();
    return re.captures(name);
}

pub fn is_valid_date(name: &str) -> bool {
    let mut year: u16 = 0;
    let mut month: u16 = 0;
    let mut day: u16 = 0;

    match_date(name).map(|caps| {
        year = caps
            .get(1)
            .map(|m| m.as_str().parse::<u16>().unwrap_or(0))
            .unwrap_or(0);
        month = caps
            .get(2)
            .map(|m| m.as_str().parse::<u16>().unwrap_or(0))
            .unwrap_or(0);
        day = caps
            .get(3)
            .map(|m| m.as_str().parse::<u16>().unwrap_or(0))
            .unwrap_or(0);
    });

    if year < 1900 || year > 3000 {
        return false;
    }

    if month < 1 || month > 12 {
        return false;
    }

    let days_in_month = match month {
        1 | 3 | 5 | 7 | 8 | 10 | 12 => 31,
        4 | 6 | 9 | 11 => 30,
        2 => {
            let leap = (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
            if leap {
                29
            } else {
                28
            }
        }
        _ => unreachable!(),
    };

    return day >= 1 && day <= days_in_month;
}

pub fn generate_rsn_name(name: &String, node_type: &NodeType) -> String {
    let rsn_name = match node_type {
        NodeType::Calendar => {
            format!("__rsn-calendar.{}", &name)
        }
        _ => name.clone(),
    };
    return rsn_name;
}
